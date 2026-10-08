"use client"

import * as React from "react"
import { Bell, Plus, Users, Building, Layers, Home, Send, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockAnnouncements = [
  {
    id: "ann-1",
    title: "Water Tank Maintenance Scheduled for Saturday",
    content: "Please be advised that the main water supply will be suspended on Saturday, 10 October from 09:00 to 13:00 for mandatory bi-annual pipe cleansing and tank disinfection. Please store adequate water beforehand.",
    targetType: "PROPERTY",
    targetValue: "Homia Stay Menteng",
    publishedAt: "2026-10-06 09:00",
    author: "Homia Management",
    isActive: true,
  },
  {
    id: "ann-2",
    title: "Fiber Optic High-Speed Internet Upgrade",
    content: "Routine fiber-optic router maintenance and DNS configuration upgrades will take place tonight at 23:00 WIB. Intermittent connectivity expected for approximately 30 minutes.",
    targetType: "ALL",
    targetValue: "All Tenants",
    publishedAt: "2026-10-05 14:30",
    author: "IT Support Team",
    isActive: true,
  },
  {
    id: "ann-3",
    title: "Quiet Hours Reminder (Floor 2)",
    content: "Friendly reminder that quiet hours start at 22:00. Please keep common corridor noise and television volume to a respectful minimum.",
    targetType: "FLOOR",
    targetValue: "Floor 2 Only",
    publishedAt: "2026-10-02 20:00",
    author: "Staff Ahmad",
    isActive: false,
  },
]

export default function AnnouncementsPage() {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [targetType, setTargetType] = React.useState("ALL")

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Broadcast emergency alerts, facility updates, and policies with granular audience targeting
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} />
          <span>New Announcement</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {mockAnnouncements.map((ann) => (
          <Card key={ann.id} className="transition-all hover:border-primary/30">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">{ann.title}</CardTitle>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {ann.publishedAt}
                    </span>
                    <span>&bull;</span>
                    <span>By {ann.author}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/40 bg-primary/5 text-primary">
                    Target: {ann.targetType} ({ann.targetValue})
                  </Badge>
                  {ann.isActive ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Expired</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {ann.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Announcement Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Broadcast Announcement</DialogTitle>
            <DialogDescription>
              Deliver real-time push alerts and dashboard notices to tenants.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Title / Subject
              </label>
              <Input
                placeholder="e.g. Water tank maintenance scheduled..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Target Audience
              </label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              >
                <option value="ALL">All Tenants (Platform-wide)</option>
                <option value="PROPERTY">Specific Property (Homia Stay Menteng)</option>
                <option value="FLOOR">Specific Floor (e.g. Floor 2)</option>
                <option value="ROOM">Specific Room (Single unit)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Announcement Message
              </label>
              <Textarea
                placeholder="Enter detailed instructions, times, and contact information..."
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert("Announcement published successfully!")
                setModalOpen(false)
              }}
              className="gap-2"
            >
              <Send size={15} />
              <span>Publish Now</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
