import { useCallback, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "@core/store"
import { useLazyGetNotificationsQuery } from "@features/notification/services/notification-api.ts"
import {
  loadData,
  setIsFetching,
  updateCount,
} from "@features/notification/store/notification.ts"
import useIntersectionObserver from "@react-hook/intersection-observer"

export default function useNotificationsLoader() {
  const [trigger, notifications] = useLazyGetNotificationsQuery()
  const appDispatch = useAppDispatch()
  const loaderRef = useRef<HTMLElement>(null)
  const { isIntersecting } = useIntersectionObserver(loaderRef as keyof object)
  const offset = useSelector(
    (state: RootState) => state.notificationSlice.offset,
  )
  const limit = useSelector((state: RootState) => state.notificationSlice.limit)

  const onShouldLoad = useCallback(() => {
    if (!notifications.isFetching) {
      trigger({ offset, limit })
    }
  }, [offset, limit, notifications])

  useEffect(() => {
    if (isIntersecting) {
      onShouldLoad()
    }
  }, [isIntersecting])

  useEffect(() => {
    appDispatch(setIsFetching(notifications.isFetching))
    if (notifications.data && !notifications.isFetching) {
      appDispatch(loadData(notifications.data.data))
      appDispatch(updateCount(notifications.data.count))
    }
  }, [notifications])
  return [loaderRef]
}
