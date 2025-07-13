import ConnectWalletButton from "@shared/components/connect-wallet-button"
import Screen from "@shared/components/screen"
import Counter from "@features/counter/components/counter.tsx"

export default function CounterScreen() {
  return (
    <Screen>
      <div className="w-full flex justify-center p-4">
        <ConnectWalletButton />
      </div>
      <Counter />
    </Screen>
  )
}
