export type TableStatus = 'available' | 'booked' | 'reserved_soon' | 'blocked';

export type TableShape = 'round' | 'square' | 'rectangle' | 'booth' | 'bar_stool';

export type ElementType = 'wall' | 'door' | 'kitchen' | 'bar' | 'restroom' | 'stage' | 'window' | 'plants';

export interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  tableId: string;
  tableNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  date: string;
  timeSlot: string;
  specialRequests: string[];
  totalPaid: number;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  qrCode?: string;
  createdAt: string;
}

export interface TableItem {
  id: string;
  number: string;
  capacity: number;
  shape: TableShape;
  x: number; // percentage 0-100 or grid coordinate
  y: number; // percentage 0-100 or grid coordinate
  width: number;
  height: number;
  rotation: number; // 0, 45, 90, etc.
  status: TableStatus;
  sectionId: string;
  sectionName: string;
  features: string[];
  minimumSpend?: number;
  reservedTime?: string;
}

export interface FloorElement {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface FloorSection {
  id: string;
  name: string;
  description: string;
}

export interface FloorLayout {
  id: string;
  restaurantId: string;
  name: string;
  sections: FloorSection[];
  tables: TableItem[];
  elements: FloorElement[];
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  priceRange: '$$' | '$$$' | '$$$$';
  image: string;
  address: string;
  openingHours: string;
  phone: string;
  floors: FloorLayout[];
  tags: string[];
}

export interface AIRecommendationRequest {
  restaurantId: string;
  guestCount: number;
  vibe: 'romantic' | 'quiet' | 'window' | 'party' | 'bar' | 'family';
  timeSlot: string;
}

export interface AIRecommendationResult {
  recommendedTableIds: string[];
  reason: string;
  topPickId: string;
}
