import { apiSlice } from "./apiSlice";
import { DASHBOARD_URL } from "../../utils/constant";

let dashboardSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboardData: builder.query({
            query: () => ({
                url: `${DASHBOARD_URL}`,
                method: "GET",
            }),
            providesTags: ["Dashboard"]
        }),

        getUserDashboardData: builder.query({
            query: () => ({
                url: `${DASHBOARD_URL}/user`,
                method: "GET",
            }),
            providesTags: ["Dashboard"]
        }),

        contactMessage: builder.mutation({
            query: (data) => ({
                url: `${DASHBOARD_URL}/contact`,
                method: "POST",
                body: data
            })
        })
    })
})

export const { useGetAdminDashboardDataQuery, useGetUserDashboardDataQuery, useContactMessageMutation } = dashboardSlice