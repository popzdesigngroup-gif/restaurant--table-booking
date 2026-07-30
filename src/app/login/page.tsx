'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { UtensilsCrossed, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login, signUp } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup') {
      const newUser = signUp(email, password, name);
      router.push('/');
    } else {
      const loggedUser = login(email, password, name);
      if (loggedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (loggedUser.role === 'manager') {
        router.push('/admin/editor');
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-16 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-950/50">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'signin' ? 'Sign in to manage your table reservations & passes.' : 'Join TableVibe to pick exact restaurant floor tables.'}
          </p>
        </div>

        {/* Clean Standard Login Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Full Name</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl">
                  <User className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none w-full"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1">Email Address</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl">
                <Mail className="w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-slate-400 font-semibold">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="text-[11px] text-emerald-400 hover:underline">
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl">
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
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 mt-2"
            >
              {mode === 'signin' ? 'Sign In to Account' : 'Create Customer Account'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle Sign In / Sign Up Mode */}
          <div className="border-t border-slate-800 pt-4 text-center text-xs text-slate-400">
            {mode === 'signin' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign Up Free
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-emerald-400 hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
