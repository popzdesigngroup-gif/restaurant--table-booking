'use client';

import React, { useState } from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { ShieldCheck, UserCheck, Settings, Lock, Mail, ArrowRight, UtensilsCrossed, Activity } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [roleTab, setRoleTab] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, roleTab, name);
    if (roleTab === 'admin') {
      router.push('/admin/dashboard');
    } else if (roleTab === 'manager') {
      router.push('/admin/editor');
    } else {
      router.push('/');
    }
  };

  const handleDemoLogin = (targetRole: UserRole) => {
    if (targetRole === 'admin') {
      login('admin@lumina.com', 'admin', 'Super Admin Monitor');
      router.push('/admin/dashboard');
    } else if (targetRole === 'manager') {
      login('manager@lumina.com', 'manager', 'Sarah Jenkins (Floor Manager)');
      router.push('/admin/editor');
    } else {
      login('alex.wright@example.com', 'customer', 'Alex Wright', '+1 (555) 234-5678');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 pt-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-950/50">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">Sign In to TableVibe</h1>
          <p className="text-xs text-slate-400">Select your role level to access tailored operational permissions.</p>
        </div>

        {/* 3 Role Level Selector Tabs */}
        <div className="grid grid-cols-3 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setRoleTab('customer')}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              roleTab === 'customer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Customer
          </button>
          <button
            onClick={() => setRoleTab('manager')}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              roleTab === 'manager'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" /> Manager
          </button>
          <button
            onClick={() => setRoleTab('admin')}
            className={`py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
              roleTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Super Admin
          </button>
        </div>

        {/* Quick Demo Presets for 3 Roles */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Instant Role Presets</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('customer')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white text-xs flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Customer
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Book & view floor</div>
            </button>

            <button
              onClick={() => handleDemoLogin('manager')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white text-xs flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 text-teal-400" /> Manager
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Edit floor & allocate</div>
            </button>

            <button
              onClick={() => handleDemoLogin('admin')}
              className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition flex flex-col justify-between"
            >
              <div className="font-bold text-white text-xs flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-400" /> Super Admin
              </div>
              <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">Full monitoring</div>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {roleTab === 'admin' ? 'Super Admin Credentials' : roleTab === 'manager' ? 'Floor Manager Credentials' : 'Customer Account Credentials'}
            </h3>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
              roleTab === 'admin' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : roleTab === 'manager' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {roleTab} Level
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Full Name</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={roleTab === 'admin' ? 'Super Admin Monitor' : roleTab === 'manager' ? 'Sarah Jenkins' : 'Alex Wright'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Email Address</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl">
              <Mail className="w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder={roleTab === 'admin' ? 'admin@lumina.com' : roleTab === 'manager' ? 'manager@lumina.com' : 'alex@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold block mb-1">Password</label>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2.5 rounded-xl">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none w-full"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full font-bold py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 ${
              roleTab === 'admin'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50'
                : roleTab === 'manager'
                ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            Access {roleTab.toUpperCase()} Portal &rarr;
          </button>
        </form>
      </main>
    </div>
  );
}
