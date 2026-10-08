"use client"

import * as React from "react"
import { AlertCircle, Calendar, Plus, FileText, CheckCircle2, Clock, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const leases = [
  {
    id: "lease-1",
    room: "A-203",
    tenant: "Andi Saputra",
    startDate: "2025-10-15",
    endDate: "2026-10-21", // 14 days remaining
    daysRemaining: 14,
    monthlyRent: 2100000,
    deposit: 2100000,
    dueDay: 10,
    status: "EXPIRING_SOON",
  },
  {
    id: "lease-2",
    room: "A-104",
    tenant: "Dian Permata",
    startDate: "2025-10-01",
    endDate: "2026-10-14", // 7 days remaining
    daysRemaining: 7,
    monthlyRent: 2500000,
    deposit: 2500000,
    dueDay: 1,
    status: "EXPIRING_SOON",
  },
  {
    id: "lease-3",
    room: "B-202",
    tenant: "Reza Pratama",
    startDate: "2025-11-01",
    endDate: "2026-11-01",
    daysRemaining: 25,
    monthlyRent: 3500000,
    deposit: 3500000,
    dueDay: 5,
    status: "ACTIVE",
  },
  {
    id: "lease-4",
    room: "A-101",
    tenant: "Budi Santoso",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    daysRemaining: 85,
    monthlyRent: 1500000,
    deposit: 1500000,
    dueDay: 10,
    status: "ACTIVE",
  },
]

export default function LeasesPage() {
  const [search, setSearch] = React.useState("")

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)

  const filtered = leases.filter(
    (l) =>
      l.tenant.toLowerCase().includes(search.toLowerCase()) ||
      l.room.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lease Agreements</h1>
          <p className="text-sm text-muted-foreground">
            Track rental contracts, security deposits, and renewal pipelines
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>New Lease Contract</span>
        </Button>
      </div>

      {/* Automated Expiration Alerts Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Upcoming Renewals Requiring Action
            </h3>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              2 leases are expiring in the next 14 days. Renewal reminders have been scheduled to
              dispatch automatically via WhatsApp & in-app notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by tenant name or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Leases Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Room & Tenant</th>
                  <th className="px-6 py-4">Contract Period</th>
                  <th className="px-6 py-4">Rent / Mo</th>
                  <th className="px-6 py-4">Deposit</th>
                  <th className="px-6 py-4">Due Day</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((lease) => (
                  <tr key={lease.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{lease.room}</div>
                      <div className="text-xs text-muted-foreground">{lease.tenant}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar size={13} />
                        <span>{lease.startDate} &rarr; {lease.endDate}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium">
                        {lease.daysRemaining <= 14 ? (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            Expires in {lease.daysRemaining} days!
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{lease.daysRemaining} days remaining</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatIDR(lease.monthlyRent)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatIDR(lease.deposit)}</td>
                    <td className="px-6 py-4">Every {lease.dueDay}th</td>
                    <td className="px-6 py-4">
                      {lease.status === "EXPIRING_SOON" ? (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Renew
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
