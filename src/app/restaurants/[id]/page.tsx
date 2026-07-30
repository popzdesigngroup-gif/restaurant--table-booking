'use client';

import React, { useState, useEffect, use } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FloorCanvas } from '@/components/floorplan/FloorCanvas';
import { TableModal } from '@/components/floorplan/TableModal';
import { AIRecommendationCard } from '@/components/ui/AIRecommendationCard';
import { getStoredRestaurantById } from '@/lib/storage';
import { Restaurant, TableItem, AIRecommendationResult, Reservation } from '@/lib/types';
import { Star, MapPin, Clock, Phone, Sparkles, Filter, Info, Eye } from 'lucide-react';

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const restaurantId = resolvedParams.id || 'rest-1';

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedFloorIndex, setSelectedFloorIndex] = useState(0);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  useEffect(() => {
    const data = getStoredRestaurantById(restaurantId);
    if (data) {
      setRestaurant(data);
    }
  }, [restaurantId]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading restaurant floor plan layout...</p>
        </div>
      </div>
    );
  }

  const currentFloor = restaurant.floors[selectedFloorIndex] || restaurant.floors[0];

  const filteredTables = currentFloor.tables.filter((t) => {
    if (sectionFilter === 'all') return true;
    return t.sectionId === sectionFilter;
  });

  const handleSelectTable = (table: TableItem) => {
    setSelectedTable(table);
  };

  const handleApplyAIRecommendation = (result: AIRecommendationResult) => {
    setRecommendedIds(result.recommendedTableIds);
  };

  const handleReservationCompleted = (res: Reservation) => {
    // Refresh restaurant state from storage
    const updated = getStoredRestaurantById(restaurantId);
    if (updated) setRestaurant(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      {/* Header Banner */}
      <div className="relative bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white">{restaurant.name}</h1>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {restaurant.rating}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">{restaurant.tagline}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {restaurant.address}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {restaurant.openingHours}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {restaurant.phone}</span>
            </div>
          </div>

          {/* Section Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSectionFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                sectionFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Sections ({currentFloor.tables.length})
            </button>
            {currentFloor.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSectionFilter(sec.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  sectionFilter === sec.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Interactive Canvas Floor Plan (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white">Live Floor Plan Layout</span>
              <span className="text-xs text-slate-400">• Click any table to view capacity & reserve</span>
            </div>
            <div className="text-xs text-slate-400">
              Floor: <span className="font-bold text-white">{currentFloor.name}</span>
            </div>
          </div>

          {/* Canvas Component */}
          <FloorCanvas
            tables={filteredTables}
            elements={currentFloor.elements}
            selectedTableId={selectedTable?.id}
            recommendedTableIds={recommendedIds}
            onSelectTable={handleSelectTable}
          />
        </div>

        {/* Right Col: AI Concierge & Table Inspector (1 col) */}
        <div className="space-y-6">
          {/* AI Recommendation Widget */}
          <AIRecommendationCard
            tables={currentFloor.tables}
            onApplyRecommendation={handleApplyAIRecommendation}
          />

          {/* Quick Selection Card */}
          {selectedTable ? (
            <div className="bg-slate-900 border border-emerald-500/50 p-5 rounded-2xl shadow-xl space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Selected Table
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Table {selectedTable.number}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Capacity</div>
                  <div className="text-sm font-bold text-white">{selectedTable.capacity} Guests</div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300">
                <div>Section: <span className="font-semibold text-white">{selectedTable.sectionName}</span></div>
                <div>Style: <span className="font-semibold text-white capitalize">{selectedTable.shape}</span></div>
                <div>Status: <span className="font-semibold text-emerald-400 capitalize">{selectedTable.status}</span></div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedTable.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800">
                    ✨ {f}
                  </span>
                ))}
              </div>

              {selectedTable.status === 'available' ? (
                <button
                  onClick={() => setSelectedTable(selectedTable)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-emerald-950/50"
                >
                  Book Table {selectedTable.number} Now &rarr;
                </button>
              ) : (
                <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 text-center font-medium">
                  This table is currently booked or reserved. Please pick another available green table.
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Table Selected</h4>
              <p className="text-xs text-slate-400">
                Click on any green table on the floor layout canvas, or use the AI Concierge to recommend the best spot!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Popup */}
      {selectedTable && selectedTable.status === 'available' && (
        <TableModal
          table={selectedTable}
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setSelectedTable(null)}
          onReservationComplete={handleReservationCompleted}
        />
      )}
    </div>
  );
}
