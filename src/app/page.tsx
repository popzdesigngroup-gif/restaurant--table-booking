'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { getStoredRestaurants } from '@/lib/storage';
import { Restaurant } from '@/lib/types';
import { Search, Calendar, Clock, Users, Star, MapPin, Sparkles, LayoutGrid, QrCode, ShieldCheck, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    setRestaurants(getStoredRestaurants());
  }, []);

  const tags = ['All', 'Rooftop View', 'Romantic', 'Live Jazz', 'Prime Steak', 'Teppanyaki Live'];

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || selectedTag === 'All' || r.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Graphical Table Reservation System
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find & Reserve Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Exact Table</span> on the Floor Plan
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Don't settle for random seating. Preview live 2D/3D floor layouts, choose your preferred window or booth seat, and book instantly.
          </p>

          {/* Interactive Search Bar */}
          <div className="mt-10 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Restaurant / Cuisine</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Lumina Rooftop"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Date</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="bg-transparent text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Guests</label>
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                <Users className="w-4 h-4 text-slate-400" />
                <select className="bg-transparent text-xs text-white focus:outline-none w-full">
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="8">8+ Guests</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <Link
                href="/restaurants/rest-1"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
              >
                Search Floor Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive Floor Plans</h3>
            <p className="text-xs text-slate-400 mt-2">
              Visually select tables with live status color codes: 🟢 Available, 🔴 Booked, 🟡 Reserved Soon, or ⚪ Maintenance.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Table Concierge</h3>
            <p className="text-xs text-slate-400 mt-2">
              Matches your specific vibe—from romantic candlelit window spots to quiet alcoves for private dining.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Contactless QR Passes</h3>
            <p className="text-xs text-slate-400 mt-2">
              Receive an instant digital pass with a QR code for quick check-in upon arrival at the restaurant.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Showcase */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Restaurants</h2>
            <p className="text-xs text-slate-400 mt-1">Browse restaurants with graphical floor plan booking enabled</p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  (selectedTag === tag || (!selectedTag && tag === 'All'))
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {restaurant.rating} ({restaurant.reviewsCount})
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-slate-200 border border-slate-800">
                    {restaurant.priceRange} • {restaurant.cuisine}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition">{restaurant.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{restaurant.tagline}</p>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{restaurant.address}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {restaurant.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-800">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/restaurants/${restaurant.id}`}
                  className="w-full bg-slate-800 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 group-hover:bg-emerald-600"
                >
                  View Floor Layout & Select Table <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
