import { redirect } from "next/navigation"

export default function HomePage() {
  // Mock redirect to dashboard, in real app check auth state
  redirect("/dashboard")
}
