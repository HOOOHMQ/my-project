// 类型定义

export interface Destination {
  id: string;
  name: string;
  coordinates: [number, number]; // [纬度, 经度]
  description: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport';
  rating: number;
  estimatedDuration: number; // 预计停留时间（分钟）
  ticketPrice?: number; // 门票价格
  mealPrice?: number; // 餐饮价格
}

export interface BudgetItem {
  category: 'ticket' | 'hotel' | 'restaurant' | 'transport' | 'other';
  name: string;
  amount: number;
  date?: string;
}

export interface ItineraryDay {
  date: string;
  destinations: Destination[];
  budget: BudgetItem[];
}

export interface TripPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  participants: number;
  budgetRange: 'low' | 'medium' | 'high';
  interests: string[];
  accommodationType: 'budget' | 'mid-range' | 'luxury';
  transportationType: 'public' | 'private' | 'mixed';
}

export interface TripPlan {
  id: string;
  preferences: TripPreferences;
  days: ItineraryDay[];
  totalBudget: number;
  createdAt: string;
}
