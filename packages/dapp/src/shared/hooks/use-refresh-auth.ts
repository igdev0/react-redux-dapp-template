import { useAppDispatch } from "@core/store"
import {
  AccessTokenPayload,
  API_URL,
  useRefreshTokenQuery,
} from "@core/services/auth.ts"
import { useEffect } from "react"
import { setCredentials } from "@core/store/auth-slice.ts"

export default function useRefreshAuth() {
  const appDispatch = useAppDispatch()
  const refreshResult = useRefreshTokenQuery([])
  useEffect(() => {
    ;(async () => {
      if (refreshResult.data) {
        const res = await fetch(`${API_URL}/auth/me`, {
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

  return refreshResult
}
