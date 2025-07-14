import { createSlice } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"

export type Theme = "dark" | "light" | "auto"

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: "dark",
}
const slice = createSlice({
  name: "theme",
  reducers: {
    setTheme(state, action: { payload: Theme }) {
      state.theme = action.payload
    },
  },
  initialState,
})

const persistedReducer = persistReducer(
  {
    key: "theme",
    storage: storage,
  },
  slice.reducer,
)

export default persistedReducer
