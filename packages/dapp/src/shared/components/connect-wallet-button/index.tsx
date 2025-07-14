import { ConnectButton } from "@rainbow-me/rainbowkit"
import "./style.css"
import { Button } from "@shared/ui/button.tsx"
import { NetworkIcon, Wallet2 } from "lucide-react"

export default function ConnectWalletButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            className={!ready ? "opacity-0 pointer-none select-none" : ""}
            {...(!ready && { "aria-hidden": true })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </Button>
                )
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} type="button">
                    Wrong network
                  </Button>
                )
              }

              return (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-[12] aspect-square rounded-full overflow-hidden mr-[4]"
                        style={{
                          background: chain.iconBackground,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            className="w-[12] aspect-square"
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                    <NetworkIcon />
                  </Button>

                  <Button
                    variant="default"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    <Wallet2 />
                  </Button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
