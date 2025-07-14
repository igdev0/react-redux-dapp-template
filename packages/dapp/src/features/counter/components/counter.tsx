import { useChainId } from "wagmi"
import {
  useReadContractCount,
  useWriteContractDecrement,
  useWriteContractIncrement,
} from "@shared/hooks/generated.ts"
import withConnected from "@shared/hocs/with-connected.tsx"
import NotConnected from "@shared/components/not-connected"
import { Button } from "@shared/ui/button.tsx"

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
      <h1 className="text-4xl font-bold text-primary">
        Count{": "}
        <span className="text-secondary-foreground">
          {count.data}
          {count.isLoading && "Fetching ..."}
        </span>
      </h1>
      <div className="flex gap-2">
        <Button onClick={handleIncrement} disabled={increment.isPending}>
          Increment
        </Button>
        <Button onClick={handleDecrement} disabled={decrement.isPending}>
          Decrement
        </Button>
      </div>
    </div>
  )
}

export default withConnected(Counter, { fallback: <NotConnected /> })
