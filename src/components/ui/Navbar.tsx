'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UtensilsCrossed, LayoutGrid, CalendarCheck, BarChart3, Settings, Activity, User, LogOut, ShieldCheck, Flame } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userRole = user?.role || 'customer';

  const customerLinks = [
    { href: '/', label: 'Explore Restaurants', icon: UtensilsCrossed },
    { href: '/restaurants/rest-1', label: 'Floor Plan View', icon: LayoutGrid },
    { href: '/my-bookings', label: 'My Bookings & QR Pass', icon: CalendarCheck }
  ];

  const managerLinks = [
    { href: '/admin/editor', label: 'Floor Layout Editor', icon: Settings },
    { href: '/admin/reservations', label: 'Table Allocation & QR', icon: CalendarCheck },
    { href: '/restaurants/rest-1', label: 'Floor Layout View', icon: LayoutGrid }
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Telemetry Monitor', icon: Activity },
    { href: '/admin/analytics', label: 'Heatmap & Metrics', icon: Flame },
    { href: '/admin/editor', label: 'Floor Layout Editor', icon: Settings },
    { href: '/admin/reservations', label: 'Table Allocation & QR', icon: CalendarCheck }
  ];

  const links = userRole === 'admin' ? adminLinks : userRole === 'manager' ? managerLinks : customerLinks;

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href={userRole === 'admin' ? '/admin/dashboard' : userRole === 'manager' ? '/admin/editor' : '/'}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
              Table<span className="text-emerald-400">Vibe</span>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-md border font-bold uppercase ml-1 ${
                  userRole === 'admin'
                    ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    : userRole === 'manager'
                    ? 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {userRole} level
              </span>
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Graphical Table Reservation System</span>
          </div>
        </Link>

        {/* Dynamic Navigation Links based on 3 Roles */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? userRole === 'admin'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : userRole === 'manager'
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Badge & Logout */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white leading-none">{user.name}</div>
                <div
                  className={`text-[10px] font-semibold capitalize mt-0.5 ${
                    userRole === 'admin'
                      ? 'text-indigo-400'
                      : userRole === 'manager'
                      ? 'text-teal-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {userRole} Account
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 text-xs font-semibold transition"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/40"
            >
              <User className="w-4 h-4" /> Sign In / Select Role
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
