import React, { useState, useEffect } from "react";
import { X, Users, Crown, Package } from "lucide-react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import {
  useGetTeamListQuery,
} from "../../redux/Api/teamSlice";
import {
  useTeamAssignedToModuleMutation,
} from "../../redux/Api/moduleSlice";

const AddTeamLeaderModal = ({
  isShowModal,
  setIsShowModal,
  isLoading = false,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { moduleId } = useParams();

  // RTK Query hooks
  const { data: teams = [], isLoading: teamsLoading } = useGetTeamListQuery();
  const [teamAssignedToModule] = useTeamAssignedToModuleMutation();

  const selectedTeam = teams?.find((team) => team._id === selectedTeamId);

  const handleTeamSelect = (e) => {
    const teamId = e.target.value;
    setSelectedTeamId(teamId);
    setErrors((prev) => ({ ...prev, team: "" }));
  };

  const handleClose = () => {
    setIsShowModal(false);
    setSelectedTeamId("");
    setErrors({});
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    const newErrors = {};

    if (!selectedTeamId) {
      newErrors.team = "Please select a team";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const teamRes = await teamAssignedToModule({
        teamId: selectedTeamId,
        moduleId: moduleId,
      }).unwrap();

      if (teamRes?.error) {
        toast.error(teamRes?.error?.message);
        return;
      }

      toast.success("Team assigned successfully");
      handleClose();
    } catch (error) {
      console.error("Error assigning team:", error);
      toast.error(
        error?.message || error?.message || "Failed to assign team"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isShowModal) return null;

  return (
    <div className="fixed inset-0 bg-none bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Assign Team</h2>
              <p className="text-sm text-gray-600">Select a team to assign</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting || isLoading}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-5">
            {/* Team Selection */}
            <div>
              <label
                htmlFor="teamSelect"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Team
              </label>
              <div className="relative">
                <select
                  id="teamSelect"
                  value={selectedTeamId}
                  onChange={handleTeamSelect}
                  disabled={teamsLoading || isLoading || isSubmitting}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none bg-white ${errors.team ? "border-red-500" : "border-gray-300"
                    } ${teamsLoading || isLoading || isSubmitting
                      ? "cursor-not-allowed bg-gray-50"
                      : ""
                    }`}
                >
                  <option value="" disabled>
                    {teamsLoading ? "Loading teams..." : "Select a team"}
                  </option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.teamName}
                    </option>
                  ))}
                </select>
                <Users className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.team && (
                <p className="text-red-500 text-sm mt-1">{errors.team}</p>
              )}
            </div>

            {/* Selected Team Display */}
            {selectedTeam && (
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center">
                  <Crown className="w-4 h-4 text-indigo-600 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium text-indigo-700">Team: </span>
                    <span className="text-indigo-900">
                      {selectedTeam.teamName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
          <button
            onClick={handleClose}
            disabled={isSubmitting || isLoading}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || !selectedTeamId}
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Assigning...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Assign Team
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeamLeaderModal;