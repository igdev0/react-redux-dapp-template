import { combineReducers, configureStore } from "@reduxjs/toolkit"
import appReducer from "../../app-slice.ts"
import authSlice from "@core/store/auth-slice.ts"
import authService from "@core/services/auth.ts"
import { useDispatch } from "react-redux"

const store = configureStore({
  reducer: combineReducers({
    appReducer,
    authSlice,
    [authService.reducerPath]: authService.reducer,
  }),

  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: true,
      },
    }).concat(authService.middleware)
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()

export const appDispatch = store.dispatch

export default store
