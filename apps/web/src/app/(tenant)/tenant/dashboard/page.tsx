'use client';

import {
  Home,
  FileText,
  CreditCard,
  Wrench,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const tenant = {
  name: 'Andi Saputra',
  room: 'A-203',
  floor: 2,
  type: 'DOUBLE',
  monthlyRent: 2100000,
  leaseEnd: '2026-12-31',
  daysLeft: 85,
};

const currentInvoice = {
  number: 'INV-2026-10-0021',
  month: 'Oktober 2026',
  dueDate: '10 Oktober 2026',
  total: 1825000,
  status: 'PENDING',
  items: [
    { label: 'Sewa Kamar',  amount: 1500000 },
    { label: 'Listrik',     amount: 125000 },
    { label: 'Air',         amount: 50000 },
    { label: 'Internet',    amount: 100000 },
    { label: 'Denda Telat', amount: 50000 },
  ],
};

const recentNotifications = [
  { id: '1', type: 'INVOICE', message: 'Tagihan Oktober 2026 telah dibuat', time: '2 jam lalu', isRead: false },
  { id: '2', type: 'PAYMENT', message: 'Pembayaran September telah diverifikasi', time: '3 hari lalu', isRead: true },
  { id: '3', type: 'ANNOUNCEMENT', message: 'Pemeliharaan air Sabtu 11 Okt pukul 09:00', time: '5 hari lalu', isRead: true },
];

const myTickets = [
  { id: '1', number: 'TKT-001', title: 'AC Tidak Dingin', status: 'OPEN', priority: 'URGENT', time: '3 jam lalu' },
  { id: '2', number: 'TKT-007', title: 'Air Panas Bermasalah', status: 'RESOLVED', priority: 'HIGH', time: '3 hari lalu' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

const NOTIF_ICON: Record<string, React.ElementType> = {
  INVOICE: FileText, PAYMENT: CreditCard, ANNOUNCEMENT: Bell, MAINTENANCE: Wrench,
};

const STATUS_BADGE: Record<string, string> = {
  OPEN: 'bg-red-100 text-red-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  WAITING: 'bg-amber-100 text-amber-700',
  RESOLVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TenantDashboardPage() {
  const daysUntilDue = Math.ceil((new Date('2026-10-10').getTime() - Date.now()) / 86400000);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Top Header */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Selamat datang</p>
            <h1 className="text-base font-bold">{tenant.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {tenant.name[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4">
        {/* Room Info Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/70">Kamar Anda</p>
              <p className="text-3xl font-bold">{tenant.room}</p>
              <p className="mt-1 text-sm text-white/80">Lantai {tenant.floor} · {tenant.type}</p>
            </div>
            <div className="rounded-xl bg-white/20 px-4 py-2 text-center">
              <p className="text-xs text-white/70">Kontrak berakhir</p>
              <p className="text-sm font-bold">{tenant.daysLeft} hari</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/15 px-4 py-2">
            <span className="text-sm text-white/80">Sewa bulanan</span>
            <span className="font-bold">{fmt(tenant.monthlyRent)}</span>
          </div>
        </div>

        {/* Current Invoice Alert */}
        <Card className={`border-2 ${currentInvoice.status === 'PENDING' ? 'border-amber-300 dark:border-amber-700' : 'border-green-300'}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">{currentInvoice.month}</p>
                <p className="text-xl font-bold">{fmt(currentInvoice.total)}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Jatuh tempo: <strong className="text-foreground">{currentInvoice.dueDate}</strong></span>
                  {daysUntilDue > 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                      {daysUntilDue}d lagi
                    </span>
                  )}
                </div>
              </div>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                {currentInvoice.status}
              </span>
            </div>

            {/* Itemized */}
            <div className="space-y-1.5 border-t pt-3">
              {currentInvoice.items.map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={item.label === 'Denda Telat' ? 'font-medium text-red-600' : 'font-medium'}>
                    {fmt(item.amount)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 text-sm font-bold">
                <span>Total</span>
                <span>{fmt(currentInvoice.total)}</span>
              </div>
            </div>

            <Button className="mt-4 w-full" size="sm">
              <CreditCard className="mr-2 h-4 w-4" />
              Upload Bukti Pembayaran
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tagihan', icon: FileText, href: '/tenant/billing', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
            { label: 'Keluhan', icon: Wrench, href: '/tenant/maintenance', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
            { label: 'Notifikasi', icon: Bell, href: '/tenant/notifications', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <div className={`rounded-xl p-3 ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Maintenance Tickets */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Laporan Saya</CardTitle>
              <Link href="/tenant/maintenance" className="text-xs text-primary hover:underline">
                Lihat semua
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground">{ticket.number} · {ticket.time}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[ticket.status]}`}>
                  {ticket.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifikasi Terbaru</CardTitle>
              <Link href="/tenant/notifications" className="text-xs text-primary hover:underline">
                Semua
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {recentNotifications.map((n) => {
              const Icon = NOTIF_ICON[n.type] ?? Bell;
              return (
                <div key={n.id} className={`flex items-start gap-3 rounded-lg p-3 ${!n.isRead ? 'bg-primary/5' : ''}`}>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-medium' : 'text-muted-foreground'}`}>{n.message}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  {!n.isRead && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/90 backdrop-blur-sm">
        <div className="flex items-center">
          {[
            { href: '/tenant/dashboard', icon: Home, label: 'Home' },
            { href: '/tenant/billing', icon: FileText, label: 'Tagihan' },
            { href: '/tenant/maintenance', icon: Wrench, label: 'Keluhan' },
            { href: '/tenant/notifications', icon: Bell, label: 'Notif' },
            { href: '/tenant/profile', icon: User, label: 'Profil' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-muted-foreground transition-colors hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
