import {
  FolderOpen,
  Users,
  Settings,
  Clock,
  CheckCircle,
  Target,
  ScrollText,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { useGetAdminDashboardDataQuery } from "../redux/Api/dashboardSlice";

export default function Dashboard() {

  const { userInfo } = useSelector((state) => state.auth);
  let { data: adminData, refetch, isLoading } = useGetAdminDashboardDataQuery()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {userInfo.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}!
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your unified workspace for excellence and collaborative success
          </p>
        </div>

        {/* Admin-only Quick Actions */}
        {userInfo.isAdmin === true && (
          <div className="mb-12">
            <motion.div
              className="group relative bg-white rounded-3xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Admin Command Center
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="group/btn">
                    <Link to={'/admin/projectsList'}>
                      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                        <ScrollText className="w-6 h-6 mb-3" />
                        <span className="text-sm font-semibold">Manage Projects</span>
                        <ChevronRight className="w-4 h-4 ml-auto mt-2 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  <div className="group/btn">
                    <Link to={'/admin/usersList'}>
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                        <Users className="w-6 h-6 mb-3" />
                        <span className="text-sm font-semibold">Manage Users</span>
                        <ChevronRight className="w-4 h-4 ml-auto mt-2 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>

                  <div className="group/btn">
                    <Link to={'/admin/teamList'}>
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
                        <Settings className="w-6 h-6 mb-3" />
                        <span className="text-sm font-semibold">Manage Teams</span>
                        <ChevronRight className="w-4 h-4 ml-auto mt-2 group-hover/btn:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stats Cards - Visible to admin and project_manager */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">
                    {adminData?.projectCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm font-medium">Active Modules</p>
                  <p className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">
                    {adminData?.moduleCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">
                    {adminData?.taskStatusCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-100 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm font-medium">Completed Tasks</p>
                  <p className="text-3xl font-bold text-slate-800 group-hover:scale-110 transition-transform">
                    {adminData?.completedTaskCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team - Admin only */}
          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Team Overview</h3>
              </div>

              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Total Team
                    </p>
                    <p className="text-xs text-slate-600">
                      Active across all projects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">
                    {adminData?.teamCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          {/*Team Member - admin only*/}
          <motion.div
            className="group relative bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Team Member Overview</h3>
              </div>

              <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Total Team Members
                    </p>
                    <p className="text-xs text-slate-600">
                      Active across all projects
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">
                    {adminData?.memberCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}