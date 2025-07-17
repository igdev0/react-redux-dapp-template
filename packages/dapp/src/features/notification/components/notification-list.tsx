import { BellIcon } from "lucide-react"
import { Button } from "@shared/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu.tsx"
import useNotification from "@features/notification/hooks/use-notification.tsx"
import { useEffect } from "react"
import withAuthenticated from "@shared/hocs/with-authenticated.tsx"

function NotificationList() {
  const notifications = useNotification()
  useEffect(() => {
    console.log(notifications)
  }, [notifications])
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button variant="secondary" className="relative">
            <BellIcon />
            <div className="w-4 h-4 bg-red-600 text-xs absolute -top-1 -right-1 rounded-full text-white">
              4
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem>Notification 1</DropdownMenuItem>
          <DropdownMenuItem>Notification 2</DropdownMenuItem>
          <DropdownMenuItem>Notification 3</DropdownMenuItem>
          <DropdownMenuItem>Notification 4</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default withAuthenticated(NotificationList)
