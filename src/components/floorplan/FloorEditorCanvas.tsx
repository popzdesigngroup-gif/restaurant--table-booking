'use client';

import React, { useState } from 'react';
import { TableItem, FloorElement, TableShape, TableStatus, ElementType } from '@/lib/types';
import { Plus, Trash2, RotateCw, Save, Check, Grid, Lock, ShieldAlert, Move } from 'lucide-react';

interface FloorEditorCanvasProps {
  initialTables: TableItem[];
  initialElements: FloorElement[];
  onSaveLayout: (tables: TableItem[], elements: FloorElement[]) => void;
}

export const FloorEditorCanvas: React.FC<FloorEditorCanvasProps> = ({
  initialTables,
  initialElements,
  onSaveLayout
}) => {
  const [tables, setTables] = useState<TableItem[]>(initialTables);
  const [elements, setElements] = useState<FloorElement[]>(initialElements);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [activeTab, setActiveTab] = useState<'tables' | 'elements'>('tables');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSelectTable = (table: TableItem) => {
    setSelectedTable(table);
  };

  const handleAddTable = (shape: TableShape, capacity: number) => {
    const newTable: TableItem = {
      id: `t-edit-${Date.now()}`,
      number: `T-${tables.length + 1}`,
      capacity,
      shape,
      x: 40 + Math.floor(Math.random() * 20),
      y: 40 + Math.floor(Math.random() * 20),
      width: shape === 'booth' || shape === 'rectangle' ? 14 : 10,
      height: shape === 'booth' || shape === 'rectangle' ? 10 : 10,
      rotation: 0,
      status: 'available',
      sectionId: 'sec-main',
      sectionName: 'Central Lounge',
      features: ['Standard Seating']
    };
    setTables((prev) => [...prev, newTable]);
    setSelectedTable(newTable);
  };

  const handleAddElement = (type: ElementType, label: string) => {
    const newElement: FloorElement = {
      id: `el-edit-${Date.now()}`,
      type,
      label,
      x: 35,
      y: 35,
      width: type === 'bar' ? 30 : 15,
      height: 10
    };
    setElements((prev) => [...prev, newElement]);
  };

  const handleUpdateSelectedTable = (updates: Partial<TableItem>) => {
    if (!selectedTable) return;
    const updated = { ...selectedTable, ...updates };
    setSelectedTable(updated);
    setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteSelectedTable = () => {
    if (!selectedTable) return;
    setTables((prev) => prev.filter((t) => t.id !== selectedTable.id));
    setSelectedTable(null);
  };

  const handleSave = () => {
    onSaveLayout(tables, elements);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Canvas Area (Cols 1-3) */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        {/* Editor Bar */}
        <div className="flex flex-wrap items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-emerald-400" /> Interactive Floor Plan Editor
            </h3>
            <p className="text-xs text-slate-400">Click & position tables, modify seat counts, block tables, or add architectural features.</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-emerald-900/30"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedSuccess ? 'Layout Saved!' : 'Save Floor Plan'}
          </button>
        </div>

        {/* Canvas Display */}
        <div className="relative w-full h-[600px] bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <svg viewBox="0 0 1000 700" className="w-full h-full">
            {/* Grid */}
            <defs>
              <pattern id="editorGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="700" fill="#0b0f19" />
            <rect width="1000" height="700" fill="url(#editorGrid)" />

            {/* Elements */}
            {elements.map((el) => {
              const ex = (el.x / 100) * 1000;
              const ey = (el.y / 100) * 700;
              const ew = (el.width / 100) * 1000;
              const eh = (el.height / 100) * 700;
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="6" />
                  <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#94a3b8" fontSize="12" textAnchor="middle">
                    {el.label}
                  </text>
                </g>
              );
            })}

            {/* Tables */}
            {tables.map((t) => {
              const tx = (t.x / 100) * 1000;
              const ty = (t.y / 100) * 700;
              const tw = (t.width / 100) * 1000;
              const th = (t.height / 100) * 700;

              const isSelected = selectedTable?.id === t.id;

              const bgColor = t.status === 'blocked' ? '#64748b' : isSelected ? '#4f46e5' : '#10b981';

              return (
                <g
                  key={t.id}
                  onClick={() => handleSelectTable(t)}
                  className="cursor-pointer"
                >
                  {isSelected && (
                    <rect
                      x={tx - 6}
                      y={ty - 6}
                      width={tw + 12}
                      height={th + 12}
                      rx={t.shape === 'round' ? '999' : '12'}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                  )}

                  {t.shape === 'round' ? (
                    <circle cx={tx + tw / 2} cy={ty + th / 2} r={tw / 2} fill={bgColor} stroke="#ffffff" strokeWidth="2" />
                  ) : (
                    <rect x={tx} y={ty} width={tw} height={th} rx="8" fill={bgColor} stroke="#ffffff" strokeWidth="2" />
                  )}

                  <text x={tx + tw / 2} y={ty + th / 2 - 2} fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    {t.number}
                  </text>
                  <text x={tx + tw / 2} y={ty + th / 2 + 12} fill="rgba(255,255,255,0.85)" fontSize="10" textAnchor="middle">
                    👤 {t.capacity}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Editor Controls & Inspector Panel (Col 4) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-6">
        {/* Add Elements Palette */}
        <div>
          <div className="flex border-b border-slate-800 pb-3 mb-4 gap-2">
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex-1 py-2 rounded-lg font-medium text-xs transition ${
                activeTab === 'tables' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              + Add Tables
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`flex-1 py-2 rounded-lg font-medium text-xs transition ${
                activeTab === 'elements' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              + Layout Features
            </button>
          </div>

          {activeTab === 'tables' ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddTable('round', 2)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition text-xs"
              >
                <div className="font-bold text-white">Round (2 Guests)</div>
                <div className="text-slate-400 mt-1">Intimate Bistro</div>
              </button>
              <button
                onClick={() => handleAddTable('square', 4)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition text-xs"
              >
                <div className="font-bold text-white">Square (4 Guests)</div>
                <div className="text-slate-400 mt-1">Standard Dining</div>
              </button>
              <button
                onClick={() => handleAddTable('booth', 6)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition text-xs"
              >
                <div className="font-bold text-white">Booth (6 Guests)</div>
                <div className="text-slate-400 mt-1">Comfort Leather</div>
              </button>
              <button
                onClick={() => handleAddTable('rectangle', 8)}
                className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left transition text-xs"
              >
                <div className="font-bold text-white">VIP (8+ Guests)</div>
                <div className="text-slate-400 mt-1">Group Banquet</div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddElement('bar', 'Cocktail Lounge Bar')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left text-xs font-semibold text-white"
              >
                🍸 Cocktail Bar
              </button>
              <button
                onClick={() => handleAddElement('kitchen', 'Kitchen Station')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left text-xs font-semibold text-white"
              >
                👨‍🍳 Kitchen Pass
              </button>
              <button
                onClick={() => handleAddElement('stage', 'Live Music Stage')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left text-xs font-semibold text-white"
              >
                🎷 Live Stage
              </button>
              <button
                onClick={() => handleAddElement('window', 'Glass Wall Window')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 text-left text-xs font-semibold text-white"
              >
                🏙 Window View
              </button>
            </div>
          )}
        </div>

        {/* Selected Table Inspector */}
        {selectedTable ? (
          <div className="border-t border-slate-800 pt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Table Inspector ({selectedTable.number})</h4>
              <button
                onClick={handleDeleteSelectedTable}
                className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 rounded-lg transition"
                title="Delete Table"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Table Number</label>
                <input
                  type="text"
                  value={selectedTable.number}
                  onChange={(e) => handleUpdateSelectedTable({ number: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={selectedTable.capacity}
                    onChange={(e) => handleUpdateSelectedTable({ capacity: parseInt(e.target.value) || 2 })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Status</label>
                  <select
                    value={selectedTable.status}
                    onChange={(e) => handleUpdateSelectedTable({ status: e.target.value as TableStatus })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="booked">🔴 Booked</option>
                    <option value="reserved_soon">🟡 Reserved Soon</option>
                    <option value="blocked">⚪ Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Position Controls */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Position X ({Math.round(selectedTable.x)}%)</label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={selectedTable.x}
                  onChange={(e) => handleUpdateSelectedTable({ x: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Position Y ({Math.round(selectedTable.y)}%)</label>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={selectedTable.y}
                  onChange={(e) => handleUpdateSelectedTable({ y: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-slate-800 pt-6 text-center text-slate-500 text-xs py-8">
            Click any table on the layout canvas to edit its properties, position, or status.
          </div>
        )}
      </div>
    </div>
  );
};
