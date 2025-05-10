'use client'

import {
  useActionState,
  useState,
} from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit'
import { Transaction } from '@mysten/sui/transactions'
import { SUIPIN } from '@/constants'
import { PickerModule } from '@/lib/sui/picker-functions'
import { sleep } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PUBLISHER } from '@/constants'

async function uploadImageToWalrus(file: File) {
  try {
    const response = await fetch(`${PUBLISHER}/v1/blobs?epochs=5`, {
      method: 'PUT',
      body: file,
    })

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`)
    }

    return await response.json()
  }
  catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

type FormState = {
  message: string
}

export function NewPicker() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const suiClient = useSuiClient()
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction()

  async function createPicker(
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> {
    const title = formData.get('title') as string
    const pickerImage = formData.get('picker_image') as File | null

    if (!title) {
      return { message: 'Please enter a title.' }
    }

    if (!pickerImage || pickerImage.size === 0) {
      return { message: 'Please select an image file.' }
    }

    const result = await uploadImageToWalrus(pickerImage)
    const imageBlobId = (result.newlyCreated?.blobObject?.blobId || result.alreadyCertified.blobId) as string

    setLoading(true)
    const tx = new Transaction()

    try {
      PickerModule.createPicker(
        tx,
        SUIPIN.testnet.packageId,
        title,
        imageBlobId,
      )

      const result = await signAndExecuteTransaction({ transaction: tx })
      console.log('executed transaction', result)

      const { objectChanges } = await suiClient.waitForTransaction({
        digest: result.digest,
        options: { showObjectChanges: true, showEffects: true },
      })
      const objChange = objectChanges?.find(
        change =>
          change.type === 'created' && change.objectType === `${SUIPIN.testnet.packageId}::picker::Picker`,
      )
      const pickerId = objChange && objChange.type === 'created' ? objChange.objectId : null
      console.log('pickerId', pickerId)

      if (!pickerId) {
        console.error('Post ID not found')
        return { message: 'Post ID not found' }
      }

      await sleep(2000)
      navigate(`/${pickerId}`)
      setLoading(false)
    }
    catch (error) {
      console.error(error)
    }
    finally {
      setLoading(false)
    }

    return { message: '' }
  }

  const [, formAction, isPending] = useActionState<FormState, FormData>(
    createPicker,
    { message: '' },
  )
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Picker</CardTitle>
      </CardHeader>
      <CardContent>

        <form
          action={formAction}
          className="space-y-4 p-6 mx-auto max-w-md"
          onChange={(e) => {
            const target = e.target as HTMLInputElement
            if (target.name === 'picker_image' && target.files?.[0]) {
              setPreviewUrl(URL.createObjectURL(target.files[0]))
            }
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="title">Picker Title</Label>
            <Input id="title" name="title" placeholder="Sui Event Raffle" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image">Image</Label>
            <Input
              id="picker_image"
              name="picker_image"
              type="file"
              accept="image/*"
            />
          </div>

          {previewUrl && (
            <img
              src={previewUrl}
              alt="preview"
              className="size-32 object-contain"
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || loading}
          >
            {isPending || loading
              ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Creating...
                  </>
                )
              : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
