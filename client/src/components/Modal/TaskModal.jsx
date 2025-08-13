import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  Briefcase,
  AlignLeft,
  Flag,
  ToggleRight,
  ToggleLeft,
  CheckCircle,
} from "lucide-react";
import { priorities } from "../../utils/constant";

const TaskModal = ({
  task,
  setIsShowModal,
  isEdit,
  setIsEdit,
  moduleId,
  errors,
  setErrors,
  isSubmitting,
  handleSubmit,
}) => {
  const [formData, setFormData] = useState({
    moduleId: moduleId,
    taskName: task?.name || "",
    description: task?.description || "",
    priority: task?.priority || "",
    active: task?.active ?? true,
    isCompleted: task?.isCompleted ?? false,
  });

  const handleUpdate = (e) => {
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

  const handleStatusToggle = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClose = () => {
    setIsShowModal(false);
    if (isEdit) {
      setIsEdit(false);
    }
    setFormData({
      moduleId: null,
      taskName: "",
      description: "",
      priority: "",
      active: true,
      isCompleted: false,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-none bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 transform transition-all duration-300 scale-100 max-h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEdit ? "Update Task Details" : "Create New Task"}
              </h2>
              <p className="text-sm text-gray-600">Add task details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form - Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            {/* Module Name */}
            <div>
              <label
                htmlFor="taskName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="taskName"
                  name="taskName"
                  value={formData.taskName}
                  onChange={handleUpdate}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.taskName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Task name"
                />
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.taskName && (
                <p className="text-red-500 text-sm mt-1">{errors.taskName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleUpdate}
                  rows={3}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter task description..."
                />
                <AlignLeft className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              </div>
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleUpdate}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white ${
                    errors.priority ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select priority</option>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                <Flag
                  className={`w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 ${getPriorityColor(
                    formData.priority
                  )}`}
                />
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
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
              )}
            </div>

            {/* Active Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Status
              </label>
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      formData.active ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {formData.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusToggle("active")}
                  className="focus:outline-none"
                >
                  {formData.active ? (
                    <ToggleRight className="w-8 h-8 text-blue-600 hover:text-blue-700 transition-colors" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400 hover:text-gray-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Completed Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Status
              </label>
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle
                    className={`w-4 h-4 mr-3 ${
                      formData.isCompleted
                        ? "text-green-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {formData.isCompleted ? "Completed" : "Not Completed"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStatusToggle("isCompleted")}
                  className="focus:outline-none"
                >
                  {formData.isCompleted ? (
                    <ToggleRight className="w-8 h-8 text-green-600 hover:text-green-700 transition-colors" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-gray-400 hover:text-gray-500 transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleSubmit(formData);
              setIsShowModal(false);
            }}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {isEdit ? "Updating..." : "Creating..."}
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Update Task" : "Create Task"}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
