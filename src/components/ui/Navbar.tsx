'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, LayoutGrid, CalendarCheck, BarChart3, Settings, Activity, Sparkles, User, LogOut, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAdminRoute = pathname?.startsWith('/admin');

  const customerLinks = [
    { href: '/', label: 'Explore Restaurants', icon: UtensilsCrossed },
    { href: '/restaurants/rest-1', label: 'Floor Plan View', icon: LayoutGrid },
    { href: '/my-bookings', label: 'My Bookings & QR Pass', icon: CalendarCheck }
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Monitor', icon: Activity },
    { href: '/admin/editor', label: 'Floor Editor', icon: Settings },
    { href: '/admin/reservations', label: 'Live Reservations', icon: CalendarCheck },
    { href: '/admin/analytics', label: 'Heatmap & Metrics', icon: BarChart3 }
  ];

  const links = isAdminRoute ? adminLinks : customerLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={isAdminRoute ? '/admin/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Table<span className="text-emerald-400">Vibe</span>
              {isAdminRoute && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md border border-indigo-500/30 font-bold ml-1">ADMIN PORTAL</span>}
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Graphical Floor Plan System</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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

        {/* User Details & Portal Switcher */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                <div className="text-[10px] text-emerald-400 font-semibold capitalize mt-0.5">{user.role} Account</div>
              </div>
              <button
                onClick={logout}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition"
            >
              <User className="w-4 h-4" /> Sign In
            </Link>
          )}

          {/* Quick Mode Switcher */}
          {!isAdminRoute ? (
            <Link
              href="/admin/dashboard"
              className="hidden sm:flex items-center gap-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 px-3 py-2 rounded-xl text-xs font-bold transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 px-3 py-2 rounded-xl text-xs font-bold transition"
            >
              <UtensilsCrossed className="w-3.5 h-3.5" /> Customer View
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
