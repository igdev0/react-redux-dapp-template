import { BellIcon, CheckIcon } from "lucide-react"
import { Button } from "@shared/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu.tsx"
import useNotification from "@features/notification/hooks/use-notification.tsx"
import withAuthenticated from "@shared/hocs/with-authenticated.tsx"
import { useMarkAsReadMutation } from "@features/notification/services/notification-api.ts"
import { clsx } from "clsx"
import { useRef } from "react"
import NotificationLoader from "@features/notification/components/notification-loader.tsx"

function NotificationList() {
  const notifications = useNotification()
  const [markAsReadMutation] = useMarkAsReadMutation()

  const notificationRef = useRef<HTMLDivElement>(null)
  const handleNotificationClick = (id: string) => {
    return () => {
      markAsReadMutation(id)
    }
  }

  return (
    <div ref={notificationRef}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="secondary" className="relative">
            <BellIcon />
            <div className="w-4 h-4 bg-red-600 text-xs absolute -top-1 -right-1 rounded-full text-white">
              {notifications.unreadCount}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-[500px] h-full">
          {notifications.data.map(notification => (
            <DropdownMenuItem
              className={clsx(
                !notification.is_read ? "dark:bg-gray-200/5 bg-gray-200" : "",
                "cursor-pointer my-1",
              )}
              key={notification.id}
              onClick={
                !notification.is_read
                  ? handleNotificationClick(notification.id)
                  : undefined
              }
            >
              {notification.type === "on_chain" ? (
                <CheckIcon className="stroke-green-400" />
              ) : null}
              <div>
                <h3 className="text-sm block font-bold">
                  {notification.title}
                </h3>
                <p>{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))}
          <NotificationLoader />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default withAuthenticated(NotificationList)
