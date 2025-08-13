import { apiSlice } from '../Api/apiSlice'
import { TASK_URL } from '../../utils/constant'

let taskSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASK_URL}`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Tasks']
        }),

        getTasksListById: builder.query({
            query: (moduleId) => ({
                url: `${TASK_URL}/${moduleId}`,
                method: 'GET'
            }),
            providesTags: ['Task']
        }),

        getTaskById: builder.query({
            query: ({ moduleId, taskId }) => ({
                url: `${TASK_URL}/${moduleId}/${taskId}`,
                method: 'GET'
            }),
        }),

        updateTaskById: builder.mutation({
            query: ({ taskId, data }) => ({
                url: `${TASK_URL}/${taskId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Tasks']
        }),

        deleteTaskById: builder.mutation({
            query: (moduleId) => ({
                url: `${TASK_URL}/${moduleId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Tasks']
        }),

        taskAssignedToUser: builder.mutation({
            query: ({ memberId, formData }) => ({
                url: `${TASK_URL}/assigned/${memberId}`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Tasks']
        }),

        taskAssignUpdate: builder.mutation({
            query: ({ taskId, userId, formData }) => ({
                url: `${TASK_URL}/assignment/${taskId}/${userId}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Tasks"]
        }),
    })
})

export const {
    useCreateTaskMutation,
    useGetTasksListByIdQuery,
    useGetTaskByIdQuery,
    useDeleteTaskByIdMutation,
    useUpdateTaskByIdMutation,
    useTaskAssignedToUserMutation,
    useTaskAssignUpdateMutation
} = taskSlice
