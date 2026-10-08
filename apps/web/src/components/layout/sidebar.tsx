import Link from "next/link"
import { LayoutDashboard, Home, Users, Building, FileText, CreditCard, Wrench, BarChart, Settings, LogOut } from "lucide-react"

const mainNav = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Properties", href: "/properties", icon: Building },
  { title: "Rooms", href: "/rooms", icon: Home },
  { title: "Tenants", href: "/tenants", icon: Users },
]

const opsNav = [
  { title: "Leases", href: "/leases", icon: FileText },
  { title: "Invoices", href: "/invoices", icon: FileText },
  { title: "Payments", href: "/payments", icon: CreditCard },
  { title: "Maintenance", href: "/maintenance", icon: Wrench },
]

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Home size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight">Homia OS</span>
      </div>
      
      <div className="flex-1 space-y-6 overflow-auto">
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Main</h4>
          <nav className="space-y-1">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted text-foreground">
                <item.icon size={18} className="text-muted-foreground" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Operations</h4>
          <nav className="space-y-1">
            {opsNav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted text-foreground">
                <item.icon size={18} className="text-muted-foreground" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">System</h4>
          <nav className="space-y-1">
            <Link href="/analytics" className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted text-foreground">
              <BarChart size={18} className="text-muted-foreground" />
              Analytics
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium hover:bg-muted text-foreground">
              <Settings size={18} className="text-muted-foreground" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t">
        <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50">
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  )
}
