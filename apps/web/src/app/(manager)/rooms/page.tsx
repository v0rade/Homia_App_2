'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Grid3X3,
  List,
  Filter,
  User,
  Calendar,
  DollarSign,
  Wrench,
  ChevronRight,
  X,
  Phone,
  Mail,
  MapPin,
  Wifi,
  Wind,
  Droplets,
  Car,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// ─── Types ───────────────────────────────────────────────────────────────────
type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'OVERDUE';
type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL' | null;
type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'STUDIO';

interface RoomData {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  monthlyPrice: number;
  area: number;
  amenities: string[];
  tenant?: {
    name: string;
    email: string;
    phone: string;
    checkIn: string;
    leaseEnd: string;
    paymentStatus: PaymentStatus;
  };
  lastMaintenance?: string;
  maintenanceNote?: string;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────
const mockRooms: RoomData[] = [
  {
    id: '1', number: 'A-101', floor: 1, type: 'SINGLE', status: 'OCCUPIED', monthlyPrice: 1500000, area: 14,
    amenities: ['WiFi', 'AC', 'Hot Water'],
    tenant: { name: 'Budi Santoso', email: 'budi@email.com', phone: '081234567890', checkIn: '2026-01-15', leaseEnd: '2026-12-31', paymentStatus: 'PAID' },
  },
  {
    id: '2', number: 'A-102', floor: 1, type: 'SINGLE', status: 'AVAILABLE', monthlyPrice: 1500000, area: 14,
    amenities: ['WiFi', 'AC', 'Hot Water'],
  },
  {
    id: '3', number: 'A-103', floor: 1, type: 'DOUBLE', status: 'OCCUPIED', monthlyPrice: 2000000, area: 20,
    amenities: ['WiFi', 'AC', 'Hot Water', 'Parking'],
    tenant: { name: 'Siti Rahayu', email: 'siti@email.com', phone: '081234567891', checkIn: '2025-06-01', leaseEnd: '2025-12-31', paymentStatus: 'OVERDUE' },
  },
  {
    id: '4', number: 'A-104', floor: 1, type: 'STUDIO', status: 'RESERVED', monthlyPrice: 2500000, area: 25,
    amenities: ['WiFi', 'AC', 'Hot Water', 'Kitchen'],
  },
  {
    id: '5', number: 'A-201', floor: 2, type: 'SINGLE', status: 'OCCUPIED', monthlyPrice: 1600000, area: 14,
    amenities: ['WiFi', 'AC'],
    tenant: { name: 'Andi Saputra', email: 'andi@email.com', phone: '081234567892', checkIn: '2026-03-01', leaseEnd: '2027-03-01', paymentStatus: 'PENDING' },
  },
  {
    id: '6', number: 'A-202', floor: 2, type: 'SINGLE', status: 'MAINTENANCE', monthlyPrice: 1600000, area: 14,
    amenities: ['WiFi', 'AC'],
    maintenanceNote: 'AC repair in progress',
    lastMaintenance: '2026-10-05',
  },
  {
    id: '7', number: 'A-203', floor: 2, type: 'DOUBLE', status: 'OCCUPIED', monthlyPrice: 2100000, area: 20,
    amenities: ['WiFi', 'AC', 'Hot Water'],
    tenant: { name: 'Dian Permata', email: 'dian@email.com', phone: '081234567893', checkIn: '2025-10-01', leaseEnd: '2026-10-14', paymentStatus: 'PAID' },
  },
  {
    id: '8', number: 'A-204', floor: 2, type: 'SUITE', status: 'OCCUPIED', monthlyPrice: 3500000, area: 35,
    amenities: ['WiFi', 'AC', 'Hot Water', 'Parking', 'Kitchen'],
    tenant: { name: 'Reza Pratama', email: 'reza@email.com', phone: '081234567894', checkIn: '2025-04-01', leaseEnd: '2026-10-21', paymentStatus: 'PARTIAL' },
  },
  {
    id: '9', number: 'A-301', floor: 3, type: 'SINGLE', status: 'OVERDUE', monthlyPrice: 1700000, area: 14,
    amenities: ['WiFi', 'AC'],
    tenant: { name: 'Budi Hartono', email: 'hartono@email.com', phone: '081234567895', checkIn: '2025-01-01', leaseEnd: '2026-11-15', paymentStatus: 'OVERDUE' },
  },
  {
    id: '10', number: 'A-302', floor: 3, type: 'SINGLE', status: 'AVAILABLE', monthlyPrice: 1700000, area: 14,
    amenities: ['WiFi', 'AC', 'Hot Water'],
  },
  {
    id: '11', number: 'A-303', floor: 3, type: 'STUDIO', status: 'OCCUPIED', monthlyPrice: 2800000, area: 28,
    amenities: ['WiFi', 'AC', 'Hot Water', 'Kitchen'],
    tenant: { name: 'Novi Anggraini', email: 'novi@email.com', phone: '081234567896', checkIn: '2025-11-01', leaseEnd: '2026-11-01', paymentStatus: 'PAID' },
  },
  {
    id: '12', number: 'A-304', floor: 3, type: 'SUITE', status: 'AVAILABLE', monthlyPrice: 4000000, area: 40,
    amenities: ['WiFi', 'AC', 'Hot Water', 'Parking', 'Kitchen'],
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; border: string; dot: string; badge: string }> = {
  AVAILABLE:   { label: 'Available',   color: 'bg-green-50 dark:bg-green-950/30',   border: 'border-green-200 dark:border-green-800',   dot: 'bg-green-500', badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
  OCCUPIED:    { label: 'Occupied',    color: 'bg-blue-50 dark:bg-blue-950/30',     border: 'border-blue-200 dark:border-blue-800',     dot: 'bg-blue-500',  badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  RESERVED:    { label: 'Reserved',   color: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500',badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-amber-50 dark:bg-amber-950/30',   border: 'border-amber-200 dark:border-amber-800',   dot: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' },
  OVERDUE:     { label: 'Overdue',    color: 'bg-red-50 dark:bg-red-950/30',       border: 'border-red-200 dark:border-red-800',       dot: 'bg-red-500',   badge: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

const PAYMENT_BADGE: Record<string, string> = {
  PAID:    'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  OVERDUE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  PARTIAL: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi, AC: Wind, 'Hot Water': Droplets, Parking: Car,
};

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function daysUntil(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  if (diff === 0) return 'Today';
  return `${diff}d`;
}

// ─── Room Card (Grid View) ────────────────────────────────────────────────────
function RoomCard({ room, onClick }: { room: RoomData; onClick: () => void }) {
  const cfg = STATUS_CONFIG[room.status];
  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-xl border-2 ${cfg.border} ${cfg.color} p-4 text-left transition-all hover:shadow-md hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary/50`}
    >
      {/* Status dot */}
      <span className={`absolute right-3 top-3 h-2.5 w-2.5 rounded-full ${cfg.dot}`} />

      {/* Room number + type */}
      <div className="mb-3">
        <div className="text-lg font-bold tracking-tight">{room.number}</div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          Floor {room.floor} · {room.type}
        </div>
      </div>

      {/* Tenant info or status */}
      {room.status === 'OCCUPIED' && room.tenant ? (
        <div className="mb-3 space-y-1">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            {room.tenant.name}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Lease ends: {daysUntil(room.tenant.leaseEnd)}
          </div>
        </div>
      ) : room.status === 'MAINTENANCE' ? (
        <div className="mb-3 text-xs text-muted-foreground">
          <Wrench className="mb-0.5 mr-1 inline h-3 w-3" />
          {room.maintenanceNote}
        </div>
      ) : (
        <div className="mb-3 h-9" />
      )}

      {/* Price + payment status */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            {formatPrice(room.monthlyPrice)}
          </div>
          <div className="text-[10px] text-muted-foreground">/month · {room.area}m²</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.badge}`}>
            {cfg.label}
          </span>
          {room.tenant?.paymentStatus && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${PAYMENT_BADGE[room.tenant.paymentStatus]}`}>
              {room.tenant.paymentStatus}
            </span>
          )}
        </div>
      </div>

      {/* Hover arrow */}
      <ChevronRight className="absolute bottom-3 right-3 h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}

// ─── Room List Row ─────────────────────────────────────────────────────────────
function RoomListRow({ room, onClick }: { room: RoomData; onClick: () => void }) {
  const cfg = STATUS_CONFIG[room.status];
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
    >
      <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${cfg.dot}`} />
      <div className="w-20 font-semibold">{room.number}</div>
      <div className="w-16 text-sm text-muted-foreground">Floor {room.floor}</div>
      <div className="w-16 text-sm">{room.type}</div>
      <div className="flex-1 text-sm">{room.tenant?.name ?? '—'}</div>
      <div className="w-32 text-sm font-medium">{formatPrice(room.monthlyPrice)}</div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}>{cfg.label}</span>
      {room.tenant?.paymentStatus && (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_BADGE[room.tenant.paymentStatus]}`}>
          {room.tenant.paymentStatus}
        </span>
      )}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

// ─── Room Detail Drawer ───────────────────────────────────────────────────────
function RoomDetailSheet({ room, open, onClose }: { room: RoomData | null; open: boolean; onClose: () => void }) {
  if (!room) return null;
  const cfg = STATUS_CONFIG[room.status];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold">{room.number}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}>{cfg.label}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Room Info */}
          <div className="rounded-xl border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Room Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{room.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Area</p>
                <p className="font-medium">{room.area} m²</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold text-primary">{formatPrice(room.monthlyPrice)}</p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a];
                  return (
                    <span key={a} className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs">
                      {Icon && <Icon className="h-3 w-3" />}
                      {a}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tenant Info */}
          {room.tenant ? (
            <div className="rounded-xl border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Current Tenant</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {room.tenant.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{room.tenant.name}</p>
                  <p className="text-xs text-muted-foreground">Active Tenant</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{room.tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{room.tenant.phone}</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Lease Info */}
          {room.tenant && (
            <div className="rounded-xl border p-4 space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Lease</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-medium">{room.tenant.checkIn}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lease End</p>
                  <p className="font-medium">{room.tenant.leaseEnd}</p>
                </div>
              </div>
              {room.tenant.paymentStatus && (
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">Payment Status</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${PAYMENT_BADGE[room.tenant.paymentStatus]}`}>
                    {room.tenant.paymentStatus}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Maintenance Note */}
          {room.maintenanceNote && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                <Wrench className="h-4 w-4" />
                Maintenance Note
              </div>
              <p className="text-sm text-amber-600 dark:text-amber-300">{room.maintenanceNote}</p>
              {room.lastMaintenance && (
                <p className="mt-1 text-xs text-amber-500">Since {room.lastMaintenance}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full">
              Edit Room
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              Create Ticket
            </Button>
            {room.status === 'OCCUPIED' && (
              <Button size="sm" className="col-span-2 w-full">
                Generate Invoice
              </Button>
            )}
            {room.status === 'AVAILABLE' && (
              <Button size="sm" className="col-span-2 w-full">
                Add Tenant
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Status Filter Chip ───────────────────────────────────────────────────────
function StatusChip({ status, active, count, onClick }: { status: RoomStatus | 'ALL'; active: boolean; count: number; onClick: () => void }) {
  const cfg = status !== 'ALL' ? STATUS_CONFIG[status] : null;
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
      }`}
    >
      {cfg && <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-white' : cfg.dot}`} />}
      {status === 'ALL' ? 'All' : STATUS_CONFIG[status as RoomStatus].label}
      <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? 'bg-white/20' : 'bg-muted'}`}>{count}</span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const ALL_STATUSES: RoomStatus[] = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE', 'OVERDUE'];

export default function RoomsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'ALL'>('ALL');
  const [floorFilter, setFloorFilter] = useState<number | 'ALL'>('ALL');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedRoom, setSelectedRoom] = useState<RoomData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const floors = useMemo(() => Array.from(new Set(mockRooms.map((r) => r.floor))).sort(), []);

  const counts = useMemo(() => {
    const all = mockRooms.length;
    const byStatus = ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: mockRooms.filter((r) => r.status === s).length }), {} as Record<RoomStatus, number>);
    return { ALL: all, ...byStatus };
  }, []);

  const filtered = useMemo(() => {
    return mockRooms.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (floorFilter !== 'ALL' && r.floor !== floorFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          r.number.toLowerCase().includes(q) ||
          r.tenant?.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter, floorFilter]);

  const openDetail = (room: RoomData) => {
    setSelectedRoom(room);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {mockRooms.length} rooms · Homia Stay Menteng
          </p>
        </div>
        <Button size="sm">+ Add Room</Button>
      </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search room, tenant..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Floor filter */}
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="flex rounded-md border p-0.5">
              <button
                onClick={() => setView('grid')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors ${view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3X3 className="h-3.5 w-3.5" />Grid
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-3.5 w-3.5" />List
              </button>
            </div>
          </div>

          {/* Status Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusChip
              status="ALL"
              active={statusFilter === 'ALL'}
              count={counts.ALL}
              onClick={() => setStatusFilter('ALL')}
            />
            {ALL_STATUSES.map((s) => (
              <StatusChip
                key={s}
                status={s}
                active={statusFilter === s}
                count={counts[s] ?? 0}
                onClick={() => setStatusFilter(statusFilter === s ? 'ALL' : s)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Room Display */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <Filter className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No rooms found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          <Button variant="ghost" size="sm" className="mt-3" onClick={() => { setSearch(''); setStatusFilter('ALL'); setFloorFilter('ALL'); }}>
            Clear filters
          </Button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} onClick={() => openDetail(room)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-4 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div className="w-20">Room</div>
            <div className="w-16">Floor</div>
            <div className="w-16">Type</div>
            <div className="flex-1">Tenant</div>
            <div className="w-32">Rent/Month</div>
            <div className="w-24">Status</div>
            <div className="w-20">Payment</div>
            <div className="w-4" />
          </div>
          {filtered.map((room) => (
            <RoomListRow key={room.id} room={room} onClick={() => openDetail(room)} />
          ))}
        </div>
      )}

      {/* Room Detail Drawer */}
      <RoomDetailSheet
        room={selectedRoom}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
