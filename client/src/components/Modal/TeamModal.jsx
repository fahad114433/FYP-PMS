import { useState } from "react";
import { X, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

import {
  useCreateTeamMutation,
  useUpdateTeamByIdMutation,
} from "../../redux/Api/teamSlice";

const TeamModal = ({ team, setIsShowModal, isEdit, setIsEdit, refetch }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    teamName: team?.teamName || "",
    active: team?.active ?? true,
  });
  const [errors, setErrors] = useState({});
  let [createTeam] = useCreateTeamMutation();
  let [updateTeamById] = useUpdateTeamByIdMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (data) => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEdit) {
        let res = await updateTeamById({ teamId: team._id, data });
        toast.success(res?.message || "Team Updated Successfully.");
      } else {
        let res = await createTeam(formData);
        toast.success(res?.message || "Team Created Successfully.");
      }
      refetch();
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Team creation failed");
    } finally {
      setIsSubmitting(false);
      setIsShowModal(false);
    }
    // Reset form
    setFormData({
      teamName: "",
      isActive: true,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required";
    } else if (formData.teamName.trim().length < 2) {
      newErrors.teamName = "Team name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStatusUpdate = (e) => {
    setFormData((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const handleClose = () => {
    setIsShowModal(false);
    setIsEdit(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-none backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Team" : "Create New Team"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Team Name */}
              <div>
                <label
                  htmlFor="teamName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.teamName ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter team name"
                />
                {errors.teamName && (
                  <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>
                )}
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${formData.active ? "bg-green-500" : "bg-gray-400"
                        }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {formData.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleStatusUpdate}
                    className="focus:outline-none"
                  >
                    {formData.active ? (
                      <ToggleRight className="w-8 h-8 text-indigo-600 hover:text-indigo-700 transition-colors" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400 hover:text-gray-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  handleSubmit(formData);
                }}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {isEdit ? "Updating" : "Creating"}...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Check className="w-5 h-5 mr-2" />
                    {isEdit ? "Update Team" : "Create Team"}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
