"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Home,
  Users,
  FileText,
  CreditCard,
  Wrench,
  BarChart3,
  Search,
  Bell,
  Settings,
  ShieldAlert,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-input bg-background/50 px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:w-64"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Quick Search (Ctrl + K)...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search properties, rooms, tenants..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/dashboard"))}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/rooms"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Room Grid & Floor Overview</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/tenants"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Tenant Management</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/invoices"))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Invoices & Automated Billing</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/payments"))}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Payment Verification Ledger</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/maintenance"))}
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>Maintenance Kanban Board</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/analytics"))}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Financial Analytics</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions & Operations">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/invoices?action=generate"))}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Generate Monthly Invoices (Job Engine)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/maintenance?action=new"))}
            >
              <Wrench className="mr-2 h-4 w-4" />
              <span>Create New Maintenance Ticket</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/audit-logs"))}
            >
              <ShieldAlert className="mr-2 h-4 w-4" />
              <span>Inspect Security & Audit Logs</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Rooms & Tenants">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/rooms?search=A-203"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Room A-203 (Occupied - Andi Saputra)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/rooms?search=B-105"))}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Room B-105 (Overdue - Siti Rahayu)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/tenants?search=Andi"))}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Tenant: Andi Saputra (081234567892)</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
