'use client';

import React, { useState, useEffect } from 'react';
import { TableItem, Reservation } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { X, Calendar, Clock, Users, CreditCard, Sparkles, CheckCircle2, ShieldCheck, Heart, Wine } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveReservation } from '@/lib/storage';
import { QRCodeModal } from '@/components/ui/QRCodeModal';

interface TableModalProps {
  table: TableItem;
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
  onReservationComplete: (res: Reservation) => void;
}

export const TableModal: React.FC<TableModalProps> = ({
  table,
  restaurantId,
  restaurantName,
  onClose,
  onReservationComplete
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'details' | 'checkout' | 'success'>('details');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('7:30 PM');
  const [guestCount, setGuestCount] = useState(Math.min(table.capacity, 2));

  // Form Fields prefilled from logged-in user
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone) setGuestPhone(user.phone);
    }
  }, [user]);

  const availableSlots = ['5:00 PM', '5:45 PM', '6:30 PM', '7:15 PM', '8:00 PM', '8:45 PM', '9:30 PM'];
  const specialOptions = [
    '🎂 Birthday Decoration ($15)',
    '🥂 Champagne Toast ($35)',
    '🕯 Romantic Candle Setup',
    '👶 High Chair Needed',
    '🔇 Quiet Corner Request'
  ];

  const toggleRequest = (opt: string) => {
    if (selectedRequests.includes(opt)) {
      setSelectedRequests(selectedRequests.filter((r) => r !== opt));
    } else {
      setSelectedRequests([...selectedRequests, opt]);
    }
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert('Please fill out your contact details to proceed.');
      return;
    }
    setStep('checkout');
  };

  const handleFinalizeBooking = () => {
    const newRes = saveReservation({
      restaurantId,
      restaurantName,
      tableId: table.id,
      tableNumber: table.number,
      guestName,
      guestEmail,
      guestPhone,
      guestCount,
      date,
      timeSlot,
      specialRequests: selectedRequests,
      totalPaid: table.minimumSpend || 0,
      status: 'confirmed'
    });

    setConfirmedReservation(newRes);
    setStep('success');

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    onReservationComplete(newRes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {table.sectionName}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Table {table.number} Booking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {step === 'details' && (
            <form onSubmit={handleProceedToCheckout} className="space-y-6">
              {/* Table Info Specs */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center">
                <div>
                  <div className="text-xs text-slate-400">Capacity</div>
                  <div className="text-base font-bold text-white mt-0.5">Up to {table.capacity} Guests</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Table Style</div>
                  <div className="text-base font-bold text-white capitalize mt-0.5">{table.shape}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Min. Deposit</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {table.minimumSpend ? `$${table.minimumSpend}` : 'Free'}
                  </div>
                </div>
              </div>

              {/* Tags / Features */}
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-2">Table Highlights</label>
                <div className="flex flex-wrap gap-2">
                  {table.features.map((f, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700">
                      ✨ {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-400" /> Reservation Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" /> Party Size
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {Array.from({ length: table.capacity }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> Available Time Slots
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        timeSlot === slot
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-900/40'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Details Form (Pre-filled) */}
              <div className="space-y-3 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Guest Information</h4>
                  {user && <span className="text-[10px] text-emerald-400 font-semibold">✓ Auto-filled from profile</span>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Special Addons */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">Special Enhancements</label>
                <div className="grid grid-cols-2 gap-2">
                  {specialOptions.map((opt) => {
                    const isSelected = selectedRequests.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleRequest(opt)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 text-sm"
              >
                Proceed to Book Table {table.number} &rarr;
              </button>
            </form>
          )}

          {step === 'checkout' && (
            <div className="space-y-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                <h3 className="font-bold text-white text-base">Booking Summary</h3>
                <div className="flex justify-between text-slate-300">
                  <span>Restaurant</span>
                  <span className="font-medium text-white">{restaurantName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Table</span>
                  <span className="font-medium text-emerald-400">Table {table.number} ({table.sectionName})</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Date & Time</span>
                  <span className="font-medium text-white">{date} at {timeSlot}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Guest</span>
                  <span className="font-medium text-white">{guestName} ({guestPhone})</span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-base text-white">
                  <span>Total Deposit</span>
                  <span className="text-emerald-400">{table.minimumSpend ? `$${table.minimumSpend}.00` : 'FREE (No Deposit)'}</span>
                </div>
              </div>

              {/* Simulated Payment */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Confirm Payment & Reserve
                </h4>

                <button
                  onClick={handleFinalizeBooking}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 text-sm mt-4"
                >
                  <ShieldCheck className="w-5 h-5" /> Confirm & Generate QR Reservation Pass
                </button>
              </div>
            </div>
          )}

          {step === 'success' && confirmedReservation && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Reservation Confirmed!</h3>
                <p className="text-sm text-slate-300 mt-1">
                  We look forward to welcoming you, <span className="text-white font-bold">{confirmedReservation.guestName}</span>.
                </p>
              </div>

              {/* QR Code Pass */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-sm mx-auto shadow-inner flex flex-col items-center">
                <QRCodeModal value={confirmedReservation.qrCode || confirmedReservation.id} />
                <div className="mt-4 text-xs text-slate-400">
                  Reservation Pass: <span className="font-mono text-emerald-400 font-bold">{confirmedReservation.qrCode}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Show this QR code upon entry for instant check-in.</div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  Close Window
                </button>
                <a
                  href="/my-bookings"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  View My Bookings
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
