'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface ResultPopupProps {
  name: string
  txDigest: string
  image: string
  onClose: () => void
}

export function ResultPopup({ name, txDigest, image, onClose }: ResultPopupProps) {
  return (
    <Dialog open={true} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">🎉 当選結果 🎉</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <img src={image} alt="当選NFT" className="size-48 object-cover" />

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">当選者</h3>
            <p className="text-2xl font-bold text-blue-600">{name}</p>
          </div>

          <div className="w-full">
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={() => window.open(`https://testnet.suivision.xyz/txblock/${txDigest}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              抽選結果をSuiVisionで確認する
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
