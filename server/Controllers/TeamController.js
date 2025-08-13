import Team from "../models/Team.js";
import TeamDetail from "../models/TeamDetail.js";
import User from "../models/User.js";
import { userAddedToTeam } from "../utils/Notification.js";

// Create a new team
const createTeam = async (req, res) => {
    const { teamName } = req.body;
    try {
        const team = await Team.create({ teamName });
        res.status(201).json(team);
    } catch (err) {
        console.error("T-01", err);
        res.status(500).json({
            message: "Error adding member to team t-01",
            error: err.message,
        });
    }
};

// Get all teams
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({ active: true })
        if (teams === 0) {
            return res.status(400).json({ message: "No team found." })
        }

        let teamLeaderId = await TeamDetail.findOne({ isLeader: true }).select("userId -_id")

        return res.status(200).json(teams);

    } catch (err) {
        console.error("T-02", err);
        res.status(500).json({
            message: "Error adding member to team t-02",
            error: err.message,
        });
    }
};

// Get a single team by ID
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.status(200).json(team);
    } catch (err) {
        console.error("T-03", err);
        res.status(500).json({
            message: "Error adding member to team t-3",
            error: err.message,
        });
    }
};

// Update team
const updateTeamById = async (req, res) => {
    try {
        const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!team) return res.status(404).json({ message: "Team not found" });
        res.status(200).json(team);
    } catch (err) {
        console.error("T-04", err);
        res.status(500).json({
            message: "Error adding member to team t-04",
            error: err.message,
        });
    }
};

// Delete team
const deleteTeamById = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        await TeamDetail.deleteMany({ teamId: req.params.id }); // Remove all members from that team
        res.status(200).json({ message: "Team and its members deleted" });
    } catch (err) {
        console.error("T-05", err);
        res.status(500).json({
            message: "Error adding member to team t-05",
            error: err.message,
        });
    }
};

// Add member to a team
const addMemberToTeam = async (req, res) => {
    const { teamId, userId, isLeader } = req.body;

    try {
        const user = await User.findById(userId).select("name email active");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        if (!user.active) {
            return res.status(400).json({ message: "User is not active." });
        }

        const alreadyExists = await TeamDetail.findOne({ teamId, userId }).populate([
            { path: "teamId", select: "teamName" },
            { path: "userId", select: "name email" }
        ]);

        if (alreadyExists) {
            return res.status(400).json({ message: "User already in the team" });
        }

        if (isLeader) {
            const isLeaderExist = await TeamDetail.findOne({ teamId, isLeader: true });
            if (isLeaderExist) {
                return res.status(400).json({ message: "Team Leader already exists." });
            }
        }
        const detail = await TeamDetail.create({ teamId, userId, isLeader });
        res.status(201).json(detail);

        const team = await Team.findById(teamId).select("teamName");
        if (!team) {
            console.warn("❗ Cannot send email: team not found");
            return;
        }
        await userAddedToTeam(user.name, user.email, team.teamName);

    } catch (err) {
        console.error("T-06", err);
        res.status(500).json({
            message: "Error adding member to team t-06",
            error: err.message,
        });
    }
};

// Get all members of a team
const getTeamMembers = async (req, res) => {
    try {
        const members = await TeamDetail.find({ teamId: req.params.teamId })
            .populate("userId", "name email designation active")
            .populate("teamId", "teamName");
        const filteredMembers = members.map((member) => ({
            teamId: member.teamId?._id,
            userId: member.userId?._id,
            name: member.userId?.name,
            email: member.userId?.email,
            designation: member.userId?.designation,
            active: member.userId?.active,
            teamName: member.teamId?.teamName,
            isLeader: member.isLeader
        }));
        return res.status(200).json(filteredMembers);
    } catch (err) {
        console.error("T-07", err);
        res.status(500).json({
            message: "Error adding member to team t-07",
            error: err.message,
        });
    }
};

const updateTeamLeaderStatusById = async (req, res) => {
    try {
        let { isLeader, teamId, userId } = req.body;

        // Validate required fields
        if (isLeader === undefined || isLeader === null) {
            return res.status(400).json({ message: "isLeader value is required" });
        }
        if (!teamId) {
            return res.status(400).json({ message: "teamId is required" });
        }
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        // Check if the team member exists
        let teamMember = await TeamDetail.findOne({ teamId, userId });
        if (!teamMember) {
            return res.status(404).json({ message: "Team member not found" });
        }

        // If setting someone as leader, first remove leader status from all other members in the same team
        if (isLeader) {
            await TeamDetail.updateMany(
                { teamId: teamId, userId: { $ne: userId } },
                { $set: { isLeader: false } }
            );
        }

        // Update the specific member's leader status
        let isUpdated = await TeamDetail.findOneAndUpdate(
            { teamId: teamId, userId: userId },
            { $set: { isLeader: isLeader } },
            { new: true }
        );

        if (!isUpdated) {
            return res.status(400).json({
                message: "Something went wrong, try again after sometime"
            });
        }

        return res.status(200).json({
            message: `Team member ${isLeader ? 'promoted to leader' : 'leader status removed'} successfully.`,
            data: isUpdated
        });

    } catch (error) {
        console.error("T-08", error);
        res.status(500).json({
            message: "Error updating team member leader status T-08",
            error: error.message,
        });
    }
}

// Remove a member from a team
const removeMemberById = async (req, res) => {
    try {
        const { teamId, userId } = req.params;
        const deletedDetail = await TeamDetail.findOneAndDelete({ teamId, userId });
        if (deletedDetail === null) {
            return res.status(404).json({ message: "Member not found in the team" });
        }
        res.status(200).json({ message: "Member removed from team", deletedDetail });
    } catch (err) {
        console.error("T-09", err);
        res.status(500).json({
            message: "Error adding member to team t-09",
            error: err.message,
        });
    }
};


export {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeamById,
    deleteTeamById,
    addMemberToTeam,
    getTeamMembers,
    updateTeamLeaderStatusById,
    removeMemberById,
}