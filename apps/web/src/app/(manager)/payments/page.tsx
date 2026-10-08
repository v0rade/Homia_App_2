import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

const verifications = [
  { id: "PAY-9921", tenant: "Budi Santoso", amount: 1550000, date: "2026-10-05", method: "Bank Transfer" },
]

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Verify and process tenant payments.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pending Verification</h3>
        {verifications.length === 0 ? (
          <p className="text-muted-foreground">No payments pending verification.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {verifications.map((pay) => (
              <Card key={pay.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{pay.tenant}</CardTitle>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden group">
                    <span className="text-xs text-muted-foreground">Proof of Payment</span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="text-white text-sm font-medium">View Full</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Amount</div>
                    <div className="font-medium text-right">Rp {pay.amount.toLocaleString()}</div>
                    <div className="text-muted-foreground">Method</div>
                    <div className="font-medium text-right">{pay.method}</div>
                    <div className="text-muted-foreground">Date</div>
                    <div className="font-medium text-right">{pay.date}</div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <Check className="mr-2 h-4 w-4" /> Verify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
