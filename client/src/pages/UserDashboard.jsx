import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  CheckCircle,
  Activity,
  Zap,
  Layers,
  ArrowRight,
  Clock,
  Calendar,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetUserDashboardDataQuery } from "../redux/Api/dashboardSlice"
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="animate-pulse bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 p-8">
    <div className="h-6 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-6"></div>
    <div className="h-4 w-2/3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg mb-3"></div>
    <div className="h-4 w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
  </div>
);

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  let { userInfo } = useSelector((state) => state.auth)
  let { data: dashboardData, isLoading } = useGetUserDashboardDataQuery()
  const navigate = useNavigate();

  // Stats Cards
  const OverviewStats = () => {
    const modulesCount = dashboardData?.modules?.length || 0;
    const tasksCount = dashboardData?.tasks?.length || 0;
    const completedTasksCount = dashboardData?.completedTask || 0;

    const stats = [
      {
        label: "Modules",
        value: modulesCount,
        icon: Target,
        gradient: "from-violet-500 via-purple-500 to-indigo-600",
        bgPattern: "from-violet-50 via-purple-50 to-indigo-50",
        shadowColor: "shadow-violet-500/20",
        glowColor: "group-hover:shadow-violet-500/40",
      },
      {
        label: "Tasks",
        value: tasksCount,
        icon: CheckCircle,
        gradient: "from-emerald-500 via-teal-500 to-cyan-600",
        bgPattern: "from-emerald-50 via-teal-50 to-cyan-50",
        shadowColor: "shadow-emerald-500/20",
        glowColor: "group-hover:shadow-emerald-500/40",
      },
      {
        label: "Completed Tasks",
        value: completedTasksCount,
        icon: Zap,
        gradient: "from-orange-500 via-amber-500 to-yellow-600",
        bgPattern: "from-orange-50 via-amber-50 to-yellow-50",
        shadowColor: "shadow-orange-500/20",
        glowColor: "group-hover:shadow-orange-500/40",
      },
    ];

    return (
      <div className="flex justify-center mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/40 ${stat.shadowColor} ${stat.glowColor} transition-all duration-700 overflow-hidden hover:scale-105 hover:-translate-y-2`}
            >
              {/* Animated background gradient */}
              {/* <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgPattern} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
              ></div> */}

              {/* Floating particles effect */}
              {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              </div> */}

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mb-4`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-slate-800 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  // Leadership Cards (Modules)
  const LeadershipCards = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      );
    }
    if (!dashboardData?.modules || dashboardData.modules.length === 0) {
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 flex flex-col items-center justify-center min-h-64">
              <div className="p-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl mb-6">
                <Layers className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No modules assigned</h3>
              <p className="text-gray-500 text-center">You don't have any modules assigned to your teams yet.</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardData.modules.map((module, index) => (
          <motion.div
            key={module.moduleId}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden relative"
            onClick={() => navigate(`/user/projectsList/${module.projectId}/${module.moduleId}`)}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

            {/* Floating sparkle effect */}
            {/* <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div> */}

            <div className="relative z-10">
              <div className="flex items-center text-sm text-indigo-600 mb-6 font-semibold">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Module Management</span>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all duration-300" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {module.moduleName}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1 font-medium">
                    {module.projectName}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Contributor Cards (Tasks)
  const ContributorCards = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      );
    }
    if (!dashboardData?.tasks || dashboardData.tasks.length === 0) {
      return (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 flex flex-col items-center justify-center min-h-64">
              <div className="p-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-3xl mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No tasks assigned</h3>
              <p className="text-gray-500 text-center">You don't have any tasks assigned to you yet.</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardData.tasks.map((task, index) => (
          <motion.div
            key={task.taskId}
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden relative"
            onClick={() => navigate(`/user/projectsList/${task.projectId}/${task.moduleId}/${task.taskId}`)}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

            {/* Floating sparkle effect */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center text-sm text-emerald-600 mb-6 font-semibold">
                <Clock className="w-4 h-4 mr-2" />
                <span>Task Details</span>
              </div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-2 transition-all duration-300" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {task.taskName}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1 font-medium">
                    {task.moduleName}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1 font-medium">
                    {task.projectName}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Background decorative elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      </div> */}

      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center justify-center p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/40 mb-6">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Welcome Back</span>
            </div>
          </div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
            {userInfo.name
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')}
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your unified workspace for leadership excellence and collaborative success
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="flex flex-row items-center justify-center gap-4 mb-12 bg-white/70 backdrop-blur-md p-2 rounded-3xl shadow-lg border border-white/50 w-fit mx-auto"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center space-x-3 px-8 py-5 font-semibold text-sm rounded-2xl transition-all duration-500 ${activeTab === "overview"
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl transform scale-105"
              : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105"
              }`}
          >
            <Activity className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("leading")}
            className={`flex items-center space-x-3 px-8 py-5 font-semibold text-sm rounded-2xl transition-all duration-500 ${activeTab === "leading"
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl transform scale-105"
              : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105"
              }`}
          >
            <Users className="w-5 h-5" />
            <span>Leadership</span>
          </button>
          <button
            onClick={() => setActiveTab("contributing")}
            className={`flex items-center space-x-3 px-8 py-5 font-semibold text-sm rounded-2xl transition-all duration-500 ${activeTab === "contributing"
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl transform scale-105"
              : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-lg hover:scale-105"
              }`}
          >
            <Target className="w-5 h-5" />
            <span>Contributions</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {activeTab === "overview" && (
            <div className="space-y-12">
              <OverviewStats />
              <LeadershipCards />
              <ContributorCards />
            </div>
          )}

          {activeTab === "leading" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/40 mb-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Leadership</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Leadership Dashboard
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  Manage your assigned modules and oversee project progress
                </p>
              </div>
              <LeadershipCards />
            </div>
          )}

          {activeTab === "contributing" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/40 mb-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
                    <Target className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-semibold">Contributions</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">
                  Contribution Hub
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  View and manage your assigned tasks across different projects
                </p>
              </div>
              <ContributorCards />
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;