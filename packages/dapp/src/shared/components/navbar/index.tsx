import ConnectWalletButton from "@shared/components/connect-wallet-button"
import { ThemeToggle } from "@shared/components/theme-toggle"

export default function Navbar() {
  return (
    <nav className="flex justify-end w-full gap-4 p-4">
      <ConnectWalletButton />
      <ThemeToggle />
    </nav>
  )
}
