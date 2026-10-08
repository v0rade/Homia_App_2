import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

const invoices = [
  { id: "INV-2026-10-01", tenant: "Budi Santoso", room: "A201", amount: 1550000, status: "PENDING", dueDate: "2026-10-10" },
  { id: "INV-2026-10-02", tenant: "Siti Aminah", room: "A204", amount: 1750000, status: "OVERDUE", dueDate: "2026-10-01" },
  { id: "INV-2026-10-03", tenant: "Joko Anwar", room: "B101", amount: 2000000, status: "PAID", dueDate: "2026-10-15" },
]

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage and generate tenant invoices.</p>
        </div>
        <Button>Generate Monthly Invoices</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {inv.id}
                  </TableCell>
                  <TableCell>
                    {inv.tenant}
                    <div className="text-xs text-muted-foreground">Room {inv.room}</div>
                  </TableCell>
                  <TableCell className="font-medium">Rp {inv.amount.toLocaleString()}</TableCell>
                  <TableCell>{inv.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                      inv.status === 'PAID' ? 'success' :
                      inv.status === 'OVERDUE' ? 'destructive' : 'warning'
                    } className="text-[10px]">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
