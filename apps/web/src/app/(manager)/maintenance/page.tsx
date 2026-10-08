'use client';

import { useState } from 'react';
import { Clock, AlertTriangle, User, Wrench, Plus, ChevronRight, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';

// ─── Types ─────────────────────────────────────────────────────────────────────
type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'RESOLVED' | 'CLOSED';
type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface Ticket {
  id: string;
  number: string;
  title: string;
  room: string;
  category: string;
  priority: Priority;
  status: TicketStatus;
  assignedTo?: string;
  createdAt: string; // ISO
  slaHours?: number;
  tenant: string;
  description: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────
const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600000).toISOString();

const mockTickets: Ticket[] = [
  { id: '1', number: 'TKT-001', title: 'AC Unit Not Working', room: 'A-203', category: 'AC', priority: 'URGENT', status: 'OPEN', tenant: 'Andi Saputra', description: 'The AC stopped cooling. Room temperature is 35°C.', createdAt: hoursAgo(3.7), slaHours: 4 },
  { id: '2', number: 'TKT-002', title: 'Water Leak in Bathroom', room: 'B-105', category: 'Plumbing', priority: 'HIGH', status: 'OPEN', tenant: 'Siti Rahayu', description: 'Water leaking from under the sink.', createdAt: hoursAgo(26), slaHours: 8 },
  { id: '3', number: 'TKT-003', title: 'Door Lock Broken', room: 'C-201', category: 'Door', priority: 'HIGH', status: 'OPEN', assignedTo: 'Ahmad Staff', tenant: 'Budi Santoso', description: 'Key won\'t turn in the lock.', createdAt: hoursAgo(5.3), slaHours: 8 },
  { id: '4', number: 'TKT-004', title: 'Internet Keeps Dropping', room: 'A-102', category: 'Internet', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedTo: 'Ahmad Staff', tenant: 'Dian Permata', description: 'WiFi disconnects every 30 minutes.', createdAt: hoursAgo(12), slaHours: 24 },
  { id: '5', number: 'TKT-005', title: 'Broken Window Latch', room: 'B-203', category: 'Window', priority: 'LOW', status: 'IN_PROGRESS', assignedTo: 'Rudi Technician', tenant: 'Reza Pratama', description: 'Window latch broken, cannot close properly.', createdAt: hoursAgo(48), slaHours: 72 },
  { id: '6', number: 'TKT-006', title: 'Light Bulb Replacement', room: 'A-304', category: 'Electrical', priority: 'LOW', status: 'WAITING', assignedTo: 'Rudi Technician', tenant: 'Novi Anggraini', description: 'Ceiling light bulb blown.', createdAt: hoursAgo(6), slaHours: 48 },
  { id: '7', number: 'TKT-007', title: 'Hot Water Not Working', room: 'A-101', category: 'Plumbing', priority: 'HIGH', status: 'RESOLVED', assignedTo: 'Ahmad Staff', tenant: 'Budi Santoso', description: 'Water heater stopped working.', createdAt: hoursAgo(72) },
  { id: '8', number: 'TKT-008', title: 'AC Filter Cleaning', room: 'B-301', category: 'AC', priority: 'LOW', status: 'CLOSED', assignedTo: 'Rudi Technician', tenant: 'Tenant B301', description: 'Monthly AC filter maintenance.', createdAt: hoursAgo(168) },
];

// ─── Config ─────────────────────────────────────────────────────────────────────
const COLUMNS: { status: TicketStatus; label: string; color: string; headerColor: string }[] = [
  { status: 'OPEN',        label: 'Open',        color: 'bg-red-50 dark:bg-red-950/20',    headerColor: 'bg-red-500' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-950/20',  headerColor: 'bg-blue-500' },
  { status: 'WAITING',     label: 'Waiting',     color: 'bg-amber-50 dark:bg-amber-950/20',headerColor: 'bg-amber-500' },
  { status: 'RESOLVED',    label: 'Resolved',    color: 'bg-green-50 dark:bg-green-950/20',headerColor: 'bg-green-500' },
  { status: 'CLOSED',      label: 'Closed',      color: 'bg-gray-50 dark:bg-gray-900',     headerColor: 'bg-gray-400' },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; badge: string; dot: string }> = {
  URGENT: { label: 'URGENT', badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',    dot: 'bg-red-500' },
  HIGH:   { label: 'HIGH',   badge: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300', dot: 'bg-orange-500' },
  MEDIUM: { label: 'MED',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',  dot: 'bg-blue-400' },
  LOW:    { label: 'LOW',    badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400', dot: 'bg-gray-400' },
};

// ─── SLA Util ─────────────────────────────────────────────────────────────────
function getSlaStatus(ticket: Ticket) {
  if (!ticket.slaHours) return null;
  const hoursOpen = (now - new Date(ticket.createdAt).getTime()) / 3600000;
  const pct = hoursOpen / ticket.slaHours;
  const display = hoursOpen < 1
    ? `${Math.round(hoursOpen * 60)}m`
    : hoursOpen < 24
      ? `${Math.floor(hoursOpen)}h ${Math.round((hoursOpen % 1) * 60)}m`
      : `${Math.floor(hoursOpen / 24)}d ${Math.floor(hoursOpen % 24)}h`;
  return {
    hoursOpen,
    display,
    isBreached: pct >= 1,
    isApproaching: pct >= 0.75 && pct < 1,
    pct: Math.min(pct, 1),
  };
}

// ─── Ticket Card ──────────────────────────────────────────────────────────────
function TicketCard({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const priority = PRIORITY_CONFIG[ticket.priority];
  const sla = getSlaStatus(ticket);

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-xl border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md hover:border-primary/30"
    >
      {/* Priority + number */}
      <div className="mb-2 flex items-center justify-between">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.badge}`}>
          {priority.label}
        </span>
        <span className="text-[10px] text-muted-foreground">{ticket.number}</span>
      </div>

      {/* Title */}
      <p className="mb-1 text-sm font-semibold leading-snug">{ticket.title}</p>

      {/* Room + Category */}
      <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="rounded-md bg-muted px-1.5 py-0.5">Room {ticket.room}</span>
        <span>·</span>
        <span>{ticket.category}</span>
      </div>

      {/* SLA Timer */}
      {sla && ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
        <div className={`mb-3 rounded-lg p-2 text-xs ${sla.isBreached ? 'bg-red-50 dark:bg-red-950/30' : sla.isApproaching ? 'bg-amber-50 dark:bg-amber-950/30' : 'bg-muted/50'}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Clock className={`h-3 w-3 ${sla.isBreached ? 'text-red-500' : sla.isApproaching ? 'text-amber-500' : 'text-muted-foreground'}`} />
              <span className={sla.isBreached ? 'font-semibold text-red-600 dark:text-red-400' : sla.isApproaching ? 'font-semibold text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}>
                Open: {sla.display}
              </span>
            </div>
            <span className="text-muted-foreground">SLA: {ticket.slaHours}h</span>
          </div>
          <div className="h-1 w-full rounded-full bg-muted">
            <div
              className={`h-1 rounded-full transition-all ${sla.isBreached ? 'bg-red-500' : sla.isApproaching ? 'bg-amber-400' : 'bg-primary'}`}
              style={{ width: `${sla.pct * 100}%` }}
            />
          </div>
          {(sla.isBreached || sla.isApproaching) && (
            <div className="mt-1 flex items-center gap-1">
              <AlertTriangle className={`h-3 w-3 ${sla.isBreached ? 'text-red-500' : 'text-amber-500'}`} />
              <span className={`text-[10px] font-medium ${sla.isBreached ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {sla.isBreached ? 'SLA Breached' : 'Approaching SLA'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Assigned to */}
      <div className="flex items-center justify-between">
        {ticket.assignedTo ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
              {ticket.assignedTo[0]}
            </div>
            {ticket.assignedTo}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">Unassigned</span>
        )}
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </button>
  );
}

// ─── Ticket Detail Sheet ───────────────────────────────────────────────────────
function TicketDetailSheet({ ticket, open, onClose }: { ticket: Ticket | null; open: boolean; onClose: () => void }) {
  if (!ticket) return null;
  const sla = getSlaStatus(ticket);
  const priority = PRIORITY_CONFIG[ticket.priority];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${priority.badge}`}>{ticket.priority}</span>
            <span className="text-xs text-muted-foreground">{ticket.number}</span>
          </div>
          <SheetTitle className="text-lg">{ticket.title}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div className="rounded-xl border p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Room</span><span className="font-medium">{ticket.room}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{ticket.category}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tenant</span><span className="font-medium">{ticket.tenant}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Assigned To</span><span className="font-medium">{ticket.assignedTo ?? 'Unassigned'}</span></div>
          </div>

          <div className="rounded-xl border p-4">
            <p className="mb-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">Description</p>
            <p className="text-sm">{ticket.description}</p>
          </div>

          {sla && (
            <div className={`rounded-xl border p-4 ${sla.isBreached ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20' : sla.isApproaching ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20' : ''}`}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">SLA Status</p>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Open for: <strong>{sla.display}</strong></span>
                <span className="text-muted-foreground">SLA: {ticket.slaHours}h</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className={`h-2 rounded-full ${sla.isBreached ? 'bg-red-500' : sla.isApproaching ? 'bg-amber-400' : 'bg-primary'}`}
                  style={{ width: `${sla.pct * 100}%` }}
                />
              </div>
              {(sla.isBreached || sla.isApproaching) && (
                <p className={`mt-2 text-xs font-semibold ${sla.isBreached ? 'text-red-600' : 'text-amber-600'}`}>
                  ⚠ {sla.isBreached ? 'SLA has been breached' : 'Approaching SLA limit'}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">Assign Staff</Button>
            <Button variant="outline" size="sm">Add Comment</Button>
            {ticket.status === 'OPEN' && <Button size="sm" className="col-span-2">Mark In Progress</Button>}
            {ticket.status === 'IN_PROGRESS' && <Button size="sm" className="col-span-2">Mark Resolved</Button>}
            {ticket.status === 'RESOLVED' && <Button variant="outline" size="sm" className="col-span-2">Close Ticket</Button>}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Kanban Column ─────────────────────────────────────────────────────────────
function KanbanColumn({
  status, label, color, headerColor, tickets, onTicketClick,
}: {
  status: TicketStatus; label: string; color: string; headerColor: string;
  tickets: Ticket[]; onTicketClick: (t: Ticket) => void;
}) {
  return (
    <div className={`flex min-w-[280px] flex-col rounded-xl border ${color}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between rounded-t-xl border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${headerColor}`} />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground shadow-sm">
          {tickets.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 p-3 min-h-[200px]">
        {tickets.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center text-xs text-muted-foreground">
            <Wrench className="mb-2 h-5 w-5 opacity-30" />
            No tickets
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={() => onTicketClick(ticket)} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MaintenancePage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');

  const filtered = priorityFilter === 'ALL'
    ? mockTickets
    : mockTickets.filter((t) => t.priority === priorityFilter);

  const openTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const openCount = mockTickets.filter((t) => t.status === 'OPEN').length;
  const urgentCount = mockTickets.filter((t) => t.priority === 'URGENT').length;
  const slaBreached = mockTickets.filter((t) => {
    const s = getSlaStatus(t);
    return s?.isBreached && t.status !== 'RESOLVED' && t.status !== 'CLOSED';
  }).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {openCount} open
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-600" />
              {urgentCount} urgent
            </span>
            {slaBreached > 0 && (
              <span className="flex items-center gap-1 font-medium text-red-600">
                <AlertTriangle className="h-3 w-3" />
                {slaBreached} SLA breached
              </span>
            )}
          </div>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Priority Filter */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              priorityFilter === p
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40'
            }`}
          >
            {p === 'ALL' ? 'All Priorities' : p}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            {...col}
            tickets={filtered.filter((t) => t.status === col.status)}
            onTicketClick={openTicket}
          />
        ))}
      </div>

      {/* Ticket Detail Drawer */}
      <TicketDetailSheet
        ticket={selectedTicket}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
