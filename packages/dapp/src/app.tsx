import "./app.css"
import { createBrowserRouter, RouterProvider } from "react-router"
import CounterScreen from "@features/counter/screens"
import withConnectedNetworks from "@shared/hocs/with-supported-networks.tsx"
import { memo, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState, useAppDispatch } from "@core/store"
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit"
import authentication from "@core/config/authentication.ts"
import { ThemeProvider } from "@shared/components/theme-provider"
import {
  AccessTokenPayload,
  API_URL,
  useRefreshTokenQuery,
} from "@core/services/auth.ts"
import { setCredentials } from "@core/store/auth-slice.ts"

const router = createBrowserRouter([
  {
    path: "/",
    element: <CounterScreen />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

const WrappedApp = withConnectedNetworks(memo(App))

function Root() {
  const auth = useSelector((state: RootState) => state.authSlice)
  const appDispatch = useAppDispatch()
  const refreshResult = useRefreshTokenQuery([])
  useEffect(() => {
    ;(async () => {
      if (refreshResult.data) {
        const res = await fetch(`${API_URL}/auth/me`, {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${refreshResult.data.accessToken}`,
          },
        })

        const user: AccessTokenPayload = await res.json()

        appDispatch(
          setCredentials({
            accessToken: refreshResult.data.accessToken,
            accessTokenTTL: refreshResult.data.accessTokenTTL,
            user,
          }),
        )
      }
    })()
  }, [refreshResult])

  return (
    <RainbowKitAuthenticationProvider
      adapter={authentication}
      status={
        refreshResult.isFetching || (refreshResult.data && !auth.accessToken)
          ? "loading"
          : auth.accessToken
            ? "authenticated"
            : "unauthenticated"
      }
    >
      <RainbowKitProvider>
        <ThemeProvider>
          <WrappedApp />
        </ThemeProvider>
      </RainbowKitProvider>
    </RainbowKitAuthenticationProvider>
  )
}

export default Root
