import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

const bills = [
  { id: "INV-2026-10", month: "October 2026", total: 1550000, status: "UNPAID", due: "2026-10-10", items: [
    { name: "Room Rent", amount: 1500000 },
    { name: "Electricity", amount: 50000 }
  ]},
  { id: "INV-2026-09", month: "September 2026", total: 1540000, status: "PAID", due: "2026-09-10", items: [
    { name: "Room Rent", amount: 1500000 },
    { name: "Electricity", amount: 40000 }
  ]}
]

export default function TenantBillingPage() {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Invoices</h1>
        <p className="text-muted-foreground text-sm">View your invoices and payment history.</p>
      </div>

      <div className="space-y-4">
        {bills.map((bill) => (
          <Card key={bill.id} className={bill.status === "UNPAID" ? "border-primary" : ""}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{bill.month}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Due: {bill.due}</p>
              </div>
              <Badge variant={bill.status === "PAID" ? "success" : "default"}>
                {bill.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {bill.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">Rp {item.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-2 border-t flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {bill.total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {bill.status === "UNPAID" && (
                  <Button className="flex-1">Pay Now</Button>
                )}
                <Button variant="outline" className={bill.status === "PAID" ? "w-full" : "w-auto"}>
                  <Download className="mr-2 h-4 w-4" /> 
                  {bill.status === "PAID" ? "Download Receipt" : "PDF"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
