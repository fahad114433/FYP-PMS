import { apiSlice } from "./apiSlice";
import { MODULE_URL } from "../../utils/constant";

const moduleSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createModule: builder.mutation({
            query: ({ projectId, formData }) => ({
                url: `${MODULE_URL}/project/${projectId}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Module"]
        }),

        getModulesList: builder.query({
            query: (projectId) => ({
                url: `${MODULE_URL}/project/${projectId}`,
                method: "GET"
            }),
            providesTags: ["Module"]
        }),

        updateModuleById: builder.mutation({
            query: ({ id, formData }) => ({
                url: `${MODULE_URL}/module/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Module"]
        }),

        deleteModuleById: builder.mutation({
            query: (moduleId) => ({
                url: `${MODULE_URL}/module/${moduleId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Module"]
        }),

        getModuleById: builder.query({
            query: (moduleId) => ({
                url: `${MODULE_URL}/module/${moduleId}`,
                method: "GET"
            }),
            providesTags: ["Module"]
        }),

        teamAssignedToModule: builder.mutation({
            query: ({ teamId, moduleId }) => ({
                url: `${MODULE_URL}/team-module`,
                method: "POST",
                body: { teamId, moduleId }
            }),
            invalidatesTags: ["Module"]
        }),

    })
});

export const {
    useCreateModuleMutation,
    useGetModulesListQuery,
    useUpdateModuleByIdMutation,
    useDeleteModuleByIdMutation,
    useGetModuleByIdQuery,
    useTeamAssignedToModuleMutation,
    useTeamLeaderAssignedToModuleMutation
} = moduleSlice;