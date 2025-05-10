import { useParams } from 'react-router'
import { useCurrentAccount } from '@mysten/dapp-kit'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchPickerOwnerCapId, fetchPicker } from '@/lib/suipin-client'

import { Picker } from './picker'

export default function Page() {
  const { pickerId } = useParams()
  const currentAccount = useCurrentAccount()

  if (!pickerId) {
    return <div className="text-center">Post ID is not specified</div>
  }

  if (!currentAccount) {
    return <div className="text-center">Wallet is not connected</div>
  }

  return (
    <View pickerId={pickerId} walletAddress={currentAccount.address} />
  )
}

function View({
  pickerId,
  walletAddress,
}: {
  pickerId: string
  walletAddress: string
}) {
  const { data: picker, refetch } = useSuspenseQuery({
    queryKey: ['fetchPicker', pickerId],
    queryFn: () => fetchPicker(pickerId),
  })

  const { data: pickerOwnerCapId } = useSuspenseQuery({
    queryKey: ['fetchPickerOwnerCapId', pickerId, walletAddress],
    queryFn: () => fetchPickerOwnerCapId(pickerId, walletAddress),
  })

  return (
    <Picker
      picker={picker}
      pickerOwnerCapId={pickerOwnerCapId}
      walletAddress={walletAddress}
      onJoin={async () => await refetch()}
    />
  )
}
