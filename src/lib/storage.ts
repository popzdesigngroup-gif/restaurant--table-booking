import { Restaurant, Reservation, TableItem } from './types';
import { INITIAL_RESTAURANTS, INITIAL_RESERVATIONS } from './mockData';
import { supabase } from './supabase';

const RESTAURANTS_KEY = 'tablevibe_restaurants';
const RESERVATIONS_KEY = 'tablevibe_reservations';

export const getStoredRestaurants = (): Restaurant[] => {
  if (typeof window === 'undefined') return INITIAL_RESTAURANTS;
  const stored = localStorage.getItem(RESTAURANTS_KEY);
  if (!stored) {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
    return INITIAL_RESTAURANTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_RESTAURANTS;
  }
};

export const getStoredRestaurantById = (id: string): Restaurant | undefined => {
  const list = getStoredRestaurants();
  return list.find((r) => r.id === id);
};

export const updateStoredRestaurant = (updated: Restaurant): void => {
  if (typeof window === 'undefined') return;
  const list = getStoredRestaurants();
  const index = list.findIndex((r) => r.id === updated.id);
  if (index !== -1) {
    list[index] = updated;
  } else {
    list.push(updated);
  }
  localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(list));

  if (supabase) {
    Promise.resolve(
      supabase.from('restaurants').upsert({
        id: updated.id,
        name: updated.name,
        payload: updated
      })
    ).catch(err => console.warn('Supabase sync warning:', err));
  }
};

export const getStoredReservations = (): Reservation[] => {
  if (typeof window === 'undefined') return INITIAL_RESERVATIONS;
  const stored = localStorage.getItem(RESERVATIONS_KEY);
  if (!stored) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(INITIAL_RESERVATIONS));
    return INITIAL_RESERVATIONS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_RESERVATIONS;
  }
};

// Isolated retrieval: get reservations belonging ONLY to specific user email
export const getStoredReservationsForUser = (userEmail?: string): Reservation[] => {
  const all = getStoredReservations();
  if (!userEmail) return [];
  return all.filter((r) => r.guestEmail?.toLowerCase() === userEmail.toLowerCase());
};

// Check if a table is already booked for a specific date and timeSlot
export const isTableBookedAtSlot = (tableId: string, date: string, timeSlot: string): boolean => {
  const all = getStoredReservations();
  return all.some(
    (r) =>
      r.tableId === tableId &&
      r.date === date &&
      r.timeSlot === timeSlot &&
      r.status !== 'cancelled'
  );
};

export const saveReservation = (res: Omit<Reservation, 'id' | 'createdAt' | 'qrCode'>): Reservation => {
  const reservations = getStoredReservations();

  // Check overlap conflict
  const isConflict = isTableBookedAtSlot(res.tableId, res.date, res.timeSlot);
  if (isConflict) {
    throw new Error(`Table ${res.tableNumber} is already booked for ${res.date} at ${res.timeSlot}. Please choose another time or date.`);
  }

  const newId = `res-${Date.now()}`;
  const qrCode = `TVB-${newId.toUpperCase()}-${res.tableNumber}`;

  const newReservation: Reservation = {
    ...res,
    id: newId,
    qrCode,
    createdAt: new Date().toISOString()
  };

  reservations.unshift(newReservation);
  if (typeof window !== 'undefined') {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }

  if (supabase) {
    Promise.resolve(
      supabase.from('reservations').insert({
        id: newId,
        restaurant_id: res.restaurantId,
        table_number: res.tableNumber,
        guest_name: res.guestName,
        guest_email: res.guestEmail,
        date: res.date,
        time_slot: res.timeSlot,
        status: res.status,
        qr_code: qrCode,
        payload: newReservation
      })
    ).catch(err => console.warn('Supabase reservation sync warning:', err));
  }

  // Update table status in restaurant layout
  const restaurant = getStoredRestaurantById(res.restaurantId);
  if (restaurant && restaurant.floors.length > 0) {
    for (const floor of restaurant.floors) {
      const targetTable = floor.tables.find(t => t.id === res.tableId);
      if (targetTable) {
        targetTable.status = 'booked';
        targetTable.reservedTime = res.timeSlot;
        updateStoredRestaurant(restaurant);
        break;
      }
    }
  }

  return newReservation;
};
