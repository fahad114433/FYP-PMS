import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../utils/constant';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Projects", "Tasks", "Team", "Module", "Dashboard"],
    endpoints: () => ({})
})
