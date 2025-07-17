import { useEffect } from "react"
import {
  EventSourceMessage,
  fetchEventSource,
} from "@microsoft/fetch-event-source"
import { useSelector } from "react-redux"
import { RootState } from "@core/store"
import {
  updateQueryData,
  useGetNotificationsQuery,
} from "@features/notification/services/notification-api.ts"
import { NotificationI } from "@features/notification/types"

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL
export default function useNotification() {
  const notifications = useGetNotificationsQuery()
  const accessToken = useSelector(
    (state: RootState) => state.authSlice.accessToken,
  )
  useEffect(() => {
    const ctrl = new AbortController()
    if (accessToken) {
      fetchEventSource(`${BACKEND_URL}/notification/sse`, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
        onmessage: (ev: EventSourceMessage) => {
          const data = JSON.parse(ev.data) as NotificationI
          updateQueryData("getNotifications", undefined, draft => {
            draft.unshift(data)
          })
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
      })
        .then()
        .catch(console.error)
    }

    return () => {
      ctrl.abort()
    }
  }, [accessToken])
  return notifications
}
