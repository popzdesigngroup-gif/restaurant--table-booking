'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FloorCanvas } from '@/components/floorplan/FloorCanvas';
import { getStoredRestaurantById, getStoredReservations } from '@/lib/storage';
import { Restaurant, Reservation } from '@/lib/types';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Flame, Eye } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    const data = getStoredRestaurantById('rest-1');
    if (data) setRestaurant(data);
    setReservations(getStoredReservations());
  }, []);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  const currentFloor = restaurant.floors[0];

  // Calculate metrics
  const totalBookings = reservations.length;
  const totalRevenue = reservations.reduce((acc, r) => acc + (r.totalPaid || 0), 0) + 1450;
  const bookedTablesCount = currentFloor.tables.filter((t) => t.status === 'booked' || t.status === 'reserved_soon').length;
  const occupancyRate = Math.round((bookedTablesCount / currentFloor.tables.length) * 100);

  const hourlyData = [
    { hour: '5 PM', count: 12, fill: '40%' },
    { hour: '6 PM', count: 28, fill: '70%' },
    { hour: '7 PM', count: 42, fill: '95%' },
    { hour: '8 PM', count: 45, fill: '100%' },
    { hour: '9 PM', count: 34, fill: '80%' },
    { hour: '10 PM', count: 18, fill: '50%' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" /> Analytics & Occupancy Heatmap
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time revenue metrics, peak dining hours, and floor plan heat intensity.</p>
          </div>
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border ${
              showHeatmap
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-950/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" /> {showHeatmap ? 'Heatmap Overlay Active' : 'Enable Heatmap Overlay'}
          </button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Projected Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">${totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% from yesterday
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Floor Occupancy Rate</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">{occupancyRate}%</div>
            <div className="text-[11px] text-indigo-400 font-semibold">
              {bookedTablesCount} of {currentFloor.tables.length} tables filled
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Peak Demand Window</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">7:30 PM - 9:00 PM</div>
            <div className="text-[11px] text-amber-400 font-semibold">
              100% Window seat occupancy
            </div>
          </div>

          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Table Turnover Speed</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">1.8 Turn / Table</div>
            <div className="text-[11px] text-purple-400 font-semibold">
              Avg. dining time: 72 mins
            </div>
          </div>
        </div>

        {/* Heatmap & Canvas View */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" /> Live Occupancy Heatmap Visualizer
          </h3>
          <FloorCanvas
            tables={currentFloor.tables}
            elements={currentFloor.elements}
            onSelectTable={() => {}}
            showHeatmap={showHeatmap}
          />
        </div>

        {/* Peak Hours Chart & Section Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Demand Bar Chart */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" /> Peak Hour Reservation Distribution
            </h3>
            <div className="space-y-3 pt-2">
              {hourlyData.map((h) => (
                <div key={h.hour} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>{h.hour}</span>
                    <span className="text-emerald-400">{h.count} Bookings</span>
                  </div>
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: h.fill }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Sections Performance */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Section Occupancy & Revenue</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Skyline Window Row</div>
                  <div className="text-slate-400">Panoramic City View</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">100% Booked</div>
                  <div className="text-slate-400">$650 Deposit Total</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Executive VIP Suite</div>
                  <div className="text-slate-400">Private Dining Alcove</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-400">75% Booked</div>
                  <div className="text-slate-400">$500 Deposit Total</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Al Fresco Terrace</div>
                  <div className="text-slate-400">Outdoor Sky Deck</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">80% Booked</div>
                  <div className="text-slate-400">$300 Deposit Total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
