import { useAccount } from "wagmi"
import { JSX } from "react/jsx-runtime"
import IntrinsicAttributes = JSX.IntrinsicAttributes

export default function withAuth<T extends IntrinsicAttributes>(
  Component: () => JSX.Element,
) {
  return function WithAuth(props: T) {
    const account = useAccount()
    if (account.isConnected) {
      return null
    }
    return <Component {...props} />
  }
}
