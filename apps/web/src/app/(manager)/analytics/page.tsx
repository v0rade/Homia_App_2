'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Percent, Building2, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const monthlyRevenue = [
  { month: 'Jan', revenue: 35000000, mrr: 34000000 },
  { month: 'Feb', revenue: 38000000, mrr: 36000000 },
  { month: 'Mar', revenue: 36000000, mrr: 36500000 },
  { month: 'Apr', revenue: 40000000, mrr: 38000000 },
  { month: 'May', revenue: 42000000, mrr: 40000000 },
  { month: 'Jun', revenue: 39000000, mrr: 40500000 },
  { month: 'Jul', revenue: 45000000, mrr: 42000000 },
  { month: 'Aug', revenue: 47000000, mrr: 44000000 },
  { month: 'Sep', revenue: 48000000, mrr: 46000000 },
  { month: 'Oct', revenue: 51000000, mrr: 48000000 },
];

const revenueByProperty = [
  { property: 'Menteng', revenue: 32000000, rooms: 24 },
  { property: 'Kemang', revenue: 19000000, rooms: 24 },
];

const paymentStatus = [
  { name: 'Paid', value: 34, color: '#22c55e' },
  { name: 'Pending', value: 8, color: '#f59e0b' },
  { name: 'Overdue', value: 4, color: '#ef4444' },
  { name: 'Partial', value: 2, color: '#f97316' },
];

const maintenanceByCategory = [
  { category: 'AC', count: 12, cost: 3500000 },
  { category: 'Plumbing', count: 8, cost: 1200000 },
  { category: 'Electrical', count: 6, cost: 2100000 },
  { category: 'Internet', count: 5, cost: 500000 },
  { category: 'Door/Lock', count: 4, cost: 800000 },
  { category: 'Other', count: 9, cost: 1500000 },
];

const occupancyTrend = [
  { month: 'Jan', rate: 72 }, { month: 'Feb', rate: 75 }, { month: 'Mar', rate: 70 },
  { month: 'Apr', rate: 78 }, { month: 'May', rate: 80 }, { month: 'Jun', rate: 77 },
  { month: 'Jul', rate: 82 }, { month: 'Aug', rate: 85 }, { month: 'Sep', rate: 83 },
  { month: 'Oct', rate: 86 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v: number) => `Rp ${(v / 1_000_000).toFixed(0)}M`;
const fmtFull = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

function KpiCard({ label, value, sub, positive, icon: Icon }: {
  label: string; value: string; sub: string; positive?: boolean; icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
            <p className={`mt-1 text-xs ${positive ? 'text-green-600' : 'text-muted-foreground'}`}>{sub}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg text-sm">
      <p className="mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((s, r) => s + r.revenue, 0);
  const collectionRate = Math.round((34 / 48) * 100);
  const avgResolution = '2.4 days';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Analytics</h1>
        <p className="text-sm text-muted-foreground">Performance insights across all properties</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue (YTD)"
          value={fmt(totalRevenue)}
          sub={`+18.4% vs last year`}
          positive
          icon={DollarSign}
        />
        <KpiCard
          label="Monthly Recurring Revenue"
          value="Rp 48M"
          sub="MRR growing steadily"
          positive
          icon={TrendingUp}
        />
        <KpiCard
          label="Collection Rate"
          value={`${collectionRate}%`}
          sub="4 invoices outstanding"
          icon={Percent}
        />
        <KpiCard
          label="Outstanding Balance"
          value="Rp 5.4M"
          sub="6 late payments this month"
          icon={TrendingDown}
        />
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4 pt-2">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue vs MRR (Jan–Oct 2026)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip formatter={fmtFull} />} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#rev)" name="Revenue" />
                    <Area type="monotone" dataKey="mrr" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="5 3" fill="none" name="MRR" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Property</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueByProperty} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                    <XAxis type="number" tickFormatter={fmt} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="property" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={60} />
                    <Tooltip content={<CustomTooltip formatter={fmtFull} />} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2 text-sm">
                  {revenueByProperty.map((p) => (
                    <div key={p.property} className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{p.property}</span>
                      </div>
                      <span className="font-semibold">{fmt(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Occupancy Tab */}
        <TabsContent value="occupancy" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate Trend</CardTitle>
              <CardDescription>Monthly occupancy rate (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={occupancyTrend}>
                  <defs>
                    <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[60, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip formatter={(v: number) => `${v}%`} />} />
                  <Area type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} fill="url(#occ)" name="Occupancy" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4 pt-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Status Breakdown</CardTitle>
                <CardDescription>Current month distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={paymentStatus} cx="50%" cy="50%" outerRadius={100} paddingAngle={3} dataKey="value">
                      {paymentStatus.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Legend formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
                    <Tooltip formatter={(v: any) => [`${v} invoices`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentStatus.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{p.name}</span>
                      <span className="font-medium">{p.value} invoices ({Math.round(p.value / 48 * 100)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${(p.value / 48) * 100}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-4 pt-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Issues by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={maintenanceByCategory}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Tickets" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost by Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Wrench className="h-4 w-4" />
                  <span>Avg resolution: <strong className="text-foreground">{avgResolution}</strong></span>
                </div>
                {maintenanceByCategory.sort((a, b) => b.cost - a.cost).map((c) => (
                  <div key={c.category} className="flex items-center justify-between text-sm">
                    <span>{c.category}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-24 rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-amber-400"
                          style={{ width: `${(c.cost / 3500000) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-right font-medium">{fmtFull(c.cost)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
