import { PropsWithChildren } from "react"
import "./styles.css"
import { useAccount, useChains, useSwitchChain } from "wagmi"

export default function Screen(props: PropsWithChildren) {
  const account = useAccount()
  const chains = useChains()
  const { switchChain } = useSwitchChain()
  if (!chains.some(chain => chain.id === account.chainId)) {
    return (
      <div className="screen text-center flex flex-col justify-center items-center w-full">
        <h1 className="text-white text-3xl">
          The current network is not supported by the app
        </h1>
        <p className="text-white">
          Please switch your network to one of the following
        </p>
        {chains.map(chain => (
          <button
            className="px-4 py-2 bg-white rounded-sm cursor-pointer"
            onClick={() => switchChain({ chainId: chain.id })}
          >
            {chain.name}
          </button>
        ))}
      </div>
    )
  }

  return <div className="screen">{props.children}</div>
}
