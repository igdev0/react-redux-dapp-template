import { useChainId } from "wagmi"
import {
  useReadContractCount,
  useWriteContractDecrement,
  useWriteContractIncrement,
} from "@shared/hooks/generated.ts"
import withConnected from "@shared/hocs/with-connected.tsx"
import NotConnected from "@shared/components/not-connected"

function Counter() {
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
    <div className="flex flex-col w-full items-center justify-center gap-5 mt-40">
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
  )
}

export default withConnected(Counter, { fallback: <NotConnected /> })
