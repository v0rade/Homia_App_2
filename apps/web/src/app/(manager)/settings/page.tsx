"use client"

import * as React from "react"
import { Key, Lock, Plus, RefreshCw, Shield, Trash2, CheckCircle2, Clock, Smartphone, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AccessCode {
  id: string
  room: string
  code: string
  description: string
  validFrom: string
  validUntil: string
  isActive: boolean
  usageCount: number
  maxUsage: number | null
}

const initialCodes: AccessCode[] = [
  {
    id: "ac-1",
    room: "A-203",
    code: "839241",
    description: "Temporary Cleaner Access",
    validFrom: "2026-10-07 14:00",
    validUntil: "2026-10-07 18:00",
    isActive: true,
    usageCount: 1,
    maxUsage: 3,
  },
  {
    id: "ac-2",
    room: "A-102",
    code: "194820",
    description: "Prospective Tenant Viewing",
    validFrom: "2026-10-07 10:00",
    validUntil: "2026-10-07 12:00",
    isActive: false,
    usageCount: 1,
    maxUsage: 1,
  },
  {
    id: "ac-3",
    room: "B-105",
    code: "552019",
    description: "AC Technician Emergency Repair",
    validFrom: "2026-10-06 09:00",
    validUntil: "2026-10-06 17:00",
    isActive: false,
    usageCount: 2,
    maxUsage: 5,
  },
]

export default function SettingsPage() {
  const [codes, setCodes] = React.useState<AccessCode[]>(initialCodes)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [newRoom, setNewRoom] = React.useState("A-203")
  const [newDesc, setNewDesc] = React.useState("")
  const [validHours, setValidHours] = React.useState("4")
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null)

  const handleGenerate = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString()
    const now = new Date()
    const expiry = new Date(now.getTime() + parseInt(validHours) * 60 * 60 * 1000)

    const newEntry: AccessCode = {
      id: `ac-${Date.now()}`,
      room: newRoom,
      code: randomPin,
      description: newDesc || "Temporary Smart Access",
      validFrom: now.toISOString().replace("T", " ").slice(0, 16),
      validUntil: expiry.toISOString().replace("T", " ").slice(0, 16),
      isActive: true,
      usageCount: 0,
      maxUsage: 5,
    }

    setCodes([newEntry, ...codes])
    setGeneratedCode(randomPin)
  }

  const handleRevoke = (id: string) => {
    setCodes(codes.map((c) => (c.id === id ? { ...c, isActive: false } : c)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings & Integrations</h1>
        <p className="text-sm text-muted-foreground">
          Manage Smart Lock access codes, payment gateway credentials, and platform preferences
        </p>
      </div>

      <Tabs defaultValue="smart-lock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="smart-lock">Smart Lock Simulation (IoT)</TabsTrigger>
          <TabsTrigger value="billing">Billing & Gateway Config</TabsTrigger>
          <TabsTrigger value="notifications">Automations & WhatsApp</TabsTrigger>
        </TabsList>

        {/* TAB 1: Smart Lock Simulation */}
        <TabsContent value="smart-lock" className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <span>Smart Lock Access Code Generator</span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Issue time-bound temporary PIN codes for tenants, maintenance technicians, and visitors
              </p>
            </div>
            <Button onClick={() => { setGeneratedCode(null); setModalOpen(true); }} className="gap-2">
              <Key size={16} />
              <span>Generate Temporary Code</span>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {codes.map((c) => (
              <Card key={c.id} className={`transition-all ${c.isActive ? 'border-primary/40 shadow-sm' : 'opacity-70'}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base">Room {c.room}</span>
                      {c.isActive ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Expired / Revoked</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs">{c.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                    <span className="text-xs text-muted-foreground">Access PIN</span>
                    <span className="font-mono text-xl font-bold tracking-widest text-primary">{c.code}</span>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Valid From:</span>
                      <span className="font-medium text-foreground">{c.validFrom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className="font-medium text-foreground">{c.validUntil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage:</span>
                      <span>{c.usageCount} / {c.maxUsage ?? "∞"} times</span>
                    </div>
                  </div>

                  {c.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevoke(c.id)}
                      className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                    >
                      <Trash2 size={14} className="mr-1.5" />
                      Revoke Access
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: Billing Config */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Abstraction Layer</CardTitle>
              <CardDescription>
                Configure upstream payment processors (Midtrans, Xendit, Stripe) without modifying core ledger logic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Active Gateway Provider</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="MANUAL">Manual Verification & Proof Upload (Active)</option>
                    <option value="MIDTRANS">Midtrans Snap (Indonesia)</option>
                    <option value="XENDIT">Xendit Invoice</option>
                    <option value="STRIPE">Stripe Checkout</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Default Currency</label>
                  <Input defaultValue="IDR (Rp)" disabled />
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Automated Late Fee Calculation</p>
                    <p className="text-xs text-muted-foreground">Apply Rp 25.000 / day penalty after due date threshold</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Automations */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Job Schedulers (BullMQ / Cron)</CardTitle>
              <CardDescription>
                Configure monthly rent dispatchers and automated WhatsApp reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-semibold">Monthly Invoice Generation Engine</p>
                  <p className="text-xs text-muted-foreground">Executes on 1st of every month at 08:00 WIB (Cron: 0 8 1 * *)</p>
                </div>
                <Badge variant="outline" className="border-green-400 bg-green-50 text-green-700">Healthy (BullMQ Active)</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="text-sm font-semibold">WhatsApp Auto-Reminder Deep-links</p>
                  <p className="text-xs text-muted-foreground">Generates personalized billing notices for pending and overdue leases</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Code Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Smart Lock Temporary PIN</DialogTitle>
            <DialogDescription>
              Generates a secure 6-digit access code for physical IoT door lock integration.
            </DialogDescription>
          </DialogHeader>

          {!generatedCode ? (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Select Room</label>
                <select
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  <option value="A-101">Room A-101 (Floor 1)</option>
                  <option value="A-203">Room A-203 (Floor 2)</option>
                  <option value="B-105">Room B-105 (Floor 1)</option>
                  <option value="B-202">Room B-202 (Floor 2)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Purpose / Note</label>
                <Input
                  placeholder="e.g. AC Technician / Cleaning / Viewing"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Validity Duration</label>
                <select
                  value={validHours}
                  onChange={(e) => setValidHours(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                >
                  <option value="2">2 Hours</option>
                  <option value="4">4 Hours</option>
                  <option value="8">8 Hours (Full Day Shift)</option>
                  <option value="24">24 Hours (1 Day)</option>
                </select>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button onClick={handleGenerate} className="gap-2">
                  <Key size={15} />
                  <span>Generate Code</span>
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Access PIN for Room {newRoom}</p>
                <p className="mt-2 font-mono text-4xl font-bold tracking-widest text-primary">{generatedCode}</p>
                <p className="mt-2 text-xs text-muted-foreground">Valid for {validHours} hours starting now.</p>
              </div>
              <Button onClick={() => setModalOpen(false)} className="w-full">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
