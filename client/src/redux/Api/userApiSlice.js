import { USER_URL } from "../../utils/constant";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: ((builder) => ({
        login: builder.mutation({
            query: (userData) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USER_URL}/logout`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),

        register: builder.mutation({
            query: (userData) => ({
                url: `${USER_URL}/register`,
                method: 'POST',
                body: userData
            })
        }),

        getAllUsers: builder.query({
            query: () => ({
                url: `${USER_URL}/all`,
                method: 'GET',
            })
        }),

        updateUser: builder.mutation({
            query: ({ id, data }) => ({
                url: `${USER_URL}/${id}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['User'],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        })

    }))
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useDeleteUserMutation
} = userApiSlice;