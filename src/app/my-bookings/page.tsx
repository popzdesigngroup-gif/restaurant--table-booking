'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { getStoredReservations } from '@/lib/storage';
import { Reservation } from '@/lib/types';
import { QRCodeModal } from '@/components/ui/QRCodeModal';
import { CalendarCheck, QrCode, Clock, MapPin, Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedQR, setSelectedQR] = useState<Reservation | null>(null);

  useEffect(() => {
    setReservations(getStoredReservations());
  }, []);

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'seated':
        return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Currently Seated</span>;
      case 'completed':
        return <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold">Completed</span>;
      case 'cancelled':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <CalendarCheck className="w-8 h-8 text-emerald-400" /> My Table Reservations
            </h1>
            <p className="text-sm text-slate-400 mt-1">View your confirmed table bookings, access QR check-in passes, or manage dates.</p>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center space-y-4">
            <CalendarCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Active Reservations</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't reserved any tables yet. Browse restaurants and pick your exact table on the floor plan!
            </p>
            <a
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition"
            >
              Explore Restaurants &rarr;
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{res.restaurantName}</h3>
                    {getStatusBadge(res.status)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                    <span className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-bold text-emerald-400">
                      Table {res.tableNumber}
                    </span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {res.date} at {res.timeSlot}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400" /> {res.guestCount} Guests</span>
                  </div>

                  {res.specialRequests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {res.specialRequests.map((req, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-950 text-indigo-300 px-2.5 py-0.5 rounded-md border border-indigo-900/40">
                          ✨ {req}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400">
                    Reserved for <span className="text-white font-semibold">{res.guestName}</span> ({res.guestEmail})
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => setSelectedQR(res)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-950/40"
                  >
                    <QrCode className="w-4 h-4" /> View QR Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Pass Modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Contactless QR Entry Pass</h3>
            <p className="text-xs text-slate-400">Present this QR code to the host upon arrival at {selectedQR.restaurantName}.</p>

            <div className="flex justify-center my-4">
              <QRCodeModal value={selectedQR.qrCode || selectedQR.id} />
            </div>

            <div className="text-xs font-mono text-emerald-400 font-bold bg-slate-950 py-2 rounded-lg border border-slate-800">
              {selectedQR.qrCode}
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Table {selectedQR.tableNumber} • {selectedQR.guestCount} Guests</div>
              <div>{selectedQR.date} at {selectedQR.timeSlot}</div>
            </div>

            <button
              onClick={() => setSelectedQR(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-semibold transition mt-2"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
