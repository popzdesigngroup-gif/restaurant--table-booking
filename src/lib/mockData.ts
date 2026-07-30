import { Restaurant, Reservation } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Lumina Rooftop & Bistro',
    tagline: 'Modern Italian Dining with Panoramic City Views',
    cuisine: 'Italian & Fusion',
    rating: 4.9,
    reviewsCount: 328,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    address: '450 Grand Avenue, Sky Tower Floor 42, Downtown',
    openingHours: '5:00 PM - 11:30 PM Daily',
    phone: '+1 (555) 392-8810',
    tags: ['Rooftop View', 'Romantic', 'Fine Dining', 'Live Jazz'],
    floors: [
      {
        id: 'floor-main',
        restaurantId: 'rest-1',
        name: 'Main Panoramic Dining Hall',
        sections: [
          { id: 'sec-window', name: 'Skyline Window Row', description: 'Breathtaking floor-to-ceiling city views' },
          { id: 'sec-main', name: 'Central Lounge', description: 'Cozy booths and intimate table setups' },
          { id: 'sec-terrace', name: 'Al Fresco Terrace', description: 'Open air dining under starlit skies' },
          { id: 'sec-vip', name: 'Executive VIP Suite', description: 'Private alcove for large groups' }
        ],
        tables: [
          // Window seats (Left wall)
          {
            id: 't-1',
            number: 'W-01',
            capacity: 2,
            shape: 'round',
            x: 12,
            y: 18,
            width: 8,
            height: 8,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-window',
            sectionName: 'Skyline Window Row',
            features: ['Panoramic View', 'Romantic Spot', 'Quiet Area'],
            minimumSpend: 50
          },
          {
            id: 't-2',
            number: 'W-02',
            capacity: 2,
            shape: 'round',
            x: 12,
            y: 34,
            width: 8,
            height: 8,
            rotation: 0,
            status: 'booked',
            sectionId: 'sec-window',
            sectionName: 'Skyline Window Row',
            features: ['Panoramic View', 'Romantic Spot', 'Soft Lighting'],
            reservedTime: '7:30 PM'
          },
          {
            id: 't-3',
            number: 'W-03',
            capacity: 4,
            shape: 'square',
            x: 12,
            y: 52,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-window',
            sectionName: 'Skyline Window Row',
            features: ['Panoramic View', 'Spacious Seating', 'Sunset Sightline']
          },
          {
            id: 't-4',
            number: 'W-04',
            capacity: 4,
            shape: 'square',
            x: 12,
            y: 72,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'reserved_soon',
            sectionId: 'sec-window',
            sectionName: 'Skyline Window Row',
            features: ['Panoramic View', 'Corner Privacy'],
            reservedTime: '8:15 PM'
          },

          // Central Lounge Booths (Center)
          {
            id: 't-5',
            number: 'B-10',
            capacity: 6,
            shape: 'booth',
            x: 36,
            y: 22,
            width: 14,
            height: 12,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-main',
            sectionName: 'Central Lounge',
            features: ['Plush Leather Booth', 'Great Acoustics', 'Near Bar']
          },
          {
            id: 't-6',
            number: 'B-11',
            capacity: 6,
            shape: 'booth',
            x: 36,
            y: 42,
            width: 14,
            height: 12,
            rotation: 0,
            status: 'booked',
            sectionId: 'sec-main',
            sectionName: 'Central Lounge',
            features: ['Plush Leather Booth', 'Group Favorite'],
            reservedTime: '6:45 PM'
          },
          {
            id: 't-7',
            number: 'T-12',
            capacity: 4,
            shape: 'rectangle',
            x: 36,
            y: 64,
            width: 12,
            height: 9,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-main',
            sectionName: 'Central Lounge',
            features: ['Central Location', 'High Chairs Available']
          },
          {
            id: 't-8',
            number: 'T-13',
            capacity: 2,
            shape: 'square',
            x: 36,
            y: 80,
            width: 8,
            height: 8,
            rotation: 0,
            status: 'blocked',
            sectionId: 'sec-main',
            sectionName: 'Central Lounge',
            features: ['Maintenance']
          },

          // Al Fresco Terrace (Right top)
          {
            id: 't-9',
            number: 'TR-01',
            capacity: 4,
            shape: 'round',
            x: 68,
            y: 18,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-terrace',
            sectionName: 'Al Fresco Terrace',
            features: ['Open Air Sky View', 'Heated Lamp', 'Romantic spot']
          },
          {
            id: 't-10',
            number: 'TR-02',
            capacity: 4,
            shape: 'round',
            x: 84,
            y: 18,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-terrace',
            sectionName: 'Al Fresco Terrace',
            features: ['Open Air Sky View', 'Heated Lamp']
          },
          {
            id: 't-11',
            number: 'TR-03',
            capacity: 2,
            shape: 'round',
            x: 76,
            y: 35,
            width: 8,
            height: 8,
            rotation: 0,
            status: 'reserved_soon',
            sectionId: 'sec-terrace',
            sectionName: 'Al Fresco Terrace',
            features: ['Breeze View', 'Intimate Lighting'],
            reservedTime: '8:00 PM'
          },

          // VIP Private Room (Right bottom)
          {
            id: 't-12',
            number: 'VIP-01',
            capacity: 10,
            shape: 'rectangle',
            x: 72,
            y: 65,
            width: 18,
            height: 12,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-vip',
            sectionName: 'Executive VIP Suite',
            features: ['Private Sommelier', 'Acoustic Soundproofing', 'Custom Lighting'],
            minimumSpend: 250
          }
        ],
        elements: [
          { id: 'el-win', type: 'window', label: 'Panoramic Glass Wall', x: 2, y: 10, width: 2, height: 75 },
          { id: 'el-ent', type: 'door', label: 'Main Entrance', x: 45, y: 92, width: 12, height: 4 },
          { id: 'el-bar', type: 'bar', label: 'Cocktail & Wine Bar', x: 60, y: 46, width: 34, height: 10 },
          { id: 'el-kit', type: 'kitchen', label: 'Open Kitchen & Pass', x: 30, y: 2, width: 30, height: 8 },
          { id: 'el-stage', type: 'stage', label: 'Live Jazz Stage', x: 68, y: 2, width: 26, height: 10 },
          { id: 'el-wc', type: 'restroom', label: 'Restrooms', x: 5, y: 90, width: 14, height: 7 }
        ]
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Smoketree Prime Steakhouse',
    tagline: 'Premium Aged Cuts & Craft Spirits',
    cuisine: 'American Steakhouse',
    rating: 4.8,
    reviewsCount: 215,
    priceRange: '$$$$',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    address: '120 Market Street, Financial District',
    openingHours: '4:30 PM - 10:30 PM Daily',
    phone: '+1 (555) 839-2041',
    tags: ['Prime Steak', 'Wine Cellar', 'Private Dining', 'Whiskey Bar'],
    floors: [
      {
        id: 'floor-ground',
        restaurantId: 'rest-2',
        name: 'Main Dining Floor',
        sections: [
          { id: 'sec-cellar', name: 'Wine Cellar Vault', description: 'Surrounded by rare vintages' },
          { id: 'sec-main', name: 'Steakhouse Main Hall', description: 'Classic oak tables and leather seating' }
        ],
        tables: [
          {
            id: 'st-1',
            number: 'T-01',
            capacity: 4,
            shape: 'square',
            x: 18,
            y: 20,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-main',
            sectionName: 'Steakhouse Main Hall',
            features: ['Near Fireplace', 'Oak Table']
          },
          {
            id: 'st-2',
            number: 'T-02',
            capacity: 4,
            shape: 'square',
            x: 18,
            y: 40,
            width: 10,
            height: 10,
            rotation: 0,
            status: 'booked',
            sectionId: 'sec-main',
            sectionName: 'Steakhouse Main Hall',
            features: ['Oak Table']
          },
          {
            id: 'st-3',
            number: 'WC-01',
            capacity: 6,
            shape: 'round',
            x: 65,
            y: 25,
            width: 14,
            height: 14,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-cellar',
            sectionName: 'Wine Cellar Vault',
            features: ['Sommelier Service', 'Wine Cellar View', 'Quiet']
          },
          {
            id: 'st-4',
            number: 'WC-02',
            capacity: 8,
            shape: 'rectangle',
            x: 65,
            y: 55,
            width: 16,
            height: 12,
            rotation: 0,
            status: 'reserved_soon',
            sectionId: 'sec-cellar',
            sectionName: 'Wine Cellar Vault',
            features: ['Private Tasting Setup', 'Large Group']
          }
        ],
        elements: [
          { id: 'el-bar', type: 'bar', label: 'Bourbon & Cocktail Bar', x: 15, y: 70, width: 40, height: 12 },
          { id: 'el-kit', type: 'kitchen', label: 'Wood-Fired Grill', x: 2, y: 2, width: 35, height: 10 }
        ]
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Sakura Garden Teppanyaki',
    tagline: 'Authentic Japanese Cuisine & Garden Ambience',
    cuisine: 'Japanese & Teppanyaki',
    rating: 4.9,
    reviewsCount: 412,
    priceRange: '$$$',
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80',
    address: '88 Lotus Lane, Zen District',
    openingHours: '12:00 PM - 10:00 PM Daily',
    phone: '+1 (555) 948-1122',
    tags: ['Teppanyaki Live', 'Japanese Garden', 'Sushi Bar', 'Sake Flight'],
    floors: [
      {
        id: 'floor-zen',
        restaurantId: 'rest-3',
        name: 'Zen Garden Floor',
        sections: [
          { id: 'sec-teppan', name: 'Live Teppanyaki Grill', description: 'Chef table live culinary performance' },
          { id: 'sec-garden', name: 'Garden Courtyard', description: 'Tranquil koi pond view' }
        ],
        tables: [
          {
            id: 'sk-1',
            number: 'TEP-1',
            capacity: 8,
            shape: 'rectangle',
            x: 20,
            y: 25,
            width: 18,
            height: 14,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-teppan',
            sectionName: 'Live Teppanyaki Grill',
            features: ['Live Chef Performance', 'Interactive Dining']
          },
          {
            id: 'sk-2',
            number: 'TEP-2',
            capacity: 8,
            shape: 'rectangle',
            x: 20,
            y: 55,
            width: 18,
            height: 14,
            rotation: 0,
            status: 'booked',
            sectionId: 'sec-teppan',
            sectionName: 'Live Teppanyaki Grill',
            features: ['Live Chef Performance']
          },
          {
            id: 'sk-3',
            number: 'G-01',
            capacity: 4,
            shape: 'round',
            x: 65,
            y: 30,
            width: 12,
            height: 12,
            rotation: 0,
            status: 'available',
            sectionId: 'sec-garden',
            sectionName: 'Garden Courtyard',
            features: ['Koi Pond View', 'Cherry Blossom Backdrop', 'Quiet']
          }
        ],
        elements: [
          { id: 'el-pond', type: 'plants', label: 'Zen Koi Pond & Garden', x: 60, y: 60, width: 30, height: 25 },
          { id: 'el-sushi', type: 'bar', label: 'Omakase Sushi Bar', x: 10, y: 80, width: 40, height: 10 }
        ]
      }
    ]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    restaurantId: 'rest-1',
    restaurantName: 'Lumina Rooftop & Bistro',
    tableId: 't-2',
    tableNumber: 'W-02',
    guestName: 'Alexander Wright',
    guestEmail: 'alex.wright@example.com',
    guestPhone: '+1 555 234 5678',
    guestCount: 2,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '7:30 PM',
    specialRequests: ['Anniversary Celebration', 'Champagne Toast', 'Window seat preference'],
    totalPaid: 50.00,
    status: 'confirmed',
    qrCode: 'TVB-RES-101-W02',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'res-102',
    restaurantId: 'rest-1',
    restaurantName: 'Lumina Rooftop & Bistro',
    tableId: 't-6',
    tableNumber: 'B-11',
    guestName: 'Sophia Martinez',
    guestEmail: 'sophia.m@example.com',
    guestPhone: '+1 555 987 6543',
    guestCount: 5,
    date: new Date().toISOString().split('T')[0],
    timeSlot: '6:45 PM',
    specialRequests: ['Birthday Cake setup', 'High chair for toddler'],
    totalPaid: 100.00,
    status: 'seated',
    qrCode: 'TVB-RES-102-B11',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
