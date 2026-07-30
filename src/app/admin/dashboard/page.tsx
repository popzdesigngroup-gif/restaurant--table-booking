'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { getStoredRestaurantById, getStoredReservations } from '@/lib/storage';
import { Restaurant, Reservation } from '@/lib/types';
import {
  Activity,
  Server,
  Database,
  Wifi,
  Users,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  Radio,
  Clock,
  ShieldCheck,
  Play,
  Pause,
  Bell,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Flame,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMonitoringDashboardPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [emergencyLockout, setEmergencyLockout] = useState(false);
  const [systemLogs, setSystemLogs] = useState<{ id: string; time: string; type: 'info' | 'success' | 'warn'; msg: string }[]>([]);

  useEffect(() => {
    const data = getStoredRestaurantById('rest-1');
    if (data) setRestaurant(data);
    const res = getStoredReservations();
    setReservations(res);

    // Initial system logs feed
    setSystemLogs([
      { id: '1', time: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'success', msg: 'QR Code verified: Guest Alex Wright checked in at Table W-02' },
      { id: '2', time: new Date(Date.now() - 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'info', msg: 'New instant booking received: Table TR-01 (Al Fresco Terrace)' },
      { id: '3', time: new Date(Date.now() - 360000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'warn', msg: 'Table T-13 flagged for maintenance check by staff' },
      { id: '4', time: new Date(Date.now() - 600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), type: 'info', msg: 'AI Concierge served 48 table recommendations in last hour' }
    ]);
  }, []);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Initializing live monitoring panel...</p>
        </div>
      </div>
    );
  }

  const currentFloor = restaurant.floors[0];
  const totalTables = currentFloor.tables.length;
  const availableCount = currentFloor.tables.filter((t) => t.status === 'available').length;
  const bookedCount = currentFloor.tables.filter((t) => t.status === 'booked' || t.status === 'reserved_soon').length;
  const maintenanceCount = currentFloor.tables.filter((t) => t.status === 'blocked').length;

  const totalPaid = reservations.reduce((acc, r) => acc + (r.totalPaid || 0), 0) + 1450;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Monitoring Header & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white flex items-center gap-2.5">
                <Activity className="w-8 h-8 text-emerald-400" /> Admin Monitoring Control Center
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5" /> LIVE MONITORING
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">Real-time floor state synchronization, system telemetry, live event log, and operational controls.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLiveSync(!isLiveSync)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                isLiveSync
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              <Wifi className="w-4 h-4" /> {isLiveSync ? 'WebSockets Live (14ms)' : 'Sync Paused'}
            </button>

            <button
              onClick={() => setEmergencyLockout(!emergencyLockout)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
                emergencyLockout
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/50 animate-bounce'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-red-500/50 hover:text-red-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> {emergencyLockout ? 'OVERRIDE: Floor Locked' : 'Pause New Bookings'}
            </button>
          </div>
        </div>

        {/* System Health Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">PostgreSQL DB</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Operational (0.8ms)
              </div>
            </div>
            <Database className="w-6 h-6 text-slate-600" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Redis Table State Cache</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 99.8% Cache Hit Rate
              </div>
            </div>
            <Server className="w-6 h-6 text-slate-600" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">WebSocket Sync</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 142 Active Connections
              </div>
            </div>
            <Wifi className="w-6 h-6 text-slate-600" />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">QR Verification Engine</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Verified Contactless
              </div>
            </div>
            <ShieldCheck className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        {/* Live Gauges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Seated / Reserved</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{bookedCount} <span className="text-xs font-normal text-slate-400">/ {totalTables} Tables</span></div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(bookedCount / totalTables) * 100}%` }} />
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Available Table Capacity</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{availableCount} <span className="text-xs font-normal text-slate-400">Open Tables</span></div>
            <div className="text-xs text-slate-400 font-medium">Ready for immediate walk-in</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Maintenance / Out of Order</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{maintenanceCount} <span className="text-xs font-normal text-slate-400">Table</span></div>
            <div className="text-xs text-amber-400/80 font-medium">Table T-13 blocked</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Total Revenue Today</span>
              <DollarSign className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">${totalPaid.toLocaleString()}</div>
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Live revenue updates
            </div>
          </div>
        </div>

        {/* Middle Section: Live Activity Feed & Quick Admin Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Activity Telemetry Feed (2 Cols) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" /> Real-Time Operational Event Feed
              </h3>
              <span className="text-[11px] text-slate-400">Auto-refreshing every 5s</span>
            </div>

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {systemLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        log.type === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : log.type === 'warn' ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-indigo-400'
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{log.msg}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Floor layout floor-main • System Event</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts (1 Col) */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Monitoring Shortcuts</h3>
            
            <div className="space-y-3">
              <Link
                href="/admin/editor"
                className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                  <div>
                    <div className="font-bold text-white text-xs">Floor Plan Editor</div>
                    <div className="text-[11px] text-slate-400">Drag & drop canvas elements</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </Link>

              <Link
                href="/admin/reservations"
                className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-white text-xs">Live Reservation Manager</div>
                    <div className="text-[11px] text-slate-400">Scan QR codes & seat guests</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </Link>

              <Link
                href="/admin/analytics"
                className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <Flame className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-bold text-white text-xs">Occupancy Heatmap</div>
                    <div className="text-[11px] text-slate-400">Heat intensity & peak hours</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
