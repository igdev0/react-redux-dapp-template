import { PropsWithChildren } from "react"
import "./styles.css"

export default function Screen(props: PropsWithChildren) {
  return <div className="screen">{props.children}</div>
}
