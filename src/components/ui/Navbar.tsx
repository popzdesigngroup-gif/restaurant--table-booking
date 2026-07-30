'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed, LayoutGrid, CalendarCheck, BarChart3, Settings, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Explore', icon: UtensilsCrossed },
    { href: '/restaurants/rest-1', label: 'Floor Plan View', icon: LayoutGrid },
    { href: '/my-bookings', label: 'My Bookings', icon: CalendarCheck },
    { href: '/admin/editor', label: 'Owner Floor Editor', icon: Settings },
    { href: '/admin/reservations', label: 'Live Manager', icon: CalendarCheck },
    { href: '/admin/analytics', label: 'Analytics & Heatmap', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Table<span className="text-emerald-400">Vibe</span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Interactive Floor Reservations</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/restaurants/rest-1"
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/40"
          >
            <Sparkles className="w-3.5 h-3.5" /> Select Table Now
          </Link>
        </div>
      </div>
    </header>
  );
};
