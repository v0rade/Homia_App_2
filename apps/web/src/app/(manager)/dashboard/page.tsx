'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Building2,
  Home,
  Users,
  TrendingUp,
  AlertTriangle,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─── Mock data (replace with TanStack Query hooks in production) ────────────
const revenueData = [
  { month: 'May', revenue: 38000000, target: 40000000 },
  { month: 'Jun', revenue: 42000000, target: 40000000 },
  { month: 'Jul', revenue: 39000000, target: 42000000 },
  { month: 'Aug', revenue: 45000000, target: 42000000 },
  { month: 'Sep', revenue: 48000000, target: 45000000 },
  { month: 'Oct', revenue: 51000000, target: 48000000 },
];

const occupancyData = [
  { name: 'Occupied', value: 38, color: '#3b82f6' },
  { name: 'Available', value: 7, color: '#22c55e' },
  { name: 'Maintenance', value: 2, color: '#f59e0b' },
  { name: 'Reserved', value: 1, color: '#8b5cf6' },
];

const overduePayments = [
  { tenant: 'Andi Saputra', room: 'A-203', amount: 1800000, daysOverdue: 12 },
  { tenant: 'Siti Rahayu', room: 'B-105', amount: 2100000, daysOverdue: 7 },
  { tenant: 'Budi Hartono', room: 'A-301', amount: 1500000, daysOverdue: 3 },
];

const urgentTickets = [
  { id: 'TKT-001', title: 'AC Unit Not Working', room: 'A-203', priority: 'URGENT', openFor: '3h 42m' },
  { id: 'TKT-002', title: 'Water Leak in Bathroom', room: 'B-105', priority: 'HIGH', openFor: '1d 2h' },
  { id: 'TKT-003', title: 'Door Lock Broken', room: 'C-201', priority: 'HIGH', openFor: '5h 15m' },
];

const expiringLeases = [
  { tenant: 'Dian Permata', room: 'A-104', expiresIn: 7 },
  { tenant: 'Reza Pratama', room: 'B-202', expiresIn: 14 },
  { tenant: 'Novi Anggraini', room: 'C-103', expiresIn: 28 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const formatCurrency = (v: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

const formatCurrencyShort = (v: number) => {
  if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)}M`;
  if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}K`;
  return formatCurrency(v);
};

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: number;
  variant?: 'default' | 'danger' | 'warning';
}

function StatCard({ title, value, description, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const iconColors = {
    default: 'text-primary bg-primary/10',
    danger: 'text-red-500 bg-red-50 dark:bg-red-950',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  };
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`rounded-lg p-2 ${iconColors[variant]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          {trend !== undefined && (
            trend >= 0
              ? <ArrowUpRight className="h-3 w-3 text-green-500" />
              : <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <p className="mb-1 text-sm font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name === 'revenue' ? 'Revenue' : 'Target'}: {formatCurrencyShort(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    URGENT: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[priority] ?? ''}`}>
      {priority}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Wednesday, 7 October 2026 · Homia Stay Menteng
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Properties"
          value="2"
          description="+1 property this year"
          icon={Building2}
          trend={1}
        />
        <StatCard
          title="Total Rooms"
          value="48"
          description="Across all properties"
          icon={Home}
        />
        <StatCard
          title="Occupied Rooms"
          value="38"
          description="79% occupancy rate"
          icon={Users}
          trend={4}
        />
        <StatCard
          title="Monthly Revenue"
          value="Rp 51M"
          description="+6.3% from last month"
          icon={TrendingUp}
          trend={6}
        />
        <StatCard
          title="Outstanding Balance"
          value="Rp 5.4M"
          description="3 tenants overdue"
          icon={AlertTriangle}
          variant="danger"
          trend={-1}
        />
        <StatCard
          title="Open Tickets"
          value="8"
          description="2 urgent, 3 high priority"
          icon={Wrench}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue vs. target (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis
                  tickFormatter={formatCurrencyShort}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#8b5cf6"
                  strokeWidth={1.5}
                  strokeDasharray="5 3"
                  fill="url(#colorTarget)"
                  name="target"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  name="revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Pie Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Occupancy Breakdown</CardTitle>
            <CardDescription>Room status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {occupancyData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {occupancyData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} rooms</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Overdue Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overduePayments.map((p) => (
              <div
                key={p.tenant}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/50 p-3 dark:border-red-900 dark:bg-red-950/20"
              >
                <div>
                  <p className="text-sm font-medium">{p.tenant}</p>
                  <p className="text-xs text-muted-foreground">Room {p.room} · {p.daysOverdue}d overdue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrencyShort(p.amount)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urgent Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4 text-amber-500" />
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {urgentTickets.map((t) => (
              <div key={t.id} className="space-y-1 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{t.title}</p>
                  <PriorityBadge priority={t.priority} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Room {t.room}</span>
                  <span>·</span>
                  <Clock className="h-3 w-3" />
                  <span>{t.openFor}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Expiring Leases */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-blue-500" />
              Expiring Leases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expiringLeases.map((l) => (
              <div key={l.tenant} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{l.tenant}</p>
                  <p className="text-xs text-muted-foreground">Room {l.room}</p>
                </div>
                <Badge
                  variant={l.expiresIn <= 7 ? 'destructive' : l.expiresIn <= 14 ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {l.expiresIn}d left
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
