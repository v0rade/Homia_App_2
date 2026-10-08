"use client"

import * as React from "react"
import {
  CreditCard,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PaymentRecord {
  id: string
  paymentNumber: string
  invoiceNumber: string
  period: string
  amount: number
  method: string
  status: "VERIFIED" | "PENDING" | "REJECTED"
  paidAt: string
  proofUrl?: string
}

const initialPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    paymentNumber: "PAY-2026-09-0021",
    invoiceNumber: "INV-2026-09-0021",
    period: "September 2026",
    amount: 1800000,
    method: "BCA Virtual Account",
    status: "VERIFIED",
    paidAt: "9 September 2026, 14:10 WIB",
  },
  {
    id: "pay-2",
    paymentNumber: "PAY-2026-08-0021",
    invoiceNumber: "INV-2026-08-0021",
    period: "Agustus 2026",
    amount: 1750000,
    method: "Bank Transfer (Manual)",
    status: "VERIFIED",
    paidAt: "8 Agustus 2026, 09:25 WIB",
  },
  {
    id: "pay-3",
    paymentNumber: "PAY-2026-07-0021",
    invoiceNumber: "INV-2026-07-0021",
    period: "Juli 2026",
    amount: 1820000,
    method: "Bank Transfer (Manual)",
    status: "VERIFIED",
    paidAt: "10 Juli 2026, 19:40 WIB",
  },
]

export default function TenantPaymentsPage() {
  const [payments, setPayments] = React.useState<PaymentRecord[]>(initialPayments)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [uploadInvoiceNo, setUploadInvoiceNo] = React.useState("INV-2026-10-0021")
  const [amountInput, setAmountInput] = React.useState("1825000")
  const [isUploading, setIsUploading] = React.useState(false)

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    setTimeout(() => {
      const newPay: PaymentRecord = {
        id: `pay-${Date.now()}`,
        paymentNumber: `PAY-2026-10-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceNumber: uploadInvoiceNo,
        period: "Oktober 2026",
        amount: parseInt(amountInput),
        method: "Bank Transfer (Manual)",
        status: "PENDING",
        paidAt: "Baru saja (Menunggu Verifikasi)",
      }

      setPayments([newPay, ...payments])
      setIsUploading(false)
      setModalOpen(false)
    }, 600)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Riwayat Pembayaran</h1>
          <p className="text-sm text-muted-foreground">
            Catatan transaksi pembayaran sewa dan bukti transfer yang telah terverifikasi
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Upload size={16} />
          <span>Upload Bukti Transfer</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Transaksi</CardTitle>
          <CardDescription className="text-xs">
            Buku besar pembayaran bersifat immutable (tidak dapat diubah setelah diverifikasi)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">No. Pembayaran & Invoice</th>
                  <th className="px-6 py-4">Periode</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4">Metode</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Kuitansi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold text-foreground">{p.paymentNumber}</div>
                      <div className="font-mono text-xs text-muted-foreground">{p.invoiceNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{p.period}</div>
                      <div className="text-xs text-muted-foreground">{p.paidAt}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {formatIDR(p.amount)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{p.method}</td>
                    <td className="px-6 py-4">
                      {p.status === "VERIFIED" ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                          Terverifikasi
                        </Badge>
                      ) : p.status === "PENDING" ? (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Menunggu Review
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Ditolak</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                        <Download size={13} />
                        <span>PDF</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle>Unggah Bukti Pembayaran</DialogTitle>
              <DialogDescription>
                Transfer ke Rekening BCA: <strong>800-123-4567</strong> a.n. PT Homia Properti Sejahtera
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Nomor Invoice
                </label>
                <Input
                  value={uploadInvoiceNo}
                  onChange={(e) => setUploadInvoiceNo(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Nominal yang Ditransfer (Rp)
                </label>
                <Input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div className="rounded-lg border border-dashed p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Klik untuk memilih file struk / screenshot m-banking</p>
                <p className="text-xs text-muted-foreground">Format JPG, PNG, atau PDF (maks 5MB)</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
