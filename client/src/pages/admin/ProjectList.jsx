import { useState } from "react";
import {
  Plus,
  Calendar,
  FileText,
  Edit3,
  Trash2,
  Check,
  X,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  useCreateProjectMutation,
  useGetAllProjectsQuery,
  useUpdateProjectByIdMutation,
} from "../../redux/Api/projectSlice";
import { useDeleteProjectByIdMutation } from "../../redux/Api/projectSlice";
import { toast } from "react-toastify";
import ProjectModal from "../../components/Modal/ProjectModal";

const ProjectListPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [errors, setErrors] = useState({});

  let { data: projects, refetch } = useGetAllProjectsQuery();
  let [deleteProjectById] = useDeleteProjectByIdMutation();
  let [createProject] = useCreateProjectMutation();
  let [updateProjectById] = useUpdateProjectByIdMutation();

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      let res = await createProject(formData).unwrap();
      if (res?.error) {
        toast.error(res?.error?.message || "Failed to create project");
        return;
      } else {
        toast.success(res?.message || "Project Created Successfully");
      }
      setShowCreateModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (id, formData) => {
    setIsSubmitting(true);
    try {
      const res = await updateProjectById({ id, formData }).unwrap();
      toast.success(res?.message || "Project updated successfully");
      setIsEdit(false);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to update project:", error);
      toast.error(error?.message || error?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
      refetch();
    }
  };

  const handleDelete = async (id) => {
    try {
      let res = await deleteProjectById(id);
      toast.success(
        res?.message || res?.message || "Project deleted successfully"
      );
      refetch();
    } catch (error) {
      toast.error(
        error?.message || error?.message || "Failed deletion of project"
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return date;
  };

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Projects
                </h1>
                <p className="text-gray-600">Manage and track your projects</p>
              </div>

              <button
                onClick={() => {
                  setCurrentProject(null);
                  setShowCreateModal(true);
                }}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Project
              </button>
            </div>
          </div>
        </motion.div>

        {/* Projects Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden overflow-x-auto">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
            <div className="min-w-[900px] grid grid-cols-12 gap-4 font-medium text-gray-700">
              <div className="col-span-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Project Name
              </div>
              <div className="col-span-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Start Date
              </div>
              <div className="col-span-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                End Date
              </div>
              <div className="col-span-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Description
              </div>
              <div className="col-span-2 text-center">Actions</div>
              {/* <div className="col-span-2 text-center">Status</div> */}
            </div>
          </div>

          {/* Table Body */}
          <div className="">
            <div className="divide-y divide-gray-200 min-w-[900px]">
              {projects?.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-500">
                    Get started by creating your first project
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                >
                  {projects?.map((project, index) => (
                    <motion.div
                      key={project._id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <div
                        key={project._id}
                        className={`px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-cyan-25 transition-all duration-200 ${index % 2 === 0 ? "bg-gray-25" : "bg-white"
                          }`}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Name Section */}
                          <div className="col-span-3 flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 hover:underline">
                                <Link to={`${project._id}`}>
                                  {project.projectName}
                                </Link>
                              </p>
                            </div>
                          </div>

                          {/* Start Date  */}
                          <div className="col-span-2 text-gray-600">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(project.projectStartDate)}
                            </div>
                          </div>

                          {/* End Date  */}
                          <div className="col-span-2 text-gray-600">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(project.projectEndDate)}
                            </div>
                          </div>

                          {/* Description Section */}
                          <div className="col-span-3">
                            <div
                              className="text-sm text-gray-600 truncate"
                              title={project.description}
                            >
                              {project.description}
                            </div>
                          </div>

                          {/* Status Section */}
                          {/* <div className="col-span-2">
                            <button
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                project?.active
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {project?.active ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </div> */}

                          {/* Edit and Delete Sections  */}
                          <div className="col-span-2 flex items-center justify-center space-x-2">
                            <button
                              className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit project"
                              onClick={() => {
                                setIsEdit(true);
                                setCurrentProject(project);
                                setShowCreateModal(true);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete project"
                              onClick={() => handleDelete(project._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <ProjectModal
            setModal={setShowCreateModal}
            project={currentProject}
            errors={errors}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            setErrors={setErrors}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            handleEdit={handleEdit}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectListPage;
