import { useState } from "react";
import {
  Plus,
  User,
  Mail,
  Briefcase,
  Check,
  X,
  Search,
  Filter,
  Edit2,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../redux/Api/userApiSlice";
import UpdateUserModal from "../../components/Modal/UpdateUserModal";

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { data: users = [], refetch, isLoading, error } = useGetAllUsersQuery();
  let [deleteUser] = useDeleteUserMutation();

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await deleteUser(userId).unwrap();
      toast.success(res.message || "User deleted successfully");
      refetch();
    } catch (error) {
      toast.error(error?.message || "Failed to delete user");
    }
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Ensure users is always an array before filtering
  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = safeUsers.filter((user) => {
    if (!user) return false;

    const matchesSearch =
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.designation || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && user.active) ||
      (filterActive === "inactive" && !user.active);

    return matchesSearch && matchesFilter;
  });

  const handleGoBack = () => {
    window.history.back();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading users: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <button
        onClick={handleGoBack}
        className=" cursor-pointer flex items-center text-gray-600 hover:text-gray-900 ml-20 transition-colors mr-4"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Go Back
      </button>
      <div className="flex items-center mb-6 ml-8">
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                User Management
              </h1>
              <p className="text-gray-600">
                Manage your team members and their access
              </p>
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
              <div className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                <Link to="/admin/signup" className="text-white">
                  Create User
                </Link>
              </div>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search users by name, email, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="sm:w-48 relative">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
              >
                <option value="all">All Users</option>
                <option value="active">Active Users</option>
                <option value="inactive">Inactive Users</option>
              </select>
              <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 px-6 py-4 border-b border-gray-200">
            <div className="min-w-[800px] grid grid-cols-12 gap-4 font-medium text-gray-700">
              <div className="col-span-3 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Name
              </div>
              <div className="col-span-3 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </div>
              <div className="col-span-2 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Designation
              </div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-x-auto">
            <div className="divide-y divide-gray-200 min-w-[800px]">
              {filteredUsers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || filterActive !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Get started by creating your first user"}
                  </p>
                </div>
              ) : (
                filteredUsers
                  .sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))
                  .map((user, index) => (
                    <div
                      key={user?._id || index}
                      className={`px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-cyan-25 transition-all ${user?.active
                        ? "hover:scale-[1.02] hover:shadow-xl hover:border-indigo-200 cursor-pointer"
                        : "opacity-60 cursor-not-allowed shadow-sm"
                        } duration-200 ${index % 2 === 0 ? "bg-gray-25" : "bg-white"
                        }`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3 flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-indigo-600 font-medium text-sm">
                              {user?.name
                                ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                : "??"}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">
                            {user?.name || 'Unknown'}
                          </p>
                        </div>
                        <div
                          className="col-span-3 text-gray-600"
                          title={user?.email || ''}
                        >
                          {truncateText(user?.email)}
                        </div>
                        <div className="col-span-2">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-cyan-100 text-indigo-700"
                            title={user?.designation || ''}
                          >
                            {truncateText(user?.designation, 12)}
                          </span>
                        </div>
                        <div className="col-span-2 text-center">
                          <button
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${user?.active
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                          >
                            {user?.active ? (
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
                        </div>
                        <div className="col-span-2 flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user?._id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        {safeUsers.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {safeUsers.length}
                </div>
                <div className="text-gray-600">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {safeUsers.filter((u) => u?.active).length}
                </div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {safeUsers.filter((u) => !u?.active).length}
                </div>
                <div className="text-gray-600">Inactive Users</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Update User Modal */}
      <UpdateUserModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={currentUser}
        refetch={refetch}
      />
    </div>
  );
}