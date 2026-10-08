"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, FileDown } from "lucide-react"

const tenants = [
  { id: "T-001", name: "Budi Santoso", room: "A201", status: "ACTIVE", checkIn: "2023-01-15", rent: 1500000 },
  { id: "T-002", name: "Siti Aminah", room: "A204", status: "WARNING", checkIn: "2023-05-01", rent: 1750000 },
  { id: "T-003", name: "Joko Anwar", room: "B101", status: "ACTIVE", checkIn: "2023-11-20", rent: 2000000 },
  { id: "T-004", name: "Dewi Lestari", room: "C305", status: "ENDING_SOON", checkIn: "2022-10-10", rent: 1800000 },
]

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">Manage your residents and their leases.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><FileDown className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button>+ Add Tenant</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tenants..." className="pl-8" />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in Date</TableHead>
            <TableHead className="text-right">Rent/Month</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id} className="cursor-pointer">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {tenant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    {tenant.name}
                    <div className="text-xs text-muted-foreground">{tenant.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{tenant.room}</TableCell>
              <TableCell>
                <Badge variant={
                  tenant.status === 'ACTIVE' ? 'success' :
                  tenant.status === 'WARNING' ? 'destructive' :
                  'warning'
                } className="text-[10px]">
                  {tenant.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{tenant.checkIn}</TableCell>
              <TableCell className="text-right font-medium">Rp {tenant.rent.toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
