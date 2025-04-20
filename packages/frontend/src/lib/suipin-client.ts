import { SUIPIN } from '@/constants'
import { objResToFields } from '@polymedia/suitcase-core'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography'
import type { Picker, Participant, WinnerSelectedEvent, Winner } from '@/types'

const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') })

export async function fetchSuiBalance(walletAddress: string) {
  const response = await suiClient.getBalance({
    owner: walletAddress,
  })
  const balance = Number(response.totalBalance) / 1_000_000_000
  return balance
}

export async function fundSui(address: string) {
  const balance = await fetchSuiBalance(address)
  if (balance > 0.1) {
    console.log('already funded')
    return
  }

  const privateKey
  = 'suiprivkey1qqcwgpdwn0xzyy5w0zdx0wu5v7gem65ek3vh5q0482qc87u6hc9ryl36uhm'
  const keypair = Ed25519Keypair.fromSecretKey(
    decodeSuiPrivateKey(privateKey).secretKey,
  )

  try {
    const tx = new Transaction()
    const [coin] = tx.splitCoins(tx.gas, [100_000_000])
    tx.transferObjects([coin], address)
    await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      requestType: 'WaitForLocalExecution',
    })
  }
  catch (error) {
    console.error('Error funding SUI:', error)
  }
}

export async function fetchPicker(pickerId: string) {
  const response = await suiClient.getObject({
    id: pickerId,
    options: {
      showContent: true,
    },
  })

  const fields = objResToFields(response)
  // console.log('fields', fields, fields.winner.fields.tx_digest)
  // console.log('inamoto', toBase64(bcs.vector(bcs.u8()).serialize(fields.winner.fields.tx_digest).toBytes()))
  // console.log('inamoto', bcs.string().parse(fields.winner.fields.tx_digest))

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const participants = fields.participants.fields.contents.map((obj: any) => {
    const participant: Participant = {
      address: obj.fields.key,
      name: obj.fields.value,
    }
    return participant
  })

  const winner = await fetchPickerWinner(pickerId)

  const picker: Picker = {
    id: fields.id.id,
    title: fields.title,
    imageBlobId: fields.image_blob_id,
    participants,
    winner,
  }
  console.log('picker', picker)

  return picker
}

async function fetchPickerWinner(pickerId: string) {
  const { data } = await suiClient.queryEvents({
    query: {
      MoveEventType: `${SUIPIN.testnet.packageId}::picker::WinnerSelected`,
    },
  })

  const winner = data
    .map((event) => {
      const eventData = event.parsedJson as WinnerSelectedEvent
      const winner: Winner = {
        pickerId: eventData.picker_id,
        txDigest: event.id.txDigest,
        address: eventData.participant_addr,
        name: eventData.participant_name,
      }
      return winner
    })
    .find(winner => winner.pickerId === pickerId)

  return winner || null
}

export async function fetchPickerOwnerCapId(
  pickerId: string,
  userAddress: string,
): Promise<string | null> {
  const response = await suiClient.getOwnedObjects({
    owner: userAddress,
    filter: {
      MatchAll: [
        {
          StructType: `${SUIPIN.testnet.packageId}::picker::PickerOwnerCap`,
        },
      ],
    },
    options: {
      showContent: true,
    },
  })

  const pickerOwnerCap = response.data.find((obj) => {
    const fields = objResToFields(obj)
    return fields.picker_id === pickerId
  })
  if (!pickerOwnerCap) return null

  const fields = objResToFields(pickerOwnerCap)
  return fields.id.id
}
