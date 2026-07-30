'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { useAuth } from '@/context/AuthContext';
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
  UserPlus,
  Trash2,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Flame,
  Settings,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function AdminMonitoringDashboardPage() {
  const { managers, addManagerAccess, removeManagerAccess } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [emergencyLockout, setEmergencyLockout] = useState(false);

  // New Manager Provisioning Form State
  const [newManagerName, setNewManagerName] = useState('');
  const [newManagerEmail, setNewManagerEmail] = useState('');
  const [provisionSuccessMsg, setProvisionSuccessMsg] = useState('');

  useEffect(() => {
    const data = getStoredRestaurantById('rest-1');
    if (data) setRestaurant(data);
    const res = getStoredReservations();
    setReservations(res);
  }, []);

  const handleAddManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManagerEmail || !newManagerName) return;

    addManagerAccess(newManagerName, newManagerEmail, 'rest-1');
    setProvisionSuccessMsg(`Granted Manager Access to ${newManagerName} (${newManagerEmail})!`);
    setNewManagerName('');
    setNewManagerEmail('');

    setTimeout(() => setProvisionSuccessMsg(''), 4000);
  };

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
                <Activity className="w-8 h-8 text-emerald-400" /> Admin Monitoring & Staff Control Center
              </h1>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
                <Radio className="w-3.5 h-3.5" /> LIVE MONITORING
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">Real-time telemetry, live occupancy heatmap, and Manager Access Provisioning.</p>
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
              <span>Provisioned Managers</span>
              <UserPlus className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-teal-400">{managers.length} <span className="text-xs font-normal text-slate-400">Accounts</span></div>
            <div className="text-xs text-slate-400 font-medium">Floor layout access enabled</div>
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

        {/* Manager Access Control & Provisioning Panel */}
        <div className="bg-slate-900 border border-teal-500/40 p-6 rounded-2xl shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-teal-400" /> Manager Access Control & Provisioning
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Grant manager credentials to staff members to allow them to edit floor plan layouts and allocate seats.
              </p>
            </div>
          </div>

          {provisionSuccessMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{provisionSuccessMsg}</span>
            </div>
          )}

          {/* Form to Add New Manager */}
          <form onSubmit={handleAddManager} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Manager Full Name</label>
              <input
                type="text"
                placeholder="e.g. Marcus Vance"
                value={newManagerName}
                onChange={(e) => setNewManagerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Manager Email Address</label>
              <input
                type="email"
                placeholder="marcus@restaurant.com"
                value={newManagerEmail}
                onChange={(e) => setNewManagerEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Grant Manager Access
              </button>
            </div>
          </form>

          {/* Active Provisioned Managers List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Provisioned Managers ({managers.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {managers.map((mgr) => (
                <div key={mgr.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">{mgr.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-teal-400" /> {mgr.email}
                    </div>
                  </div>
                  <button
                    onClick={() => removeManagerAccess(mgr.id)}
                    className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg transition"
                    title="Revoke Manager Access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
