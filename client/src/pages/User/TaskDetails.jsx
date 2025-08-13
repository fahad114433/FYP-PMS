import { useState } from "react";
import {
  FileText,
  Calendar,
  User,
  Users,
  Flag,
  CheckCircle,
  Circle,
  ArrowRight,
  TrendingUp,
  Target,
  AlertTriangle,
  CalendarDays,
  Plus,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetTaskByIdQuery } from "../../redux/Api/taskSlice";
import TaskAssignModal from "../../components/Modal/TaskAssignModal";
import TaskUpdateModal from "../../components/Modal/TaskUpdateModal";
import { motion } from "framer-motion";

export default function TaskDetails() {
  const [isAssigned, setIsAssigned] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  let { projectId, moduleId, taskId } = useParams();
  let { data: taskDetails, refetch } = useGetTaskByIdQuery({
    moduleId,
    taskId,
  });

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "amber" },
    { value: "InProgress", label: "In Progress", color: "blue" },
    { value: "Completed", label: "Completed", color: "emerald" },
  ];

  useEffect(() => {
    if (taskDetails) {
      taskDetails?.userName ? setIsAssigned(true) : setIsAssigned(false);
      setProgress(taskDetails?.taskProgress || 0);
      setStatus(taskDetails?.taskStatus || "Pending");
      setIsTaskCompleted(
        taskDetails?.taskProgress === 100 ||
        taskDetails?.taskStatus === "Completed"
      );
    }
  }, [taskDetails, progress]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date and time function
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgressColor = (progressValue) => {
    if (progressValue === 100) return "from-emerald-500 to-green-500";
    if (progressValue >= 75) return "from-blue-500 to-cyan-500";
    if (progressValue >= 50) return "from-indigo-500 to-purple-500";
    if (progressValue >= 25) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getStatusConfig = (statusValue) => {
    const config = statusOptions.find((option) => option.value === statusValue);
    return config || statusOptions[0];
  };

  const getStatusStyles = (statusValue) => {
    const statusConfig = getStatusConfig(statusValue);
    const colorMap = {
      amber: "bg-amber-100 text-amber-800 border-amber-200",
      blue: "bg-blue-100 text-blue-800 border-blue-200",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return colorMap[statusConfig.color] || colorMap.amber;
  };

  // Handle assign team member click
  const handleAssignTeamMember = () => {
    if (!taskDetails?.teamId) {
      toast.info("First assign a team to this task's module")
    } else {
      setShowModal(true);
    }
  };

  // Handle edit task click
  const handleEditTask = () => {
    if (!taskDetails?.teamId) {
      toast.info("Assign a user first!")
    } else {
      setShowUpdateModal(true);
    }
  };

  const handleTaskCompletion = async () => {
    if (progress !== 100) {
      setProgress(100);
    }

    if (status !== "Completed") {
      setStatus("Completed");
    }

    setIsTaskCompleted(true);

    try {
      await taskStatusUpdate({
        taskId,
        userId: taskDetails?.userId,
        data: { status: "Completed" },
      });

      refetch();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Go Back
          </button>
        </motion.div>
        {/* Header Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm text-slate-500 mb-6">
            <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
              {taskDetails?.projectName}
            </span>
            <ArrowRight className="w-4 h-4 mx-2 text-slate-400" />
            <span className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
              {taskDetails?.moduleName}
            </span>
            <ArrowRight className="w-4 h-4 mx-2 text-slate-400" />
            <span className="font-medium text-slate-700">
              {taskDetails?.taskName}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-start">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {taskDetails?.taskName}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Badge */}
                  {isAssigned && (
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm border ${getStatusStyles(
                        status
                      )}`}
                    >
                      {getStatusConfig(status).label}
                    </span>
                  )}

                  {/* Priority Badge */}
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                    <Flag className="w-4 h-4 mr-1" />
                    {taskDetails?.priority}
                  </span>

                  {/* Active/Inactive Status */}
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border border-red-200 text-white ${taskDetails?.isActive ? "bg-green-500" : "bg-red-500"
                      } shadow-sm`}
                  >
                    {taskDetails?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Edit Task Button */}
              <button
                onClick={handleEditTask}
                className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:scale-105"
                title="Edit Task"
              >
                <Edit className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
              </button>

              {/* Assign Team Member Button */}
              {!isAssigned && <button
                onClick={handleAssignTeamMember}
                className="group flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
                title="Assign Team Member"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>}
            </div>
          </div>

          {/* Timeline Section */}
          {isAssigned && (
            <motion.div
              className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl border border-slate-200"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CalendarDays className="w-6 h-6 mr-2 text-indigo-600" />
                Project Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-slate-600">
                      Project Start
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(taskDetails?.projectStartDate)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-slate-600">
                      Task Start
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(taskDetails?.assignDate)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-sm font-medium text-slate-600">
                      Task Due
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(taskDetails?.completionDate)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex items-center mb-2">
                    <Flag className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-slate-600">
                      Project End
                    </span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">
                    {formatDate(taskDetails?.projectEndDate)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Progress Section - Display Only */}
          {isAssigned && (
            <motion.div
              className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
                  Task Progress
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative mb-4">
                <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                  <div
                    className={`h-4 rounded-full bg-gradient-to-r ${getProgressColor(
                      progress
                    )} transition-all duration-700 ease-out shadow-sm relative overflow-hidden`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Task Description */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Task Description
            </h3>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-700 leading-relaxed text-lg break-words whitespace-pre-wrap">
                {taskDetails?.description || "No description provided"}
              </p>
            </div>
          </motion.div>

          {/* Task Details Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Assigned To
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {taskDetails?.userName || "Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Team Leader
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {taskDetails?.teamLeaderName || "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            <div className="group p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Flag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Priority Level
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {taskDetails?.priority || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Section */}
        {isAssigned && (
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Task Completion
                </h2>
                <p className="text-slate-600 text-lg">
                  Mark this task as complete when all requirements are fulfilled
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleTaskCompletion}
                  disabled={isTaskCompleted}
                  className={`flex items-center justify-center px-8 py-4 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl text-lg ${isTaskCompleted
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white opacity-75 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500"
                    }`}
                >
                  {isTaskCompleted ? (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Task Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-6 h-6 mr-3" />
                      Mark as Complete
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Completion Status */}
            {isTaskCompleted && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600 mr-3" />
                  <p className="text-emerald-800 font-bold text-lg">
                    Task has been marked as completed successfully!
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal Components */}
      {showModal && (
        <TaskAssignModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          refetch={refetch}
          moduleId={moduleId}
          taskId={taskId}
          projectId={projectId}
          projectEndDate={taskDetails?.projectEndDate}
          teamId={taskDetails?.teamId}
        />
      )}

      {showUpdateModal && (
        <TaskUpdateModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          refetch={refetch}
          taskDetails={taskDetails ? taskDetails : null}
          taskId={taskId}
          userId={taskDetails?.userId}
        />
      )}
    </motion.div>
  );
}
