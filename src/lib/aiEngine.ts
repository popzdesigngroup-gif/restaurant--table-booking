import { TableItem, AIRecommendationResult } from './types';

export const recommendTables = (
  tables: TableItem[],
  guestCount: number,
  vibe: 'romantic' | 'quiet' | 'window' | 'party' | 'bar' | 'family'
): AIRecommendationResult => {
  // Filter available tables with capacity >= guestCount
  const eligible = tables.filter(
    (t) => t.status === 'available' && t.capacity >= guestCount
  );

  if (eligible.length === 0) {
    return {
      recommendedTableIds: [],
      reason: 'No available tables fit your party size directly. Try choosing another time slot or party size.',
      topPickId: ''
    };
  }

  // Calculate score for each table based on vibe matches and capacity fit
  const scored = eligible.map((table) => {
    let score = 0;

    // Capacity fit (favor exact or slight overestimate over way too large)
    const capDiff = table.capacity - guestCount;
    if (capDiff === 0) score += 30;
    else if (capDiff === 1 || capDiff === 2) score += 20;
    else if (capDiff > 4) score -= 10;

    // Feature matching based on vibe
    const lowerFeatures = table.features.map((f) => f.toLowerCase());
    
    switch (vibe) {
      case 'romantic':
        if (lowerFeatures.some((f) => f.includes('romantic') || f.includes('view') || f.includes('lighting') || f.includes('intimate'))) {
          score += 40;
        }
        if (table.shape === 'round') score += 15;
        break;
      case 'window':
        if (lowerFeatures.some((f) => f.includes('view') || f.includes('window') || f.includes('skyline') || f.includes('sunset'))) {
          score += 50;
        }
        break;
      case 'quiet':
        if (lowerFeatures.some((f) => f.includes('quiet') || f.includes('privacy') || f.includes('corner') || f.includes('sommelier'))) {
          score += 45;
        }
        break;
      case 'party':
      case 'family':
        if (table.capacity >= 6 || table.shape === 'booth' || table.shape === 'rectangle') {
          score += 35;
        }
        if (lowerFeatures.some((f) => f.includes('booth') || f.includes('group') || f.includes('spacious'))) {
          score += 25;
        }
        break;
      case 'bar':
        if (lowerFeatures.some((f) => f.includes('bar') || f.includes('cocktail'))) {
          score += 45;
        }
        break;
    }

    return { table, score };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const topPick = scored[0].table;
  const top3 = scored.slice(0, 3).map((s) => s.table.id);

  let reason = '';
  switch (vibe) {
    case 'romantic':
      reason = `Table ${topPick.number} offers intimate lighting, ideal ${topPick.shape} seating, and a cozy atmosphere perfect for couples.`;
      break;
    case 'window':
      reason = `Table ${topPick.number} features prime window placement with sweeping panoramic views and natural sunset lighting.`;
      break;
    case 'quiet':
      reason = `Table ${topPick.number} is tucked away in a low-traffic section for private conversations and focused dining.`;
      break;
    case 'family':
    case 'party':
      reason = `Table ${topPick.number} has ample ${topPick.capacity}-guest capacity and comfortable seating for lively group dining.`;
      break;
    default:
      reason = `Table ${topPick.number} is your best overall match for ${guestCount} guests.`;
  }

  return {
    recommendedTableIds: top3,
    reason,
    topPickId: topPick.id
  };
};
