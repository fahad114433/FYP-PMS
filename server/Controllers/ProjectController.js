import Project from '../models/Project.js';

const createProject = async (req, res) => {
    try {
        const { projectName, startDate, endDate, description } = req.body;
        const createdBy = req.user._id;
        // Validate input
        if (!projectName || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        let newStartDate = new Date(startDate)
        let newEndDate = new Date(endDate)


        // Create new project
        const newProject = new Project({
            projectName,
            projectStartDate: newStartDate,
            projectEndDate: newEndDate,
            description,
            createdBy,
        });

        await newProject.save();

        res.status(201).json(newProject);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal server error p-01' });
    }
}

const updateProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user._id.toString();

        const { projectName, startDate, endDate, description, active } = req.body;

        // Find the project by ID
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        // Optional: Only allow the creator to update
        if (project.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this project' });
        }
        if (isNaN(new Date(startDate)) || isNaN(new Date(endDate))) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        let newStartDate = new Date(startDate)
        let newEndDate = new Date(endDate)

        // Update the project fields if provided
        if (projectName) project.projectName = projectName;
        if (startDate) project.projectStartDate = newStartDate;
        if (endDate) project.projectEndDate = newEndDate;
        if (description) project.description = description;
        if (active !== undefined) project.active = active;

        await project.save();

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Internal server error p-02' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id
        const project = await Project.findById(projectId).populate('createdBy', 'name email');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(200).json(project)
    } catch (error) {
        console.error("Error getting project", error)
        return res.status(500).json({ message: "Internal Server Error p-03" })
    }
}

const deleteProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        let modules = await ProjectSection.find({ projectId });
        if (modules.length !== 0) {
            let modulesDeleted = await ProjectSection.deleteMany({ projectId })
            if (!modulesDeleted) {
                return res.status(400).json({ message: 'Failed to delete project sections' });
            }
        }
        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting project", error);
        return res.status(500).json({ message: 'Internal Server Error p-04' });
    }
}

const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
        return res.status(200).json(projects);
    } catch (error) {
        console.error("Error getting all projects", error);
        return res.status(500).json({ message: "Internal Server Error p-05" });
    }
}

export {
    createProject,
    updateProjectById,
    getProjectById,
    deleteProjectById,
    getAllProjects
}