import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { truncateAddress } from '@/lib/utils'
import {
  useCurrentAccount,
  useDisconnectWallet,
  ConnectModal,
} from '@mysten/dapp-kit'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { WalletAccount } from '@mysten/wallet-standard'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchSuiBalance } from '@/lib/suipin-client'

export function Header() {
  const [open, setOpen] = useState(false)
  const currentAccount = useCurrentAccount()

  return (
    <header className="w-full py-2 px-6 flex justify-between items-center border-b">
      <Link to="/" className="text-2xl font-bold text-primary">
        Suipin
        <span className="text-sm"> (Testnet)</span>
      </Link>

      <div className="flex justify-between items-center gap-4">
        {/* <Button variant="link" asChild>
          <Link to="https://faucet.sui.io/" target="_blank" className="text-sm text-primary">
            Get $SUI token
          </Link>
        </Button> */}

        {!currentAccount && (
          <ConnectModal
            trigger={(
              <Button>
                Connect Wallet
              </Button>
            )}
            open={open}
            onOpenChange={isOpen => setOpen(isOpen)}
          />
        )}

        {currentAccount && (
          <WalletMenu
            walletAccount={currentAccount}
          />
        )}
      </div>
    </header>
  )
}

function WalletMenu({
  walletAccount,
}: {
  walletAccount: WalletAccount
}) {
  const { data: balance } = useSuspenseQuery({
    queryKey: ['fetchSuiBalance', walletAccount.address],
    queryFn: () => fetchSuiBalance(walletAccount.address),
  })

  return (
    <div className="flex justify-between items-center gap-4">
      <Badge variant="secondary">
        {Number(balance).toFixed(2)}
        {' '}
        SUI
      </Badge>
      <WalletButton
        walletAccount={walletAccount}
      />
    </div>
  )
}

function WalletButton({
  walletAccount,
}: {
  walletAccount: WalletAccount
}) {
  const { mutate: disconnect } = useDisconnectWallet()

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <Button>
            {truncateAddress(walletAccount.address)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-3 p-3">
            {/* {walletAccount?.label && <p>{walletAccount.label}</p>} */}
            <p>{truncateAddress(walletAccount.address)}</p>
            <Button variant="outline" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
