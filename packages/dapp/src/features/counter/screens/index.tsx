import {
  useReadContractCount,
  useWriteContractDecrement,
  useWriteContractIncrement,
} from "@shared/hooks/generated.ts"
import ConnectWalletButton from "@core/components/connect-wallet-button"
import Screen from "@shared/components/screen"
import { useChainId } from "wagmi"

export default function CounterScreen() {
  const chainId = useChainId()
  const count = useReadContractCount()
  const increment = useWriteContractIncrement()
  const decrement = useWriteContractDecrement()

  const handleIncrement = async () => {
    await increment.writeContractAsync({ chainId: chainId as keyof object })
    await count.refetch()
  }
  const handleDecrement = async () => {
    await decrement.writeContractAsync({ chainId: chainId as keyof object })
    await count.refetch()
  }
  return (
    <Screen>
      <div className="w-full flex justify-center p-4">
        <ConnectWalletButton />
      </div>
      <div className="flex flex-col w-full items-center h-[-webkit-fill-available] justify-center gap-5">
        <h1 className="text-4xl font-bold text-white">
          Count{" "}
          <span className="text-gray-100">
            {count.data}
            {count.isLoading && "Fetching ..."}
          </span>
        </h1>
        <div className="flex gap-2">
          <button
            className="rounded-sm px-4 py-2 bg-amber-500 text-white disabled:bg-amber-400 cursor-pointer"
            onClick={handleIncrement}
            disabled={increment.isPending}
          >
            Increment
          </button>
          <button
            className="rounded-sm px-4 py-2 bg-teal-500 text-white disabled:bg-teal-400 cursor-pointer"
            onClick={handleDecrement}
            disabled={decrement.isPending}
          >
            Decrement
          </button>
        </div>
      </div>
    </Screen>
  )
}
