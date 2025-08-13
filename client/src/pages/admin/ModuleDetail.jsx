import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  User,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  Zap,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useGetModuleByIdQuery } from "../../redux/Api/moduleSlice";
import {
  useCreateTaskMutation,
  useUpdateTaskByIdMutation,
  useGetTasksListByIdQuery,
  useDeleteTaskByIdMutation,
} from "../../redux/Api/taskSlice";
import TaskModal from "../../components/Modal/TaskModal";
import AddTeamLeaderModal from "../../components/Modal/AddTeamLeaderModal";

const ModuleDetail = () => {
  const { moduleId, projectId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowTeamLeaderModal, setIsShowTeamLeaderModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: module, isLoading, error } = useGetModuleByIdQuery(moduleId);
  const [createTask] = useCreateTaskMutation();
  const [updateTaskById] = useUpdateTaskByIdMutation();
  const [deleteTaskById] = useDeleteTaskByIdMutation();
  const { data: tasks, refetch } = useGetTasksListByIdQuery(moduleId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCreateTask = () => {
    setIsShowModal(true);
    setIsEdit(false);
    setCurrentTask(null);
    setShowDropdown(false);
  };

  const handleEdit = (task) => {
    setCurrentTask(task);
    setIsEdit(true);
    setIsShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await deleteTaskById(taskId);
      toast.success(res?.message || "Task deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.message || "Error deleting task");
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.taskName.trim()) {
      newErrors.taskName = "Task name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData) => {
    if (!validateForm(formData)) return;

    setIsSubmitting(true);

    try {
      let res;
      if (isEdit) {
        const id = currentTask._id;
        res = await updateTaskById({ taskId: id, data: formData }).unwrap();
        setCurrentTask(null);
        toast.success(
          res?.message || res?.message || "Task updated successfully"
        );
      } else {
        res = await createTask(formData).unwrap();
        toast.success(
          res?.message || res?.message || "Task created successfully"
        );
      }
      refetch();
      setIsShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || error?.message || "Error processing task"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "High":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: AlertCircle,
          label: "High",
        };
      case "Medium":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: Clock,
          label: "Medium",
        };
      case "Low":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: Zap,
          label: "Low",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Clock,
          label: "Unknown",
        };
    }
  };

  const handleAddTeamLeader = () => {
    setShowDropdown(false);
    setIsShowTeamLeaderModal(true);
  };

  const filteredTasks = tasks?.tasksList?.filter((task) => {
    const matchesSearch =
      task.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());


    const matchesActiveFilter =
      filterActive === "all" ||
      (filterActive === "active" && task.active) ||
      (filterActive === "inactive" && !task.active);

    const matchesPriorityFilter =
      filterPriority === "all" ||
      task.priority?.toLowerCase() === filterPriority;

    return matchesSearch && matchesActiveFilter && matchesPriorityFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading module...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error loading module</h3>
            <p className="text-red-600 text-sm mt-1">
              {error?.message || "Failed to load module details"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center mb-6">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Go Back
            </button>
          </div>

          {/* Module Info Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Link
                to={`/admin/projectsList/${projectId}`}
                className="hover:text-indigo-600 transition-colors"
              >
                {module?.projectName}
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900 font-medium">
                {module?.moduleName}
              </span>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center flex-1">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {module?.moduleName}
                  </h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Team Leader:{" "}
                        <span
                          className={`font-medium ${module?.teamLeader
                            ? "text-gray-900"
                            : "text-white bg-red-500 rounded-2xl px-2 py-1"
                            }`}
                        >
                          {!module?.teamLeader
                            ? "Team Leader not Assigned"
                            : module.teamLeader?.name}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center">
                      {module?.active ? (
                        <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </div>
                      ) : (
                        <div className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Three Dot Menu */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                    <div className="py-2">
                      <button
                        onClick={handleCreateTask}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-3 text-indigo-600" />
                        Create Task
                      </button>
                      <button
                        onClick={handleAddTeamLeader}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserPlus className="w-4 h-4 mr-3 text-indigo-600" />
                        Assign Team
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Module Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {module?.description}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Task Management
              </h2>
              <p className="text-gray-600">
                Manage tasks and track progress for this module
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tasks by name, description, or assignee..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="sm:w-48 relative">
                    <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={filterActive}
                      onChange={(e) => setFilterActive(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                    >
                      <option value="all">All Tasks</option>
                      <option value="active">Active Tasks</option>
                      <option value="inactive">Inactive Tasks</option>
                    </select>
                  </div>
                  <div className="sm:w-48 relative">
                    <AlertCircle className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tasks List */}
        {filteredTasks?.length > 0 ? (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
              <div className="min-w-[1200px] grid grid-cols-12 gap-4 font-medium text-gray-700">
                <div className="col-span-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Task Name
                </div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2 text-center">Priority</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-1 text-center">Completion</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <div className="divide-y divide-gray-200 min-w-[1200px]">
                {[...filteredTasks || []].sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))?.map((task, index) => {
                  const priorityConfig = getPriorityConfig(task.priority);
                  const PriorityIcon = priorityConfig.icon;

                  return (
                    <motion.div
                      key={task._id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className={`px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-cyan-25 transition-all duration-200 ${task.active
                        ? "hover:scale-[1.02] shadow-sm hover:shadow-xl hover:border-indigo-200 cursor-pointer"
                        : "opacity-60 cursor-not-allowed shadow-sm"
                        } ${index % 2 === 0 ? "bg-gray-25" : "bg-white"
                        }`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Task Name  */}
                        <div className="col-span-3">
                          <div className="font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                            <Link to={`${task._id}`}>{task.name}</Link>
                          </div>
                        </div>

                        {/* Task description  */}
                        <div className="col-span-3">
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {task.description?.length > 60
                              ? `${task.description.substring(0, 60)}...`
                              : task.description}
                          </p>
                        </div>

                        {/* Task Priority  */}
                        <div className="col-span-2 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.color}`}
                          >
                            <PriorityIcon className="w-3 h-3 mr-1" />
                            {priorityConfig.label}
                          </span>
                        </div>

                        {/* Task Status  */}
                        <div className="col-span-2 text-center">
                          <button
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${task.active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {task.active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </button>
                        </div>

                        {/* Task completion  */}
                        <div className="col-span-1 text-center">
                          <button
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${task.isCompleted
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              }`}
                          >
                            {task.isCompleted ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Complete
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Incomplete
                              </>
                            )}
                          </button>
                        </div>

                        {/* Task Actions  */}
                        <div className="col-span-1 flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center min-h-[200px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 my-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <CheckCircle className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">You don't have any tasks</h3>
            <p className="text-gray-500 text-base max-w-xs mx-auto">Start by creating a new task for this module. All your tasks will appear here and you can manage them easily.</p>
          </motion.div>
        )}

        {/* Footer Stats */}
        {tasks?.tasksList?.length > 0 && (
          <motion.div
            className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {tasks?.tasksList?.length}
                </div>
                <div className="text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tasks?.tasksList?.filter((t) => t.active).length}
                </div>
                <div className="text-gray-600">Active Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {
                    tasks?.tasksList?.filter(
                      (t) => t.priority?.toLowerCase() === "high"
                    ).length
                  }
                </div>
                <div className="text-gray-600">High Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    tasks?.tasksList?.filter(
                      (t) => t.priority?.toLowerCase() === "medium"
                    ).length
                  }
                </div>
                <div className="text-gray-600">Medium Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    tasks?.tasksList?.filter(
                      (t) => t.priority?.toLowerCase() === "low"
                    ).length
                  }
                </div>
                <div className="text-gray-600">Low Priority</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Task Modal */}
      {isShowModal && (
        <TaskModal
          task={currentTask}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setIsShowModal={setIsShowModal}
          moduleId={moduleId}
          refetch={refetch}
          errors={errors}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          handleEdit={handleEdit}
          setErrors={setErrors}
        />
      )}

      {/* Team Leader Modal */}
      {isShowTeamLeaderModal && (
        <AddTeamLeaderModal
          isShowModal={isShowTeamLeaderModal}
          setIsShowModal={setIsShowTeamLeaderModal}
        />
      )}
    </div>
  );
};

export default ModuleDetail;