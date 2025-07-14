import { configureStore } from "@reduxjs/toolkit"
import { persistStore } from "redux-persist"
import appReducer from "../../app-slice.ts"

const store = configureStore({
  reducer: {
    app: appReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
export default store
