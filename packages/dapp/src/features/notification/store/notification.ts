import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { NotificationI } from "@features/notification/types"

export interface NotificationState {
  data: NotificationI[]
  isFetching: boolean
  count: number
  loadedCount: number
  unreadCount: number
  offset: number
  limit: number
}

const initialState: NotificationState = {
  data: [],
  isFetching: false,
  count: 0,
  loadedCount: 0,
  unreadCount: 0,
  offset: 0,
  limit: 10,
}

const notificationSlice = createSlice({
  name: "notification",
  reducers: {
    setData(state, action: PayloadAction<NotificationI[]>) {
      state.data = action.payload
      state.unreadCount = state.data.filter(item => !item.is_read).length ?? 0
      state.loadedCount = state.data.length
      state.offset = state.data.length
    },
    loadData(state, action: PayloadAction<NotificationI[]>) {
      const concatenated = state.data.concat(action.payload)
      console.log(concatenated.length, action.payload)

      state.data = state.data.concat(action.payload)
      state.offset = concatenated.length
      state.unreadCount = state.data.filter(item => !item.is_read).length ?? 0
      state.loadedCount = state.data.length
    },
    setAsRead(state, action: PayloadAction<number>) {
      state.data[action.payload] = {
        ...state.data[action.payload],
        is_read: true,
      }
    },
    addData(state, action: PayloadAction<NotificationI>) {
      console.log("addData", action.payload)
      state.offset = state.offset + 1
      state.data = [action.payload, ...state.data]
      state.unreadCount = state.unreadCount + 1
      state.loadedCount = state.loadedCount + 1
    },
    setIsFetching(state, action: PayloadAction<boolean>) {
      state.isFetching = action.payload
    },
    updateCount(state, action: PayloadAction<number>) {
      state.count = action.payload
    },
  },
  initialState: initialState,
})

export const {
  loadData,
  setAsRead,
  updateCount,
  setIsFetching,
  addData,
  setData,
} = notificationSlice.actions

export default notificationSlice.reducer
