"use client"

import * as React from "react"
import { MessageSquare, Copy, ExternalLink, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WhatsAppReminderProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantName: string
  tenantPhone: string
  roomNumber: string
  amount: number
  dueDate: string
  invoiceNumber: string
}

export function WhatsAppReminderModal({
  open,
  onOpenChange,
  tenantName,
  tenantPhone,
  roomNumber,
  amount,
  dueDate,
  invoiceNumber,
}: WhatsAppReminderProps) {
  const [copied, setCopied] = React.useState(false)

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount)

  const messageText = `Halo ${tenantName},

Tagihan kos untuk Room ${roomNumber} (#${invoiceNumber}) telah tersedia.

Total: ${formattedAmount}
Jatuh tempo: ${dueDate}

Silakan melakukan pembayaran sebelum tanggal jatuh tempo. Anda dapat mengunggah bukti transfer melalui Tenant Portal Homia OS.

Terima kasih,
Homia Stay Management`

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenWhatsApp = () => {
    // Sanitize phone number for international format (e.g. 0812 -> 62812)
    let cleanPhone = tenantPhone.replace(/\D/g, "")
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1)
    }
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>WhatsApp Payment Reminder</DialogTitle>
              <DialogDescription>
                Generated reminder message for {tenantName} ({roomNumber})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative mt-2 rounded-lg border bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground">
          {messageText}
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopy}
            className="flex items-center gap-1.5"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Text"}</span>
          </Button>

          <Button
            type="button"
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-1.5 bg-[#25D366] text-white hover:bg-[#1ebd5a]"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Open WhatsApp Deep-link</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
