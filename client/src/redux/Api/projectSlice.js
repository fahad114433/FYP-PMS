import { apiSlice } from "./apiSlice";
import { PROJECT_URL } from "../../utils/constant";

export const projectSlice = apiSlice.injectEndpoints({
    endpoints: ((builder) => ({
        createProject: builder.mutation({
            query: (projectData) => ({
                url: `${PROJECT_URL}`,
                method: "POST",
                body: projectData,
            }),
            invalidatesTags: ["Projects"]
        }),

        updateProjectById: builder.mutation({
            query: ({ id, updatedProjectData }) => ({
                url: `${PROJECT_URL}/${id}`,
                method: "PUT",
                body: updatedProjectData,
            }),
            invalidatesTags: ["Projects"]
        }),

        getProjectById: builder.query({
            query: (id) => ({
                url: `${PROJECT_URL}/${id}`,
                method: "GET"
            }),
            invalidatesTags: ["Projects"]
        }),

        deleteProjectById: builder.mutation({
            query: (id) => ({
                url: `${PROJECT_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Projects"]
        }),

        getAllProjects: builder.query({
            query: () => ({
                url: `${PROJECT_URL}`,
                method: "GET"
            }),
            invalidatesTags: ["Projects"]
        })
    }))
})

export const {
    useCreateProjectMutation,
    useDeleteProjectByIdMutation,
    useGetAllProjectsQuery,
    useGetProjectByIdQuery,
    useUpdateProjectByIdMutation,
} = projectSlice