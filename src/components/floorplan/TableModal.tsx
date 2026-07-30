'use client';

import React, { useState, useEffect } from 'react';
import { TableItem, Reservation } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { X, Calendar, Clock, Users, CreditCard, Sparkles, CheckCircle2, ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react';
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
  const { user, login } = useAuth();
  const [step, setStep] = useState<'details' | 'checkout' | 'success'>('details');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('7:30 PM');
  const [guestCount, setGuestCount] = useState(Math.min(table.capacity, 2));

  // Form Fields tied to authenticated user profile
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Quick Inline Sign-In state if not signed in
  const [signInEmail, setSignInEmail] = useState('');
  const [signInName, setSignInName] = useState('');

  useEffect(() => {
    if (user) {
      setGuestName(user.name);
      setGuestEmail(user.email);
      setGuestPhone(user.phone || '+1 (555) 234-5678');
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

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) return;
    login(signInEmail, 'customer', signInName || 'Alex Wright');
  };

  const handleQuickDemoCustomerLogin = () => {
    login('alex.wright@example.com', 'customer', 'Alex Wright', '+1 (555) 234-5678');
  };

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to your account first so this reservation is saved for your future reference.');
      return;
    }
    if (!guestName || !guestEmail) {
      alert('Please verify your contact name and email.');
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
      guestName: user?.name || guestName,
      guestEmail: user?.email || guestEmail,
      guestPhone: user?.phone || guestPhone,
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {table.sectionName}
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                🔐 SIGN-IN REQUIRED FOR ACCOUNT REFERENCES
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Reserve Table {table.number}</h2>
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
          {/* REQUIRE SIGN IN CHECK IF NOT LOGGED IN */}
          {!user ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Sign In Required to Reserve Table</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  To save your reservation history, view digital QR passes, and manage future visits, please sign in to your account.
                </p>
              </div>

              {/* Quick Preset Sign In */}
              <button
                type="button"
                onClick={handleQuickDemoCustomerLogin}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" /> Sign In as Alex Wright (Instant 1-Click)
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-wider font-bold">or sign in with email</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Inline Sign-In Form */}
              <form onSubmit={handleInlineLogin} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={signInName}
                    onChange={(e) => setSignInName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Sign In & Continue Booking &rarr;
                </button>
              </form>
            </div>
          ) : (
            <>
              {step === 'details' && (
                <form onSubmit={handleProceedToCheckout} className="space-y-6">
                  {/* Account Badge Indicator */}
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <UserCheck className="w-4 h-4" /> Signed in as {user.name} ({user.email})
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">Account Verified</span>
                  </div>

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

                  {/* Highlights */}
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
                    Proceed to Reserve Table {table.number} &rarr;
                  </button>
                </form>
              )}

              {step === 'checkout' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-sm">
                    <h3 className="font-bold text-white text-base">Booking Summary</h3>
                    <div className="flex justify-between text-slate-300">
                      <span>Account</span>
                      <span className="font-medium text-white">{user.name} ({user.email})</span>
                    </div>
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
                    <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-base text-white">
                      <span>Total Deposit</span>
                      <span className="text-emerald-400">{table.minimumSpend ? `$${table.minimumSpend}.00` : 'FREE (No Deposit)'}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-400" /> Confirm & Issue Account QR Pass
                    </h4>

                    <button
                      onClick={handleFinalizeBooking}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2 text-sm mt-4"
                    >
                      <ShieldCheck className="w-5 h-5" /> Confirm & Save Reservation to Account
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
                      Saved to your account, <span className="text-white font-bold">{confirmedReservation.guestName}</span>. Access it anytime under My Bookings!
                    </p>
                  </div>

                  {/* QR Code Pass */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 max-w-sm mx-auto shadow-inner flex flex-col items-center">
                    <QRCodeModal value={confirmedReservation.qrCode || confirmedReservation.id} />
                    <div className="mt-4 text-xs text-slate-400">
                      Account Pass: <span className="font-mono text-emerald-400 font-bold">{confirmedReservation.qrCode}</span>
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
                      View Account Bookings
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
