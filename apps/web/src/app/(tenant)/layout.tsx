import { Bell, Home, Wrench, FileText, User } from "lucide-react"
import Link from "next/link"

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-card px-6 py-3 md:hidden z-50">
        <div className="flex justify-between items-center">
          <Link href="/tenant/dashboard" className="flex flex-col items-center text-primary">
            <Home size={20} />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link href="/tenant/billing" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <FileText size={20} />
            <span className="text-[10px] mt-1 font-medium">Bills</span>
          </Link>
          <Link href="/tenant/maintenance" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <Wrench size={20} />
            <span className="text-[10px] mt-1 font-medium">Fixes</span>
          </Link>
          <Link href="/tenant/profile" className="flex flex-col items-center text-muted-foreground hover:text-primary">
            <User size={20} />
            <span className="text-[10px] mt-1 font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}
