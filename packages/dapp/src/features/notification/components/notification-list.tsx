import { BellIcon } from "lucide-react"
import { Button } from "@shared/ui/button.tsx"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu.tsx"

export default function NotificationList() {
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
