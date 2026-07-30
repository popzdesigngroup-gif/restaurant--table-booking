'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { FloorEditorCanvas } from '@/components/floorplan/FloorEditorCanvas';
import { getStoredRestaurantById, updateStoredRestaurant } from '@/lib/storage';
import { Restaurant, TableItem, FloorElement } from '@/lib/types';
import { Settings, Save, Check, Grid } from 'lucide-react';

export default function AdminEditorPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const data = getStoredRestaurantById('rest-1');
    if (data) setRestaurant(data);
  }, []);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading floor plan editor...</p>
        </div>
      </div>
    );
  }

  const currentFloor = restaurant.floors[0];

  const handleSaveLayout = (updatedTables: TableItem[], updatedElements: FloorElement[]) => {
    const updatedRestaurant = { ...restaurant };
    updatedRestaurant.floors[0].tables = updatedTables;
    updatedRestaurant.floors[0].elements = updatedElements;

    setRestaurant(updatedRestaurant);
    updateStoredRestaurant(updatedRestaurant);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-400" /> Restaurant Owner Floor Plan Editor
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize floor layout, drag & drop table positions, set seating capacity, or block tables for maintenance.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Editing: <span className="font-bold text-white">{restaurant.name}</span> ({currentFloor.name})
          </div>
        </div>

        <FloorEditorCanvas
          initialTables={currentFloor.tables}
          initialElements={currentFloor.elements}
          onSaveLayout={handleSaveLayout}
        />
      </main>
    </div>
  );
}
