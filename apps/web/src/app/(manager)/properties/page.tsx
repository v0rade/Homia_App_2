"use client"

import * as React from "react"
import { Building2, MapPin, Users, Home, Plus, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const properties = [
  {
    id: "prop-1",
    name: "Homia Stay Menteng",
    address: "Jl. Teuku Umar No. 14, Menteng, Jakarta Pusat",
    type: "BOARDING_HOUSE",
    totalFloors: 3,
    totalRooms: 24,
    occupiedRooms: 20,
    occupancyRate: "83%",
    monthlyRevenue: 34500000,
    amenities: ["High-speed WiFi", "24/7 CCTV", "Access Card", "Shared Kitchen", "Free Parking"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "prop-2",
    name: "Homia Stay Kemang",
    address: "Jl. Kemang Raya No. 88, Bangka, Jakarta Selatan",
    type: "BOARDING_HOUSE",
    totalFloors: 4,
    totalRooms: 24,
    occupiedRooms: 18,
    occupancyRate: "75%",
    monthlyRevenue: 28200000,
    amenities: ["Swimming Pool", "Rooftop Lounge", "Smart Lock", "Laundry Service"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
  },
]

export default function PropertiesPage() {
  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-sm text-muted-foreground">
            Manage your boarding houses, apartments, and buildings
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          <span>Add Property</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {properties.map((prop) => (
          <Card key={prop.id} className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative h-48 w-full bg-muted">
              {/* Image banner */}
              <img
                src={prop.image}
                alt={prop.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute right-3 top-3">
                <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                  {prop.type.replace("_", " ")}
                </Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{prop.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                    <MapPin size={14} className="text-muted-foreground" />
                    <span>{prop.address}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Total Rooms</p>
                  <p className="text-lg font-bold">{prop.totalRooms}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Occupancy</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {prop.occupancyRate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue/mo</p>
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatIDR(prop.monthlyRevenue)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Building Amenities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {prop.amenities.map((a) => (
                    <span
                      key={a}
                      className="rounded-md border bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t text-sm">
                <span className="text-xs text-muted-foreground">{prop.totalFloors} Floors Total</span>
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  <span>Manage Units</span>
                  <ArrowUpRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
