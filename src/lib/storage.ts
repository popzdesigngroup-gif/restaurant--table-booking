import { Restaurant, Reservation, TableItem } from './types';
import { INITIAL_RESTAURANTS, INITIAL_RESERVATIONS } from './mockData';

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
};

export const updateTableStatus = (restaurantId: string, floorId: string, tableId: string, status: TableItem['status']): void => {
  const restaurant = getStoredRestaurantById(restaurantId);
  if (!restaurant) return;

  const floor = restaurant.floors.find(f => f.id === floorId);
  if (!floor) return;

  const table = floor.tables.find(t => t.id === tableId);
  if (!table) return;

  table.status = status;
  updateStoredRestaurant(restaurant);
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

export const saveReservation = (res: Omit<Reservation, 'id' | 'createdAt' | 'qrCode'>): Reservation => {
  const reservations = getStoredReservations();
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

  // Also update table status in restaurant layout to 'booked'
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
