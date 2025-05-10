'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { sleep } from '@/lib/utils'

export function UrlCopy({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setOpen(true)

      await sleep(2000)
      setCopied(false)
      setOpen(false)
    }
    catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-4">
      <div className="flex items-center space-x-2">
        <span>Picker Page URL</span>
        <Input value={url} className="flex-1" readOnly />
        <TooltipProvider>
          <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={copyToClipboard} className="flex-shrink-0">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                <span className="sr-only">Copy URL</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copied!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
