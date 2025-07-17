import { useEffect, useMemo } from "react"
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "@core/store"
import {
  updateQueryData,
  useGetNotificationsQuery,
} from "@features/notification/services/notification-api.ts"

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
export default function useNotification() {
  const notifications = useGetNotificationsQuery()
  const appDispatch = useAppDispatch()
  const accessToken = useSelector(
    (state: RootState) => state.authSlice.accessToken,
  )
  const notificationsUnreadCount = useMemo(() => {
    return notifications.data?.filter(item => !item.is_read).length ?? 0
  }, [notifications])
  useEffect(() => {
    const ctrl = new AbortController()
    if (accessToken) {
      fetchEventSource(`${BACKEND_URL}/notification/sse`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        onmessage: (ev: EventSourceMessage) => {
          const data = ev.data.length > 0 ? JSON.parse(ev.data) : null
          if (data) {
            appDispatch(
              updateQueryData("getNotifications", undefined, draft => {
                draft.unshift(data)
              }),
            )
          }
        },
        onerror(err) {
          if (err instanceof Error) {
            throw err // rethrow to stop the operation
          } else {
            // do nothing to automatically retry. You can also
            // return a specific retry interval here.
          }
        },
        signal: ctrl.signal,
      }).catch(console.error)
    }

    return () => {
      ctrl.abort()
    }
  }, [accessToken])
  return { ...notifications, notificationsUnreadCount }
}
