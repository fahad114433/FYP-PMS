import Project from '../models/Project.js'
import Module from '../models/ProjectSection.js'
import Task from '../models/Task.js'
import Team from '../models/Team.js'
import TeamMember from '../models/TeamDetail.js'
import TaskAssignment from '../models/TaskAssignment.js'
import TeamAssignedToModule from '../models/TeamAssignedToModule.js'
import { contactMessageSender } from '../utils/Notification.js'


let adminDashboard = async (req, res) => {
    try {
        let projectCount = await Project.find({}).countDocuments()
        let moduleCount = await Module.find({ active: true }).countDocuments()
        let completedTaskCount = await Task.find({ isCompleted: true }).countDocuments()
        let teamCount = await Team.find({}).countDocuments()
        let memberCount = await TeamMember.find({}).countDocuments()
        let taskStatusCount = await TaskAssignment.find({ taskStatus: "Pending" }).countDocuments()

        return res.status(200).json({
            projectCount,
            moduleCount,
            completedTaskCount,
            teamCount,
            memberCount,
            taskStatusCount
        })

    } catch (error) {
        console.log("Internal server error ", error)
        return res.status(500).json({ message: "Internal server error D-0" })
    }
}

let userDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Find all teams the user is a member of
        const userTeams = await TeamMember.find({ userId }).select('teamId');
        const teamIds = userTeams.map(tm => tm.teamId);


        // 2. Find all modules where the user is the leader
        // Adjust 'teamLeaderId' if your schema uses a different field name
        const modules = await Module.find({ teamLeader: userId }).select('_id projectId moduleName');
        const moduleProjectMap = {};
        const projectIds = [];
        modules.forEach(mod => {
            moduleProjectMap[mod._id] = mod.projectId;
            projectIds.push(mod.projectId);
        });

        // 4. Get project names
        const projects = await Project.find({ _id: { $in: projectIds } }).select('_id projectName');
        const projectNameMap = {};
        projects.forEach(project => {
            projectNameMap[project._id] = project.projectName;
        });

        // 5. Find all tasks assigned to the user
        const taskAssignments = await TaskAssignment.find({ userAssignedTo: userId }).select('taskId');
        const taskIds = taskAssignments.map(ta => ta.taskId);
        // Count only completed tasks that are assigned to the user
        const completedTasksCounts = await Task.find({ _id: { $in: taskIds }, isCompleted: true }).countDocuments();

        // 6. For each task, get its module and project with names
        const tasks = await Task.find({ _id: { $in: taskIds } }).select('_id moduleId name');
        const taskDetails = [];
        for (const task of tasks) {
            // Get the module and project for this task
            const moduleId = task.moduleId;
            const projectId = moduleProjectMap[moduleId] || (await Module.findById(moduleId).select('projectId')).projectId;

            // Get module name
            const module = modules.find(m => m._id.toString() === moduleId.toString());
            const moduleName = module ? module.moduleName : 'Unknown Module';

            // Get project name
            const projectName = projectNameMap[projectId] || 'Unknown Project';

            taskDetails.push({
                taskId: task._id,
                taskName: task.name,
                moduleId,
                moduleName,
                projectId,
                projectName
            });
        }

        // 7. Prepare module info (moduleId, projectId, moduleName, projectName)
        const moduleDetails = modules.map(mod => ({
            moduleId: mod._id,
            moduleName: mod.moduleName,
            projectId: mod.projectId,
            projectName: projectNameMap[mod.projectId] || 'Unknown Project',
        }));

        return res.status(200).json({
            modules: moduleDetails,
            tasks: taskDetails,
            completedTask: completedTasksCounts
        });

    } catch (error) {
        console.log("Something went wrong ", error)
        return res.status(500).json({ message: "Internal server error D-2" })
    }
}

let contactMessage = async (req, res) => {
    let { name, email, phone, message } = req.body;
    try {
        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: "All fields are required" })
        }
        contactMessageSender(name, email, phone, message)
        return res.status(200).json({ message: "Message sent successfully" })
    } catch (error) {

    }
}

export { adminDashboard, userDashboard, contactMessage }