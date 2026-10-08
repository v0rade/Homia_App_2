"use client"

import * as React from "react"
import {
  Wrench,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Calendar,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TenantTicket {
  id: string
  ticketNumber: string
  title: string
  category: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED" | "CLOSED"
  description: string
  createdAt: string
  updatedAt: string
}

const mockTenantTickets: TenantTicket[] = [
  {
    id: "tkt-1",
    ticketNumber: "TKT-001",
    title: "AC Unit Tidak Dingin (Hembusan Angin Saja)",
    category: "AC",
    priority: "URGENT",
    status: "OPEN",
    description: "AC kamar A-203 menyala tetapi udara tidak sejuk sama sekali. Suhu ruangan mencapai 34°C saat siang.",
    createdAt: "7 Oktober 2026, 10:15 WIB",
    updatedAt: "7 Oktober 2026, 10:15 WIB",
  },
  {
    id: "tkt-2",
    ticketNumber: "TKT-007",
    title: "Water Heater Kamar Mandi Mati",
    category: "PLUMBING",
    priority: "HIGH",
    status: "RESOLVED",
    description: "Pemanas air tidak menyala saat saklar ditekan. Air tetap dingin.",
    createdAt: "4 Oktober 2026, 14:00 WIB",
    updatedAt: "5 Oktober 2026, 11:30 WIB",
  },
]

export default function TenantMaintenancePage() {
  const [tickets, setTickets] = React.useState<TenantTicket[]>(mockTenantTickets)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState("AC")
  const [priority, setPriority] = React.useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM")
  const [description, setDescription] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) return

    const newTicket: TenantTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      title,
      category,
      priority,
      status: "OPEN",
      description,
      createdAt: "Baru saja",
      updatedAt: "Baru saja",
    }

    setTickets([newTicket, ...tickets])
    setModalOpen(false)
    setTitle("")
    setDescription("")
  }

  const getStatusBadge = (status: TenantTicket["status"]) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">Menunggu Teknisi</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Sedang Dikerjakan</Badge>
      case "WAITING":
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">Menunggu Sparepart</Badge>
      case "RESOLVED":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">Selesai Diperbaiki</Badge>
      default:
        return <Badge variant="secondary">Ditutup</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keluhan & Perbaikan (Maintenance)</h1>
          <p className="text-sm text-muted-foreground">
            Laporkan kerusakan fasilitas kamar atau area publik. Tim teknisi akan merespons sesuai SLA.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus size={16} />
          <span>Buat Laporan Baru</span>
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <Card key={t.id} className="transition-all hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      {t.ticketNumber}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {t.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold mt-1">{t.title}</CardTitle>
                </div>
                <div>{getStatusBadge(t.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {t.description}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Dibuat: {t.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    Prioritas: <span className={t.priority === "URGENT" ? "text-red-600 font-bold" : ""}>{t.priority}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Ticket Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Buat Laporan Perbaikan Baru</DialogTitle>
              <DialogDescription>
                Jelaskan masalah secara spesifik agar teknisi membawa peralatan yang sesuai.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Judul Keluhan
                </label>
                <Input
                  placeholder="Contoh: Kran wastafel bocor / Lampu kamar mati"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Kategori Kerusakan
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  >
                    <option value="AC">AC / Pendingin Ruangan</option>
                    <option value="PLUMBING">Plambing / Pipa & Air</option>
                    <option value="ELECTRICAL">Listrik & Lampu</option>
                    <option value="INTERNET">Wi-Fi & Internet</option>
                    <option value="DOOR">Pintu & Kunci (Smart Lock)</option>
                    <option value="FURNITURE">Furnitur & Perabotan</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Tingkat Kepentingan
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  >
                    <option value="LOW">Rendah (Bisa ditunda)</option>
                    <option value="MEDIUM">Sedang (Dalam 24-48 jam)</option>
                    <option value="HIGH">Tinggi (Dalam 12 jam)</option>
                    <option value="URGENT">Mendesak / Darurat (&lt; 4 jam)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">
                  Penjelasan Detail Kerusakan
                </label>
                <Textarea
                  placeholder="Tuliskan tanda-tanda kerusakan, bunyi aneh, atau waktu kejadian..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div className="rounded-lg border border-dashed p-4 text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-1 text-xs text-muted-foreground">
                  Unggah Foto Kerusakan (Opsional) - Maksimal 3 foto
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Kirim Laporan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
