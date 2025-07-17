import { BellIcon } from "lucide-react"
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

function NotificationList() {
  const { notificationsUnreadCount, ...notifications } = useNotification()

  const [markAsReadMutation] = useMarkAsReadMutation()

  const handleNotificationClick = (id: string) => {
    return () => {
      markAsReadMutation(id)
    }
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="secondary" className="relative">
            <BellIcon />
            <div className="w-4 h-4 bg-red-600 text-xs absolute -top-1 -right-1 rounded-full text-white">
              {notificationsUnreadCount}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          {notifications.data?.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              onClick={handleNotificationClick(notification.id)}
            >
              <div>
                <h3 className="text-lg block">{notification.title}</h3>
                <p>{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default withAuthenticated(NotificationList)
