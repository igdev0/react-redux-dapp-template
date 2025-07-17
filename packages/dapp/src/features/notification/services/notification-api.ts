import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "@core/store"
import { NotificationI } from "@features/notification/types"

const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    prepareHeaders(headers, { getState }) {
      const token = (getState() as RootState).authSlice.accessToken
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Notification"],
  endpoints: builder => ({
    getNotifications: builder.query<NotificationI[], void>({
      query: () => "notification",
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation<void, string>({
      query: id => ({
        url: `notification/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
})

export const {
  useMarkAsReadMutation,
  useGetNotificationsQuery,
  util: { updateQueryData },
} = notificationApi

export default notificationApi
