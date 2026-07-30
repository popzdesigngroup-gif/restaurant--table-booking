'use client';

import React, { useState, useRef } from 'react';
import { TableItem, FloorElement, TableStatus } from '@/lib/types';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles, Users, Info, Lock } from 'lucide-react';

interface FloorCanvasProps {
  tables: TableItem[];
  elements: FloorElement[];
  selectedTableId?: string | null;
  recommendedTableIds?: string[];
  onSelectTable: (table: TableItem) => void;
  showHeatmap?: boolean;
}

export const FloorCanvas: React.FC<FloorCanvasProps> = ({
  tables,
  elements,
  selectedTableId,
  recommendedTableIds = [],
  onSelectTable,
  showHeatmap = false
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredTableId, setHoveredTableId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return {
          bg: '#10b981',
          stroke: '#34d399',
          text: '#ffffff',
          shadow: 'rgba(16, 185, 129, 0.4)',
          label: 'Available'
        };
      case 'booked':
        return {
          bg: '#ef4444',
          stroke: '#f87171',
          text: '#ffffff',
          shadow: 'rgba(239, 68, 68, 0.2)',
          label: 'Booked'
        };
      case 'reserved_soon':
        return {
          bg: '#f59e0b',
          stroke: '#fbbf24',
          text: '#ffffff',
          shadow: 'rgba(245, 158, 11, 0.3)',
          label: 'Reserved Soon'
        };
      case 'blocked':
        return {
          bg: '#64748b',
          stroke: '#94a3b8',
          text: '#e2e8f0',
          shadow: 'rgba(100, 116, 139, 0.2)',
          label: 'Maintenance'
        };
    }
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none">
      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/60 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-slate-200 font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
          <span className="text-slate-200 font-medium">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
          <span className="text-slate-200 font-medium">Reserved Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-500" />
          <span className="text-slate-200 font-medium">Maintenance</span>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Floor Plan Grid / Background Texture */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Glowing filter for recommended tables */}
            <filter id="glow-recommended" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="1000" height="700" fill="#090d16" />
          <rect width="1000" height="700" fill="url(#grid)" />

          {/* Render Floor Architectural Elements */}
          {elements.map((el) => {
            const ex = (el.x / 100) * 1000;
            const ey = (el.y / 100) * 700;
            const ew = (el.width / 100) * 1000;
            const eh = (el.height / 100) * 700;

            if (el.type === 'window') {
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#0ea5e9" opacity="0.3" rx="2" />
                  <rect x={ex} y={ey} width={ew} height={eh} stroke="#38bdf8" strokeWidth="2" fill="none" />
                  <text x={ex + ew / 2 + 10} y={ey + eh / 2} fill="#7dd3fc" fontSize="12" textAnchor="middle" transform={`rotate(-90 ${ex + ew / 2 + 10} ${ey + eh / 2})`} fontWeight="bold">
                    {el.label}
                  </text>
                </g>
              );
            }

            if (el.type === 'bar') {
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" rx="12" />
                  <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#a5b4fc" fontSize="14" fontWeight="bold" textAnchor="middle">
                    🍸 {el.label}
                  </text>
                </g>
              );
            }

            if (el.type === 'kitchen') {
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#1f2937" stroke="#f97316" strokeDasharray="4 4" strokeWidth="2" rx="8" />
                  <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#fdba74" fontSize="13" fontWeight="semibold" textAnchor="middle">
                    👨‍🍳 {el.label}
                  </text>
                </g>
              );
            }

            if (el.type === 'stage') {
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#311b92" stroke="#a855f7" strokeWidth="2" rx="8" />
                  <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#e9d5ff" fontSize="13" fontWeight="bold" textAnchor="middle">
                    🎷 {el.label}
                  </text>
                </g>
              );
            }

            if (el.type === 'door') {
              return (
                <g key={el.id}>
                  <rect x={ex} y={ey} width={ew} height={eh} fill="#059669" rx="4" />
                  <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                    🚪 {el.label}
                  </text>
                </g>
              );
            }

            return (
              <g key={el.id}>
                <rect x={ex} y={ey} width={ew} height={eh} fill="#1e293b" rx="6" stroke="#475569" strokeWidth="1" />
                <text x={ex + ew / 2} y={ey + eh / 2 + 4} fill="#94a3b8" fontSize="12" textAnchor="middle">
                  {el.label}
                </text>
              </g>
            );
          })}

          {/* Heatmap overlay option */}
          {showHeatmap &&
            tables.map((t) => {
              const tx = (t.x / 100) * 1000 + (t.width / 100) * 1000 / 2;
              const ty = (t.y / 100) * 700 + (t.height / 100) * 700 / 2;
              const heatColor = t.status === 'booked' ? 'rgba(239,68,68,0.5)' : t.status === 'reserved_soon' ? 'rgba(245,158,11,0.5)' : 'rgba(16,185,129,0.3)';
              return <circle key={`heat-${t.id}`} cx={tx} cy={ty} r="70" fill={heatColor} filter="blur(20px)" />;
            })}

          {/* Render Tables */}
          {tables.map((table) => {
            const tx = (table.x / 100) * 1000;
            const ty = (table.y / 100) * 700;
            const tw = (table.width / 100) * 1000;
            const th = (table.height / 100) * 700;
            const colors = getStatusColor(table.status);

            const isSelected = selectedTableId === table.id;
            const isHovered = hoveredTableId === table.id;
            const isRecommended = recommendedTableIds.includes(table.id);

            const scaleFactor = isHovered ? 1.08 : 1;

            return (
              <g
                key={table.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTable(table);
                }}
                onMouseEnter={() => setHoveredTableId(table.id)}
                onMouseLeave={() => setHoveredTableId(null)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  transformOrigin: `${tx + tw / 2}px ${ty + th / 2}px`,
                  transform: `scale(${scaleFactor})`
                }}
              >
                {/* Recommended glowing pulse background */}
                {isRecommended && (
                  <circle
                    cx={tx + tw / 2}
                    cy={ty + th / 2}
                    r={Math.max(tw, th) * 0.8}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    className="animate-ping"
                    opacity="0.7"
                  />
                )}

                {/* Selection Highlight */}
                {isSelected && (
                  <rect
                    x={tx - 6}
                    y={ty - 6}
                    width={tw + 12}
                    height={th + 12}
                    rx={table.shape === 'round' ? '9999' : '14'}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                )}

                {/* Table Graphic Rendering based on Shape */}
                {table.shape === 'round' ? (
                  <circle
                    cx={tx + tw / 2}
                    cy={ty + th / 2}
                    r={tw / 2}
                    fill={colors.bg}
                    stroke={isSelected ? '#ffffff' : isRecommended ? '#38bdf8' : colors.stroke}
                    strokeWidth={isSelected || isRecommended ? '3' : '2'}
                    filter={isHovered ? `drop-shadow(0 0 12px ${colors.shadow})` : undefined}
                  />
                ) : table.shape === 'booth' ? (
                  <g>
                    <rect
                      x={tx}
                      y={ty}
                      width={tw}
                      height={th}
                      rx="10"
                      fill={colors.bg}
                      stroke={colors.stroke}
                      strokeWidth="2"
                    />
                    {/* Booth backrest detail */}
                    <path
                      d={`M ${tx} ${ty + 4} Q ${tx + tw / 2} ${ty - 4} ${tx + tw} ${ty + 4}`}
                      stroke="#ffffff"
                      strokeWidth="3"
                      fill="none"
                      opacity="0.4"
                    />
                  </g>
                ) : (
                  <rect
                    x={tx}
                    y={ty}
                    width={tw}
                    height={th}
                    rx="10"
                    fill={colors.bg}
                    stroke={isSelected ? '#ffffff' : isRecommended ? '#38bdf8' : colors.stroke}
                    strokeWidth={isSelected || isRecommended ? '3' : '2'}
                    filter={isHovered ? `drop-shadow(0 0 14px ${colors.shadow})` : undefined}
                  />
                )}

                {/* Table Number & Capacity Label */}
                <text
                  x={tx + tw / 2}
                  y={ty + th / 2 - 2}
                  fill={colors.text}
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {table.number}
                </text>

                <text
                  x={tx + tw / 2}
                  y={ty + th / 2 + 12}
                  fill="rgba(255, 255, 255, 0.85)"
                  fontSize="10"
                  fontWeight="medium"
                  textAnchor="middle"
                >
                  👤 {table.capacity}
                </text>

                {/* AI Recommendation Badge */}
                {isRecommended && (
                  <g transform={`translate(${tx + tw - 8}, ${ty - 6})`}>
                    <circle cx="8" cy="8" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="8" y="11" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                      ★
                    </text>
                  </g>
                )}

                {/* Maintenance Lock Badge */}
                {table.status === 'blocked' && (
                  <g transform={`translate(${tx + tw / 2 - 6}, ${ty + th / 2 - 16})`}>
                    <text x="6" y="6" fontSize="12">🔒</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
