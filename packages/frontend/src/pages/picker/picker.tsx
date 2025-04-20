'use client'

import { useState, useEffect } from 'react'
import { Wheel } from 'react-custom-roulette'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Confetti } from '@/components/common/confetti'
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { PickerModule } from '@/lib/sui/picker-functions'
import { generateNameStyleObjects } from '@/lib/picker-color'
import { SUIPIN } from '@/constants'
import { sleep } from '@/lib/utils'
import type { Picker, WinnerSelectedEvent } from '@/types'
import { Loader2 } from 'lucide-react'
import { UrlCopy } from '@/components/common/url-copy'
import { AGGREGATOR } from '@/constants'
import useSound from 'use-sound'
import spinningSound from '@/assets/spinning_sound.m4a'
import resultSound from '@/assets/result_sound.m4a'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fetchSuiBalance, fundSui } from '@/lib/suipin-client'
import { toast } from 'sonner'

import { ResultPopup } from './result-popup'

function getPickerImage(imageBlobId: string) {
  return `${AGGREGATOR}/v1/blobs/${imageBlobId}`
}

type Props = {
  picker: Picker
  pickerOwnerCapId: string | null
  walletAddress: string
  onJoin: () => void
}

export function Picker({
  picker,
  pickerOwnerCapId,
  walletAddress,
  onJoin,
}: Props,
) {
  const { data: balance } = useSuspenseQuery({
    queryKey: ['fetchSuiBalance', walletAddress],
    queryFn: () => fetchSuiBalance(walletAddress),
  })
  const { refetch: refetchBalance } = useSuspenseQuery({
    queryKey: ['fetchSuiBalance', walletAddress],
    queryFn: () => fetchSuiBalance(walletAddress),
  })

  const { participants } = picker
  const hasParticipants = participants.length > 0
  const data = generateNameStyleObjects(participants).map(p => ({
    option: p.name,
    style: p.style,
  }))

  const canDoSpin = hasParticipants && pickerOwnerCapId && !picker.winner

  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [tx, setTx] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const [playSpinningSound, { stop: stopSpinningSound }] = useSound(spinningSound)
  const [playResultSound] = useSound(resultSound)

  const handleSpinStop = () => {
    setMustSpin(false)
    setSpinning(false)
    setShowResult(true)
    playResultSound()
    stopSpinningSound()
  }

  const closeResult = () => {
    setShowResult(false)
  }

  useEffect(() => {
    if (picker.winner) {
      setShowResult(true)
    }
  }, [picker])

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center text-2xl">{picker.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-4">
          {hasParticipants && (
            <div className="relative">
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={handleSpinStop}
                backgroundColors={data.map(item => item.style.backgroundColor)}
                textColors={data.map(item => item.style.textColor)}
                fontSize={16}
                outerBorderColor="#f9f9f9"
                outerBorderWidth={1}
                innerBorderColor="#f9f9f9"
                innerBorderWidth={1}
                innerRadius={30}
                radiusLineColor="#dddddd"
                radiusLineWidth={1}
                perpendicularText={false}
                textDistance={70}
                pointerProps={{
                  src: '/sui-arrow.png',

                }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-2 border-white">
                <img src={getPickerImage(picker.imageBlobId)} alt="SUI NFT" width={120} height={120} className="object-cover" />
              </div>
            </div>
          )}

          {!hasParticipants && (
            <img src={getPickerImage(picker.imageBlobId)} alt="SUI NFT" width={120} height={120} className="object-cover" />
          )}

        </CardContent>
        <CardFooter className="p-2 flex flex-col items-center gap-6">
          {hasParticipants && (
            <div className="text-center w-full">
              <p className="text-gray-500">
                参加人数:
                {participants.length}
                人
              </p>
            </div>
          )}

          {!hasParticipants && pickerOwnerCapId && (
            <div className="text-center w-full">
              <p className="text-gray-500">参加者を待っています</p>
            </div>
          )}

          {!pickerOwnerCapId && (
            <JoinSection
              picker={picker}
              walletAddress={walletAddress}
              onJoin={onJoin}
            />
          )}

          {canDoSpin && (
            <DoSection
              picker={picker}
              pickerOwnerCapId={pickerOwnerCapId}
              spinning={spinning}
              handleWinnerSelected={(winnerIndex, tx) => {
                setMustSpin(true)
                playSpinningSound()
                setSpinning(true)
                setPrizeNumber(winnerIndex)
                setTx(tx)
              }}
            />
          )}

          {picker.winner && (
            <div className="text-center w-full space-y-2">
              <p className="text-gray-500">抽選は終了しました</p>
              <Button
                onClick={() => setShowResult(true)}
                variant="outline"
              >
                当選者を確認する
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <UrlCopy url={`${window.location.origin}/${picker.id}`} />

      {balance < 0.1 && (
        <Button onClick={async () => {
          await fundSui(walletAddress)
          toast('Testnet SUIを取得しました')
          await sleep(2000)
          await refetchBalance()
        }}
        >
          Get $SUI Token (testnet)
        </Button>
      )}

      {showResult && tx && (
        <>
          <Confetti active={true} />
          <ResultPopup name={participants[prizeNumber].name} txDigest={tx} image={getPickerImage(picker.imageBlobId)} onClose={closeResult} />
        </>
      )}

      {showResult && picker.winner && (
        <>
          <Confetti active={true} />
          <ResultPopup name={picker.winner.name} txDigest={picker.winner.txDigest} image={getPickerImage(picker.imageBlobId)} onClose={closeResult} />
        </>
      )}
    </div>
  )
}

type DoSectionProps = {
  picker: Picker
  pickerOwnerCapId: string
  spinning?: boolean
  handleWinnerSelected: (winnerIndex: number, tx: string) => void
}

function DoSection({
  picker, pickerOwnerCapId, spinning = false, handleWinnerSelected,
}: DoSectionProps) {
  const suiClient = useSuiClient()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  async function doSpin() {
    const tx = new Transaction()

    try {
      PickerModule.doPicker(
        tx,
        SUIPIN.testnet.packageId,
        pickerOwnerCapId,
        picker.id,
      )

      const result = await signAndExecuteTransaction({ transaction: tx })
      const { events } = await suiClient.waitForTransaction({
        digest: result.digest,
        options: { showEvents: true },
      })

      const winnerSelectedEvent = events?.[0]?.parsedJson as WinnerSelectedEvent
      const name = winnerSelectedEvent?.participant_name
      console.log('Winner selected:', name)

      if (!name) {
        console.error('Winner name not found in event')
        return
      }

      const winnerIndex = picker.participants.findIndex(p => p.name === name)
      if (winnerIndex !== -1) {
        handleWinnerSelected(winnerIndex, result.digest)
      }
      else {
        console.error('Winner not found in participants')
      }
    }
    catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      onClick={doSpin}
      disabled={spinning}
      className="w-full font-bold text-lg"
      size="lg"
    >
      {spinning
        ? (
            <>
              <Loader2 className="animate-spin" />
              抽選中...
            </>
          )
        : '抽選開始！'}
    </Button>
  )
}

type JoinSectionProps = {
  picker: Picker
  walletAddress: string
  onJoin: () => void
}
function JoinSection({
  picker, walletAddress, onJoin,
}: JoinSectionProps) {
  const isJoined = picker.participants.find(p => p.address === walletAddress) !== undefined
  const [name, setName] = useState('')
  const [joinning, setJoinning] = useState(false)
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  async function join() {
    if (isJoined || !name) return

    setJoinning(true)
    const tx = new Transaction()

    try {
      PickerModule.join(
        tx,
        SUIPIN.testnet.packageId,
        picker.id,
        name,
      )

      const result = await signAndExecuteTransaction({ transaction: tx })
      console.log('executed transaction', result)
      await sleep(2000)
      onJoin()
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setJoinning(false)
    }
  }

  return (
    <div className="w-full">
      {!isJoined && (
        <Input
          className="w-full mb-2"
          placeholder="名前を入力してください(重複不可)"
          disabled={isJoined}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      )}
      <Button
        onClick={join}
        disabled={joinning || isJoined || !name}
        className="w-full font-bold text-lg"
        size="lg"
      >
        {isJoined
          ? '参加受付完了'
          : joinning
            ? (
                <>
                  <Loader2 className="animate-spin" />
                  申し込み中...
                </>
              )
            : '💧参加する'}
      </Button>
    </div>
  )
}
