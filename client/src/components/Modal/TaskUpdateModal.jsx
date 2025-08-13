import { useState, useEffect } from "react";
import { X, CheckCircle, TrendingUp, Calendar, Save } from "lucide-react";
import { useTaskAssignUpdateMutation } from "../../redux/Api/taskSlice";
import { toast } from "react-toastify";

export default function TaskProgressModal({
  taskDetails,
  isOpen = true,
  onClose,
  userId,
  taskId,
  refetch,
}) {
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    taskProgress: taskDetails?.taskProgress || 0,
    taskStatus: taskDetails?.taskStatus || "pending",
  });
  let [taskAssignUpdate] = useTaskAssignUpdateMutation();

  useEffect(() => {
    if (taskDetails) {
      setFormData({
        taskProgress: taskDetails?.taskProgress || 0,
        taskStatus: taskDetails?.taskStatus || "pending",
      });
      setErrors({});
    }
  }, [taskDetails]);

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(100, value));

    setFormData((prev) => ({
      ...prev,
      taskProgress: clampedValue,
    }));

    // Clear error when user updates progress
    if (errors.taskProgress) {
      setErrors((prev) => ({
        ...prev,
        taskProgress: "",
      }));
    }
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      taskStatus: e.target.value,
    }));

    // Clear error when user updates status
    if (errors.taskStatus) {
      setErrors((prev) => ({
        ...prev,
        taskStatus: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.taskProgress < 1 || formData.taskProgress > 100) {
      newErrors.taskProgress = "Progress must be between 1 and 100";
    }

    if (!formData.taskStatus) {
      newErrors.taskStatus = "Please select a status";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      // Simulate API call
      let res = await taskAssignUpdate({ taskId, userId, formData });
      if (res.error) {
        toast.error(res?.message || "Updation Failed");
      } else {
        toast.success(res?.message || "Updated Successfully.");
      }
      refetch();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error?.message || "Task Update Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "InProgress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "InProgress":
        return "In Progress";
      case "Completed":
        return "Completed";
      default:
        return "Unknown";
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-none bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Update Task Progress
              </h2>
              <p className="text-sm text-gray-600">Manage task completion</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Progress Percentage */}
            <div>
              <label
                htmlFor="progressInput"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Progress Percentage
              </label>
              <div className="relative mb-4">
                <input
                  type="number"
                  id="progressInput"
                  min="0"
                  max="100"
                  value={formData.taskProgress}
                  onChange={handleProgressChange}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${errors.progress ? "border-red-500" : "border-gray-300"
                    }`}
                  placeholder="0-100"
                />
                <TrendingUp className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full transition-all duration-500 ease-out flex items-center justify-center"
                    style={{ width: `${formData.taskProgress}%` }}
                  >
                    {formData.taskProgress > 15 && (
                      <span className="text-white text-xs font-semibold">
                        {formData.taskProgress}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600 mt-1">
                  Progress: {formData.taskProgress}%
                </div>
              </div>

              {errors.taskProgress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.taskProgress}
                </p>
              )}
            </div>

            {/* Task Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.taskStatus}
                  onChange={handleStatusChange}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors appearance-none bg-white ${errors.taskStatus ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="InProgress">InProgress</option>
                  <option value="Completed">Completed</option>
                </select>
                <Calendar className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
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

              {/* Status Display */}
              <div className="mt-3">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium ${getStatusColor(
                    formData.taskStatus
                  )}`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Current Status: {getStatusLabel(formData.taskStatus)}
                </div>
              </div>

              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.taskStatus}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
