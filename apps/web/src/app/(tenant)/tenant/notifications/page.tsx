"use client"

import * as React from "react"
import {
  Bell,
  CheckCircle2,
  FileText,
  CreditCard,
  Wrench,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotificationItem {
  id: string
  title: string
  message: string
  type: "INVOICE" | "PAYMENT" | "LEASE" | "MAINTENANCE" | "ANNOUNCEMENT"
  isRead: boolean
  timestamp: string
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Tagihan Kos Oktober 2026 Tersedia",
    message: "Tagihan bulanan sebesar Rp 1.825.000 (Sewa + Listrik + Air + Wi-Fi) telah dibuat. Jatuh tempo pada 10 Oktober 2026.",
    type: "INVOICE",
    isRead: false,
    timestamp: "7 Oktober 2026, 08:30 WIB",
  },
  {
    id: "notif-2",
    title: "Pengingat Masa Sewa Berakhir (H-14)",
    message: "Kontrak sewa Room A-203 akan berakhir pada 21 Oktober 2026. Silakan hubungi pengelola untuk konfirmasi perpanjangan.",
    type: "LEASE",
    isRead: false,
    timestamp: "6 Oktober 2026, 10:00 WIB",
  },
  {
    id: "notif-3",
    title: "Pengumuman: Pembersihan Toren Air Sabtu Depan",
    message: "Pasokan air bersih akan dihentikan sementara pada Sabtu, 10 Oktober pukul 09:00 - 13:00 WIB untuk pembersihan berkala.",
    type: "ANNOUNCEMENT",
    isRead: true,
    timestamp: "5 Oktober 2026, 15:45 WIB",
  },
  {
    id: "notif-4",
    title: "Pembayaran Tagihan September Terverifikasi",
    message: "Pembayaran invoice #INV-2026-09-0021 sebesar Rp 1.800.000 telah diverifikasi oleh pengelola. Terima kasih!",
    type: "PAYMENT",
    isRead: true,
    timestamp: "10 September 2026, 14:20 WIB",
  },
  {
    id: "notif-5",
    title: "Tiket Perbaikan TKT-007 Selesai Dikerjakan",
    message: "Teknisi telah menyelesaikan perbaikan pemanas air kamar mandi Anda.",
    type: "MAINTENANCE",
    isRead: true,
    timestamp: "5 Oktober 2026, 11:30 WIB",
  },
]

export default function TenantNotificationsPage() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(initialNotifications)

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const markSingleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "INVOICE":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "PAYMENT":
        return <CreditCard className="h-5 w-5 text-green-500" />
      case "LEASE":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "MAINTENANCE":
        return <Wrench className="h-5 w-5 text-purple-500" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Pusat Notifikasi</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                {unreadCount} Belum Dibaca
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Pemberitahuan resmi terkait tagihan, perbaikan, perpanjangan sewa, dan pengumuman kos
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="self-start sm:self-auto">
            Tandai Semua Sudah Dibaca
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card
            key={notif.id}
            onClick={() => markSingleRead(notif.id)}
            className={`cursor-pointer transition-all hover:border-primary/40 ${
              !notif.isRead
                ? "border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-sm"
                : "bg-card opacity-90"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-full border bg-background p-2 shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm ${!notif.isRead ? "font-bold text-foreground" : "font-medium"}`}>
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="pt-1 text-[11px] text-muted-foreground font-mono">
                    {notif.timestamp}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
