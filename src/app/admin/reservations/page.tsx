'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { getStoredReservations } from '@/lib/storage';
import { Reservation } from '@/lib/types';
import { CalendarCheck, QrCode, Search, CheckCircle, Clock, Users, XCircle, Scan } from 'lucide-react';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scanPassInput, setScanPassInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setReservations(getStoredReservations());
  }, []);

  const handleUpdateStatus = (id: string, newStatus: Reservation['status']) => {
    const updated = reservations.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setReservations(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tablevibe_reservations', JSON.stringify(updated));
    }
  };

  const handleSimulateQRScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanPassInput) return;

    const found = reservations.find((r) => r.qrCode?.toLowerCase() === scanPassInput.trim().toLowerCase() || r.id.toLowerCase() === scanPassInput.trim().toLowerCase());

    if (found) {
      handleUpdateStatus(found.id, 'seated');
      setScanMessage({ text: `Valid Pass! Guest ${found.guestName} seated at Table ${found.tableNumber}.`, type: 'success' });
      setScanPassInput('');
    } else {
      setScanMessage({ text: `Invalid or unassigned QR Pass code: ${scanPassInput}`, type: 'error' });
    }
  };

  const filtered = reservations.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(search.toLowerCase()) ||
      r.tableNumber.toLowerCase().includes(search.toLowerCase()) ||
      (r.qrCode && r.qrCode.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-400" /> Reservation Manager & QR Check-in
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Live guest check-in portal, table assignments, and reservation status controls.</p>
          </div>

          {/* Quick QR Scanner Box */}
          <form onSubmit={handleSimulateQRScan} className="flex items-center gap-2 bg-slate-900 border border-emerald-500/50 p-2 rounded-xl">
            <Scan className="w-4 h-4 text-emerald-400" />
            <input
              type="text"
              placeholder="Scan/Type QR Pass Code..."
              value={scanPassInput}
              onChange={(e) => setScanPassInput(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-48"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition"
            >
              Verify Check-in
            </button>
          </form>
        </div>

        {scanMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between animate-fade-in ${
              scanMessage.type === 'success' ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/80 border border-red-500/40 text-red-300'
            }`}
          >
            <span>{scanMessage.text}</span>
            <button onClick={() => setScanMessage(null)} className="text-xs opacity-60 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search guest or table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-full"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'confirmed', 'seated', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">Guest Details</th>
                <th className="p-4">Table</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">QR Pass</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{res.guestName}</div>
                    <div className="text-slate-400 text-[11px]">{res.guestEmail} • {res.guestPhone}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{res.guestCount} Guests</div>
                  </td>
                  <td className="p-4 font-bold text-white">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-emerald-400">
                      Table {res.tableNumber}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{res.date}</div>
                    <div className="text-slate-400">{res.timeSlot}</div>
                  </td>
                  <td className="p-4 font-mono text-[11px] text-indigo-300">
                    {res.qrCode}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      res.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : res.status === 'seated'
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'seated')}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Seat Guest
                      </button>
                    )}
                    {res.status === 'seated' && (
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'completed')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        Mark Completed
                      </button>
                    )}
                    {res.status !== 'cancelled' && res.status !== 'completed' && (
                      <button
                        onClick={() => handleUpdateStatus(res.id, 'cancelled')}
                        className="bg-red-950/60 hover:bg-red-900 text-red-400 font-semibold px-2.5 py-1.5 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
