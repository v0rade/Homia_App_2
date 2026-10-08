"use client"

import * as React from "react"
import {
  FileText,
  Calendar,
  DollarSign,
  ShieldCheck,
  Download,
  AlertCircle,
  Home,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TenantLeasePage() {
  const lease = {
    id: "LSE-2025-A203",
    room: "A-203",
    property: "Homia Stay Menteng",
    startDate: "15 Oktober 2025",
    endDate: "21 Oktober 2026",
    daysLeft: 14,
    monthlyRent: 2100000,
    deposit: 2100000,
    paymentDueDay: "Tanggal 10 setiap bulan",
    status: "EXPIRING_SOON",
    amenities: [
      "AC 1 PK Daikin Inverter",
      "Kamar Mandi Dalam & Water Heater",
      "Springbed Queen Size (160x200)",
      "Lemari Pakaian 2 Pintu & Meja Kerja",
      "High-Speed Wi-Fi 100 Mbps",
      "Smart Door Lock Entry",
    ],
    rules: [
      "Jam malam gerbang utama: 23:00 WIB (akses setelahnya menggunakan smart lock / PIN)",
      "Tamu menginap wajib melapor ke pengelola maksimal 1x24 jam",
      "Dilarang merokok di dalam kamar dan koridor ber-AC",
      "Pembayaran sewa paling lambat tanggal 10 setiap bulan",
      "Uang jaminan (deposit) akan dikembalikan H+3 setelah check-out dan audit kondisi kamar",
    ],
  }

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Perjanjian Sewa (Lease)</h1>
          <p className="text-sm text-muted-foreground">
            Detail kontrak sewa, uang jaminan, fasilitas, dan tata tertib hunian
          </p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto">
          <Download size={15} />
          <span>Unduh Dokumen Kontrak (PDF)</span>
        </Button>
      </div>

      {/* Renewal Alert */}
      {lease.daysLeft <= 14 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Masa Sewa Akan Berakhir dalam {lease.daysLeft} Hari!
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Kontrak Anda berakhir pada {lease.endDate}. Segera hubungi pengelola untuk
                konfirmasi perpanjangan sewa atau persiapan check-out.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Ajukan Perpanjangan Kontrak
                </Button>
                <Button size="sm" variant="outline">
                  Konfirmasi Check-out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Core Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                Unit & Properti
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {lease.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Properti</span>
              <span className="font-semibold">{lease.property}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Kamar</span>
              <span className="font-semibold text-primary">Room {lease.room}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Mulai Sewa</span>
              <span className="font-medium">{lease.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Berakhir Sewa</span>
              <span className="font-medium">{lease.endDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Keuangan & Uang Jaminan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Sewa Bulanan</span>
              <span className="font-bold text-foreground">{formatIDR(lease.monthlyRent)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Deposit Jaminan</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatIDR(lease.deposit)}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Jatuh Tempo Pembayaran</span>
              <span className="font-medium text-foreground">{lease.paymentDueDay}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status Kontrak</span>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                Segera Berakhir
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities & Amenities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventaris & Fasilitas Kamar</CardTitle>
          <CardDescription className="text-xs">
            Barang inventaris milik pengelola yang dipinjamkan selama masa sewa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {lease.amenities.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* House Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Tata Tertib & Peraturan Hunian
          </CardTitle>
          <CardDescription className="text-xs">
            Aturan bersama demi kenyamanan, ketertiban, dan keamanan seluruh penghuni
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground leading-relaxed">
            {lease.rules.map((rule, idx) => (
              <li key={idx} className="pl-1">
                <span className="text-foreground">{rule}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
