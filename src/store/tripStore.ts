import { create } from 'zustand';
import { TripPlan, TripPreferences, Destination, BudgetItem } from '../types';
import { generateTripPlan as generateGLMTripPlan } from '../utils/glmService';

interface TripStore {
  // 当前行程计划
  currentPlan: TripPlan | null;
  // 是否正在加载
  isLoading: boolean;
  // 错误信息
  error: string | null;

  // Actions
  setCurrentPlan: (plan: TripPlan | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 添加目的地到某一天
  addDestination: (dayIndex: number, destination: Destination) => void;

  // 删除目的地
  removeDestination: (dayIndex: number, destinationId: string) => void;

  // 更新目的地
  updateDestination: (dayIndex: number, destinationId: string, updates: Partial<Destination>) => void;

  // 更新预算项
  updateBudgetItem: (dayIndex: number, category: string, amount: number) => void;

  // 重新生成行程
  regenerateTrip: (preferences: TripPreferences) => Promise<void>;

  // 计算总预算
  calculateTotalBudget: () => number;
}

export const useTripStore = create<TripStore>((set, get) => ({
  currentPlan: null,
  isLoading: false,
  error: null,

  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  addDestination: (dayIndex, destination) => set((state) => {
    if (!state.currentPlan) return state;

    const newPlan = { ...state.currentPlan };
    newPlan.days[dayIndex].destinations.push(destination);

    // 更新预算
    const budgetItem: BudgetItem = {
      category: destination.type === 'attraction' ? 'ticket' :
                 destination.type === 'restaurant' ? 'restaurant' :
                 destination.type === 'hotel' ? 'hotel' : 'transport',
      name: destination.name,
      amount: destination.ticketPrice || destination.mealPrice || 0,
      date: newPlan.days[dayIndex].date
    };
    newPlan.days[dayIndex].budget.push(budgetItem);
    newPlan.totalBudget = state.calculateTotalBudget();

    return { currentPlan: newPlan };
  }),

  removeDestination: (dayIndex, destinationId) => set((state) => {
    if (!state.currentPlan) return state;

    const newPlan = { ...state.currentPlan };
    newPlan.days[dayIndex].destinations = newPlan.days[dayIndex].destinations.filter(
      (d) => d.id !== destinationId
    );
    newPlan.totalBudget = state.calculateTotalBudget();

    return { currentPlan: newPlan };
  }),

  updateDestination: (dayIndex, destinationId, updates) => set((state) => {
    if (!state.currentPlan) return state;

    const newPlan = { ...state.currentPlan };
    const day = newPlan.days[dayIndex];
    const destIndex = day.destinations.findIndex((d) => d.id === destinationId);

    if (destIndex !== -1) {
      day.destinations[destIndex] = { ...day.destinations[destIndex], ...updates };
    }

    newPlan.totalBudget = state.calculateTotalBudget();

    return { currentPlan: newPlan };
  }),

  updateBudgetItem: (dayIndex, category, amount) => set((state) => {
    if (!state.currentPlan) return state;

    const newPlan = { ...state.currentPlan };
    const budgetIndex = newPlan.days[dayIndex].budget.findIndex(
      (b) => b.category === category
    );

    if (budgetIndex !== -1) {
      newPlan.days[dayIndex].budget[budgetIndex].amount = amount;
    }

    newPlan.totalBudget = state.calculateTotalBudget();

    return { currentPlan: newPlan };
  }),

  regenerateTrip: async (preferences) => {
    set({ isLoading: true, error: null });

    try {
      // 尝试使用真实 AI 服务
      let plan: TripPlan;
      try {
        plan = await generateGLMTripPlan(preferences);
      } catch (aiError) {
        console.warn('AI 服务调用失败，使用模拟数据:', aiError);
        // 如果 AI 服务不可用，回退到模拟数据
        const errorMsg = (aiError as Error).message || '';
        if (errorMsg.includes('请配置') || errorMsg.includes('API Key')) {
          set({ error: '请先配置 GLM API Key，当前使用模拟数据', isLoading: false });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        plan = generateMockTripPlan(preferences);
      }

      set({ currentPlan: plan, isLoading: false });
    } catch (error) {
      const errorMsg = (error as Error).message || '生成行程失败，请重试';
      set({ error: errorMsg, isLoading: false });
    }
  },

  calculateTotalBudget: () => {
    const state = get();
    if (!state.currentPlan) return 0;

    let total = 0;
    state.currentPlan.days.forEach((day) => {
      day.budget.forEach((item) => {
        total += item.amount;
      });
    });

    return total;
  }
}));

// 模拟生成行程计划（备用方案）
function generateMockTripPlan(preferences: TripPreferences): TripPlan {
  const startDate = new Date(preferences.startDate);
  const endDate = new Date(preferences.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const days = [];

  for (let i = 0; i < daysDiff; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const destinations = generateMockDestinations(i, preferences);

    const budget = [
      { category: 'ticket' as const, name: '门票费用', amount: destinations.reduce((sum, d) => sum + (d.ticketPrice || 0), 0) },
      { category: 'restaurant' as const, name: '餐饮费用', amount: destinations.reduce((sum, d) => sum + (d.mealPrice || 0), 0) },
      { category: 'hotel' as const, name: '住宿费用', amount: preferences.accommodationType === 'luxury' ? 800 : preferences.accommodationType === 'mid-range' ? 400 : 200 },
      { category: 'transport' as const, name: '交通费用', amount: preferences.transportationType === 'private' ? 300 : preferences.transportationType === 'mixed' ? 200 : 50 },
    ];

    days.push({
      date: currentDate.toISOString().split('T')[0],
      destinations,
      budget
    });
  }

  const totalBudget = days.reduce((sum, day) => sum + day.budget.reduce((bSum, b) => bSum + b.amount, 0), 0);

  return {
    id: Date.now().toString(),
    preferences,
    days,
    totalBudget,
    createdAt: new Date().toISOString()
  };
}

// 模拟生成目的地数据
function generateMockDestinations(dayIndex: number, preferences: TripPreferences): Destination[] {
  // 这里是模拟数据，实际项目中应该调用地图API或AI服务
  const mockData: Destination[] = [
    {
      id: `dest-${dayIndex}-1`,
      name: `${preferences.destination}市中心景点`,
      description: '著名的历史文化景点',
      coordinates: [39.9042 + dayIndex * 0.01, 116.4074 + dayIndex * 0.01],
      type: 'attraction',
      rating: 4.5,
      estimatedDuration: 120,
      ticketPrice: 100
    },
    {
      id: `dest-${dayIndex}-2`,
      name: '特色餐厅',
      description: '当地美食体验',
      coordinates: [39.9042 + dayIndex * 0.01 + 0.005, 116.4074 + dayIndex * 0.01 + 0.005],
      type: 'restaurant',
      rating: 4.3,
      estimatedDuration: 90,
      mealPrice: 150
    },
    {
      id: `dest-${dayIndex}-3`,
      name: '精选酒店',
      description: '舒适的住宿体验',
      coordinates: [39.9042 + dayIndex * 0.01 + 0.01, 116.4074 + dayIndex * 0.01 + 0.01],
      type: 'hotel',
      rating: 4.7,
      estimatedDuration: 0,
      ticketPrice: preferences.accommodationType === 'luxury' ? 800 : preferences.accommodationType === 'mid-range' ? 400 : 200
    }
  ];

  return mockData;
}
