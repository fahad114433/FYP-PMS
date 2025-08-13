import { useState, useEffect } from "react";
import {
  useGetTeamListQuery,
  useGetMembersByTeamIdQuery,
} from "../../redux/Api/teamSlice";
import { useTaskAssignedToUserMutation } from "../../redux/Api/taskSlice";
import { toast } from "react-toastify";

const TaskAssignModal = ({
  isOpen,
  onClose,
  refetch,
  projectId,
  moduleId,
  taskId,
  setRes,
  projectEndDate,
  teamId
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberId, setMemberId] = useState(""); // separate state for memberId
  const [completionDate, setCompletionDate] = useState("");

  const [formData, setFormData] = useState({
    projectId,
    moduleId,
    taskId,
    teamId: "",
    memberName: "",
    completionDate: "",
  });

  const { data: teams } = useGetTeamListQuery();
  const { data: teamMembers = [], isFetching: isFetchingMembers } =
    useGetMembersByTeamIdQuery(selectedTeamId, { skip: !selectedTeamId });

  const [taskAssignedToUser] = useTaskAssignedToUserMutation();

  let filterTeam = teams?.filter((team) => team._id === teamId)


  // Helper function to format date for Express server (ISO string)
  const formatDateForServer = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString();
  };

  // Helper function to format date for input field (YYYY-MM-DD format)
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Helper function to get the maximum allowed date (project end date or today, whichever is later)
  const getMaxAllowedDate = () => {
    const today = getTodayDate();
    if (!projectEndDate) return null; // No max limit if project end date is not provided

    const projectEnd = formatDateForInput(projectEndDate);
    return projectEnd;
  };

  // Helper function to validate completion date
  const isValidCompletionDate = (dateString) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Check if date is not in the past
    if (selectedDate < today) return false;

    // Check if date doesn't exceed project end date
    if (projectEndDate) {
      const projectEnd = new Date(projectEndDate);
      if (selectedDate > projectEnd) return false;
    }

    return true;
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedTeamId("");
      setSelectedMemberId("");
      setMemberId("");
      setCompletionDate("");
      setFormData({
        projectId,
        moduleId,
        taskId,
        teamId: "",
        memberName: "",
        completionDate: "",
      });
    }
  }, [isOpen, projectId, moduleId, taskId]);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setSelectedTeamId(teamId);
    setSelectedMemberId("");
    setMemberId("");

    setFormData((prev) => ({
      ...prev,
      teamId,
      memberName: "",
    }));
  };

  const handleMemberChange = (e) => {
    const selectedId = e.target.value;
    setSelectedMemberId(selectedId);
    setMemberId(selectedId);

    const selectedMember = teamMembers.find(
      (member) => String(member.userId) === String(selectedId)
    );

    if (selectedMember) {
      setMemberId(selectedMember.userId);
      setFormData((prev) => ({
        ...prev,
        memberName: selectedMember.name,
      }));
    } else {
      setMemberId(selectedId);
      setFormData((prev) => ({
        ...prev,
        memberName: "",
      }));
    }
  };

  const handleCompletionDateChange = (e) => {
    const dateValue = e.target.value;
    setCompletionDate(dateValue);

    // Validate the selected date
    if (!isValidCompletionDate(dateValue)) {
      if (projectEndDate && new Date(dateValue) > new Date(projectEndDate)) {
        toast.error("Task completion date cannot exceed project end date");
      }
    }

    setFormData((prev) => ({
      ...prev,
      completionDate: formatDateForServer(dateValue),
    }));
  };

  const handleFormSubmit = async () => {
    if (formData.teamId && memberId && completionDate) {
      // Validate completion date before submission
      if (!isValidCompletionDate(completionDate)) {
        if (
          projectEndDate &&
          new Date(completionDate) > new Date(projectEndDate)
        ) {
          toast.error("Task completion date cannot exceed project end date");
        } else {
          toast.error("Please select a valid completion date");
        }
        return;
      }

      try {
        let res = await taskAssignedToUser({ memberId, formData }).unwrap();
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success(res?.message);
        }

        refetch && refetch();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Failed to assign task");
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-none backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Assign Task</h2>

        <div className="space-y-6">
          {/* Team Selection */}
          <div>
            <label
              htmlFor="team-select"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Select Team
            </label>
            <select
              id="team-select"
              value={selectedTeamId}
              onChange={handleTeamChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              required
            >
              <option value="">Choose a team...</option>
              {filterTeam?.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>

          {/* Team Member Selection */}
          <div>
            <label
              htmlFor="member-select"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Select Team Member
            </label>
            <select
              id="member-select"
              value={selectedMemberId}
              onChange={handleMemberChange}
              disabled={!selectedTeamId || isFetchingMembers}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">
                {isFetchingMembers
                  ? "Loading members..."
                  : "Choose a member..."}
              </option>
              {teamMembers?.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.name} - {member.designation}
                </option>
              ))}
            </select>
          </div>

          {/* Read-only Team Member Name Field */}
          <div>
            <label
              htmlFor="member-name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Team Member
            </label>
            <input
              id="member-name"
              type="text"
              value={formData.memberName}
              readOnly
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed text-slate-700"
              placeholder="Selected member will appear here"
            />
          </div>

          {/* Completion Date Field */}
          <div>
            <label
              htmlFor="completion-date"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Expected Completion Date <span className="text-red-500">*</span>
            </label>
            <input
              id="completion-date"
              type="date"
              value={completionDate}
              onChange={handleCompletionDateChange}
              min={getTodayDate()}
              max={getMaxAllowedDate()}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {projectEndDate
                ? `Select date between today and ${new Date(
                  projectEndDate
                ).toLocaleDateString()}`
                : "Select the expected completion date for this task"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleFormSubmit}
              disabled={
                !formData.teamId ||
                !memberId ||
                !completionDate ||
                !isValidCompletionDate(completionDate)
              }
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              Assign Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignModal;
