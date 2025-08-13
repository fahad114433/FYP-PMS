import { Check, X, Layers, ChevronRight, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Module = ({
  module,
  deleteModule,
  setCurrentModule,
  setIsEdit,
  setIsShowModal,
}) => {
  const handleEdit = (e) => {
    setCurrentModule(module);
    setIsEdit(true);
    setIsShowModal(true);
  };

  const handleDelete = (e) => {
    if (deleteModule) {
      deleteModule(module);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 mb-4 transition-all duration-300 transform min-h-[300px] flex flex-col relative overflow-hidden group ${module.active
          ? "hover:scale-[1.02] shadow-sm hover:shadow-xl hover:border-indigo-200 cursor-pointer"
          : "opacity-60 cursor-not-allowed shadow-sm"
        }`}
    >
      {/* Subtle gradient overlay - only show on active modules */}
      {module.active && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-cyan-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}

      {/* Card Header */}
      <div className="p-7 pb-5 flex-shrink-0 relative z-10">
        {/* Edit and Delete buttons in upper right corner */}
        <div className="absolute top-2 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={handleEdit}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
            title="Edit Module"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            title="Delete Module"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Icon and Status */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-lg ${module.active
                ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 shadow-indigo-200/50 group-hover:shadow-indigo-300/60 group-hover:scale-105"
                : "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 shadow-gray-200/50"
              }`}
          >
            <Layers className="w-8 h-8 text-white" />
          </div>

          {module.active ? (
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

        {/* Module Name and Arrow */}
        <button
          disabled={!module.active}
          className={`w-full text-left ${!module.active ? "cursor-not-allowed" : "cursor-pointer"
            }`}
        >
          <Link to={`${module._id}`}>
            <div className="flex items-center justify-between group/title">
              <h3
                className={`text-2xl font-bold leading-tight pr-3 transition-colors duration-300 ${module.active
                    ? "text-gray-900 group-hover:text-indigo-700"
                    : "text-gray-500"
                  }`}
              >
                {module.moduleName}
              </h3>
              <ChevronRight
                className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${module.active
                    ? "text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1"
                    : "text-gray-400"
                  }`}
              />
            </div>
          </Link>
        </button>
      </div>

      {/* Card Body */}
      <div className="px-7 pb-7 flex-grow flex flex-col relative z-10">
        <div className="flex-grow">
          <p
            className={`text-sm leading-relaxed line-clamp-4 mb-4 ${module.active ? "text-gray-600" : "text-gray-500"
              }`}
          >
            {module.description}
          </p>
        </div>
        <div className="mt-auto">
          <div
            className={`h-1 w-full rounded-full transition-all duration-300 ${module.active
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 group-hover:h-1.5 group-hover:shadow-md"
                : "bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600"
              }`}
          ></div>
        </div>
      </div>

      {/* Optional: Overlay for inactive modules */}
      {!module.active && (
        <div className="absolute inset-0 bg-gray-100/10 pointer-events-none"></div>
      )}
    </div>
  );
};

export default Module;
