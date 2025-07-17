export type NotificationType = "system" | "on_chain" | "custom"
export interface NotificationI {
  id: string
  title: string
  message: string
  type: "system" | "on_chain" | "custom"
  is_read: boolean
  metadata: JSON
  created_at: Date
  updated_at: Date
}
