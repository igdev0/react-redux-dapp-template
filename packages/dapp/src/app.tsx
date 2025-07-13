import "./app.css"
import { createBrowserRouter, RouterProvider } from "react-router"
import CounterScreen from "@features/counter/screens"
import withConnectedNetworks from "@shared/hocs/with-supported-networks.tsx"
import { memo, useRef } from "react"

const router = createBrowserRouter([
  {
    path: "/",
    element: <CounterScreen />,
  },
])

function App() {
  const renderCount = useRef(0)
  renderCount.current += 1
  return <RouterProvider router={router} />
}

export default withConnectedNetworks(memo(App))
