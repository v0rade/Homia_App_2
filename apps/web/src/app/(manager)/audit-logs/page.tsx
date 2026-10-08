"use client"

import * as React from "react"
import { ShieldAlert, Search, Filter, Clock, User, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { exportToCSV } from "@/lib/export"

const auditLogs = [
  {
    id: "log-1",
    user: "Super Admin (admin@homia-os.com)",
    role: "SUPER_ADMIN",
    action: "VERIFY_PAYMENT",
    entity: "Payment",
    entityId: "PAY-2026-10-0021",
    details: "Approved payment #INV-10291 for Room A-203 (Rp 1.800.000)",
    ipAddress: "182.253.14.88",
    timestamp: "2026-10-07 13:14:22",
  },
  {
    id: "log-2",
    user: "Ahmad Staff (staff1@homia-os.com)",
    role: "STAFF",
    action: "UPDATE_STATUS",
    entity: "Room",
    entityId: "ROOM-A202",
    details: "Changed Room A-202 status from AVAILABLE to MAINTENANCE",
    ipAddress: "182.253.14.90",
    timestamp: "2026-10-07 11:28:10",
  },
  {
    id: "log-3",
    user: "Budi Owner (owner1@homia-os.com)",
    role: "PROPERTY_OWNER",
    action: "EXECUTE_JOB",
    entity: "BillingJob",
    entityId: "JOB-2026-10",
    details: "Owner executed monthly automated rent generation job for 48 units",
    ipAddress: "114.122.56.23",
    timestamp: "2026-10-07 08:00:00",
  },
  {
    id: "log-4",
    user: "Super Admin (admin@homia-os.com)",
    role: "SUPER_ADMIN",
    action: "GENERATE_CODE",
    entity: "AccessCode",
    entityId: "AC-9812",
    details: "Created temporary smart lock code 839241 for Room A-203",
    ipAddress: "182.253.14.88",
    timestamp: "2026-10-06 17:40:15",
  },
  {
    id: "log-5",
    user: "Ahmad Staff (staff1@homia-os.com)",
    role: "STAFF",
    action: "CREATE_TENANT",
    entity: "Tenant",
    entityId: "TNT-094",
    details: "Registered new tenant profile for Andi Saputra",
    ipAddress: "182.253.14.90",
    timestamp: "2026-10-06 14:10:05",
  },
]

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState("")

  const filtered = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
  )

  const handleExport = () => {
    exportToCSV(filtered, "Homia_Audit_Logs", [
      { header: "Timestamp", key: "timestamp" },
      { header: "User", key: "user" },
      { header: "Role", key: "role" },
      { header: "Action", key: "action" },
      { header: "Entity", key: "entity" },
      { header: "Entity ID", key: "entityId" },
      { header: "Details", key: "details" },
      { header: "IP Address", key: "ipAddress" },
    ])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail & Security</h1>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Immutable Log
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete cryptographic audit trail of administrative modifications, payments, and access actions
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by action, user email, entity, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Timestamp & IP</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <Clock size={12} className="text-muted-foreground" />
                        <span>{log.timestamp}</span>
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {log.ipAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.user}</div>
                      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {log.entity} #{log.entityId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {log.details}
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
