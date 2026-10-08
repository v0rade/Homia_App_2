"use client"

import * as React from "react"
import {
  User,
  Phone,
  Mail,
  Shield,
  FileText,
  AlertTriangle,
  Upload,
  Calendar,
  CreditCard,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function TenantProfilePage() {
  const [profile, setProfile] = React.useState({
    fullName: "Andi Saputra",
    email: "andi.saputra@example.com",
    phone: "081234567892",
    dateOfBirth: "1998-05-14",
    idType: "KTP",
    idNumber: "3171021405980003",
    room: "A-203",
    checkInDate: "2025-10-15",
    emergencyContact: "Dewi Lestari (Ibu)",
    emergencyPhone: "081198765432",
    idDocumentUploaded: true,
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tenant Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal verification details, ID documents, and emergency contacts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-3xl">
              AS
            </div>
            <CardTitle className="mt-3 text-xl">{profile.fullName}</CardTitle>
            <CardDescription className="text-xs">{profile.email}</CardDescription>
            <div className="pt-2">
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                Verified Tenant
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 border-t text-sm space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Occupied Room</span>
              <span className="font-bold text-foreground">Room {profile.room}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Check-in Date</span>
              <span className="font-medium text-foreground">{profile.checkInDate}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">ID Verification</span>
              <span className="flex items-center gap-1 text-green-600 font-medium">
                <CheckCircle2 size={13} /> Complete
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details & Form */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
              <CardDescription className="text-xs">
                Your legal identity recorded on the lease agreement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Full Legal Name
                  </label>
                  <Input defaultValue={profile.fullName} className="mt-1" readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Email Address
                  </label>
                  <Input defaultValue={profile.email} className="mt-1" readOnly />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    WhatsApp Phone Number
                  </label>
                  <Input defaultValue={profile.phone} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Date of Birth
                  </label>
                  <Input defaultValue={profile.dateOfBirth} type="date" className="mt-1" />
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      ID Document Type
                    </label>
                    <Input defaultValue={profile.idType} className="mt-1" readOnly />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      ID / KTP Number
                    </label>
                    <Input defaultValue={profile.idNumber} className="mt-1" readOnly />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Contact person to notify in case of medical emergencies or urgent building repairs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Contact Name & Relationship
                  </label>
                  <Input defaultValue={profile.emergencyContact} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Emergency Phone Number
                  </label>
                  <Input defaultValue={profile.emergencyPhone} className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm">Save Profile Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
