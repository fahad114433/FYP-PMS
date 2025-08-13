import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Calendar,
  Filter,
  Layers,
  Check,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { useParams } from "react-router-dom";

import Module from "./Module";

import { useGetProjectByIdQuery } from "../../redux/Api/projectSlice";
import ModuleModal from "../../components/Modal/ModuleModal";
import {
  useDeleteModuleByIdMutation,
  useCreateModuleMutation,
  useGetModulesListQuery,
  useUpdateModuleByIdMutation,
} from "../../redux/Api/moduleSlice";
import { motion } from "framer-motion";

const ProjectDetail = () => {
  const { projectId } = useParams(); // Assuming you're using react-router-dom for routing
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // New filter state
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId);
  let { data: modules, refetch } = useGetModulesListQuery(projectId);
  let [createModuleMutation] = useCreateModuleMutation();
  let [delteModuleById] = useDeleteModuleByIdMutation();
  let [updateModuleById] = useUpdateModuleByIdMutation();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSubmit = async (formData, setFormData) => {
    if (!validateForm(formData)) return;
    setIsSubmitting(true);
    // Simulate API call
    try {
      let res = await createModuleMutation({ projectId, formData });
      if (res?.error) {
        toast.error(
          res?.error?.message ||
          res?.message ||
          "Module Creation failed"
        );
        return;
      } else {
        toast.success(
          res?.message || res?.message || "Module Created Successfully"
        );
      }
      setFormData({
        moduleName: "",
        active: true,
        description: "",
      });
      setIsShowModal(false);
      refetch();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.message || error?.message || "Module Creation Failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (formData, setFormData) => {
    try {
      let id = currentModule._id;
      let res = await updateModuleById({ id, formData });
      toast.success(
        res?.message || res?.message || "Module Updated Successfully"
      );
      setFormData({
        moduleName: "",
        active: true,
        description: "",
      });
      refetch();
    } catch (error) {
      toast.error(error?.message || error?.message || "Updation Failed");
    } finally {
      setCurrentModule(null);
      setIsEdit(false);
      setIsShowModal(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (module) => {
    try {
      let res = await delteModuleById(module._id);
      toast.success(
        res?.message || res?.message || "Module Deleted Sucessfully"
      );
    } catch (error) {
      toast.error(
        error?.message || error?.message || "Error deleting Module."
      );
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Filter modules based on search term and active status
  const filteredModules = modules?.modulesList?.filter((module) => {
    const matchesSearch =
      module.moduleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && module.active) ||
      (filterActive === "inactive" && !module.active);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validateForm = (formData) => {
    const newErrors = {};

    if (!formData.moduleName.trim()) {
      newErrors.moduleName = "Module name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading project...</span>
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
            <h3 className="text-red-800 font-medium">Error loading project</h3>
            <p className="text-red-600 text-sm mt-1">
              {error?.message || "Failed to load project details"}
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
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Go Back
            </button>
          </div>

          {/* Project Info Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project?.projectName}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Start: {formatDate(project?.projectStartDate)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      End: {formatDate(project?.projectEndDate)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-5">
                {project.active ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                    <Check className="w-3.5 h-3.5 mr-2" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 bg-red-50 text-red-700 border border-red-200 shadow-sm">
                    <X className="w-3.5 h-3.5 mr-2" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* Description  */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {project?.description}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Modules Management
              </h2>
              <p className="text-gray-600">
                Manage project modules and components
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Create Module Button */}
              <button
                onClick={() => {
                  setIsShowModal(true);
                }}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Module
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search modules by name or description..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="sm:w-48 relative">
                <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <select
                  value={filterActive}
                  onChange={(e) => setFilterActive(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
                >
                  <option value="all">All Modules</option>
                  <option value="active">Active Modules</option>
                  <option value="inactive">Inactive Modules</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modules List  */}
        {/* Modules Section */}
        {filteredModules?.length > 0 ? (
          <motion.div
            className="grid"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {[...filteredModules || []].sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))?.map((module, idx) => (
              <motion.div
                key={module._id}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Module
                  key={module._id}
                  module={module}
                  deleteModule={handleDelete}
                  setCurrentModule={setCurrentModule}
                  setIsEdit={setIsEdit}
                  setIsShowModal={setIsShowModal}
                  setErrors={setErrors}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-6 text-center text-gray-600">
              {searchTerm || filterActive !== "all"
                ? "No modules found matching your search criteria. Try adjusting your search or filter."
                : "No Module Found. Go create a module first"}
            </div>
          </motion.div>
        )}

        {/* Footer Stats */}
        {modules?.modulesList?.length > 0 && (
          <motion.div
            className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {modules?.modulesList?.length}
                </div>
                <div className="text-gray-600">Total Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {modules?.modulesList?.filter((m) => m.active).length}
                </div>
                <div className="text-gray-600">Active Modules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {modules?.modulesList?.filter((m) => !m.active).length}
                </div>
                <div className="text-gray-600">Inactive Modules</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {isShowModal && (
        <ModuleModal
          isEdit={isEdit}
          module={currentModule}
          setIsEdit={setIsEdit}
          setCurrentModule={setCurrentModule}
          setIsShowModal={setIsShowModal}
          handleSubmit={handleSubmit}
          handleEdit={handleEdit}
          isSubmitting={isSubmitting}
          errors={errors}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
