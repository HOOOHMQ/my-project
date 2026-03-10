import { Destination } from '../types';

export const mockDestinations: Destination[] = [
  // 北京景点
  {
    id: 'bj-1',
    name: '故宫博物院',
    description: '明清两代皇家宫殿，世界文化遗产',
    coordinates: [39.9163, 116.3972],
    type: 'attraction',
    rating: 4.8,
    estimatedDuration: 180,
    ticketPrice: 60
  },
  {
    id: 'bj-2',
    name: '天安门广场',
    description: '世界最大的城市广场之一',
    coordinates: [39.9054, 116.3976],
    type: 'attraction',
    rating: 4.7,
    estimatedDuration: 60,
    ticketPrice: 0
  },
  {
    id: 'bj-3',
    name: '八达岭长城',
    description: '万里长城精华段',
    coordinates: [40.3599, 116.0191],
    type: 'attraction',
    rating: 4.6,
    estimatedDuration: 240,
    ticketPrice: 40
  },
  {
    id: 'bj-4',
    name: '颐和园',
    description: '清代皇家园林',
    coordinates: [39.9998, 116.2755],
    type: 'attraction',
    rating: 4.5,
    estimatedDuration: 180,
    ticketPrice: 30
  },
  {
    id: 'bj-5',
    name: '全聚德烤鸭店',
    description: '百年老字号烤鸭',
    coordinates: [39.9078, 116.3945],
    type: 'restaurant',
    rating: 4.4,
    estimatedDuration: 90,
    mealPrice: 200
  },
  {
    id: 'bj-6',
    name: '北京饭店',
    description: '历史悠久的五星级酒店',
    coordinates: [39.9088, 116.4068],
    type: 'hotel',
    rating: 4.6,
    estimatedDuration: 0
  },
  // 上海景点
  {
    id: 'sh-1',
    name: '外滩',
    description: '上海标志性景观带',
    coordinates: [31.2403, 121.4906],
    type: 'attraction',
    rating: 4.7,
    estimatedDuration: 120,
    ticketPrice: 0
  },
  {
    id: 'sh-2',
    name: '东方明珠塔',
    description: '上海地标建筑',
    coordinates: [31.2397, 121.4998],
    type: 'attraction',
    rating: 4.5,
    estimatedDuration: 120,
    ticketPrice: 180
  },
  {
    id: 'sh-3',
    name: '豫园',
    description: '明代私家园林',
    coordinates: [31.2266, 121.4924],
    type: 'attraction',
    rating: 4.4,
    estimatedDuration: 120,
    ticketPrice: 40
  },
  {
    id: 'sh-4',
    name: '小杨生煎',
    description: '上海特色小吃',
    coordinates: [31.2351, 121.4848],
    type: 'restaurant',
    rating: 4.6,
    estimatedDuration: 45,
    mealPrice: 50
  },
  {
    id: 'sh-5',
    name: '和平饭店',
    description: '外滩地标酒店',
    coordinates: [31.2425, 121.4913],
    type: 'hotel',
    rating: 4.7,
    estimatedDuration: 0
  },
  // 杭州景点
  {
    id: 'hz-1',
    name: '西湖',
    description: '世界文化遗产，人间天堂',
    coordinates: [30.2592, 120.1294],
    type: 'attraction',
    rating: 4.8,
    estimatedDuration: 240,
    ticketPrice: 0
  },
  {
    id: 'hz-2',
    name: '灵隐寺',
    description: '江南著名古刹',
    coordinates: [30.2415, 120.1016],
    type: 'attraction',
    rating: 4.6,
    estimatedDuration: 120,
    ticketPrice: 75
  },
  {
    id: 'hz-3',
    name: '龙井茶园',
    description: '西湖龙井茶产地',
    coordinates: [30.2146, 120.1154],
    type: 'attraction',
    rating: 4.5,
    estimatedDuration: 90,
    ticketPrice: 0
  },
  {
    id: 'hz-4',
    name: '知味观',
    description: '百年老字号杭帮菜',
    coordinates: [30.2671, 120.1709],
    type: 'restaurant',
    rating: 4.5,
    estimatedDuration: 90,
    mealPrice: 150
  },
  {
    id: 'hz-5',
    name: '杭州西湖国宾馆',
    description: '湖畔豪华酒店',
    coordinates: [30.2539, 120.1405],
    type: 'hotel',
    rating: 4.8,
    estimatedDuration: 0
  }
];

export const interestOptions = [
  { label: '历史文化', value: 'history' },
  { label: '自然风光', value: 'nature' },
  { label: '美食体验', value: 'food' },
  { label: '购物娱乐', value: 'shopping' },
  { label: '艺术展览', value: 'art' },
  { label: '户外运动', value: 'sports' },
  { label: '亲子活动', value: 'family' },
  { label: '夜生活', value: 'nightlife' }
];
