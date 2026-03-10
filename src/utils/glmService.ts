import axios from 'axios';
import { TripPreferences, TripPlan } from '../types';

const API_URL = import.meta.env.VITE_GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const API_KEY = import.meta.env.VITE_GLM_API_KEY || '';

// 构建提示词
const buildPrompt = (preferences: TripPreferences): string => {
  return `你是一个专业的旅行规划助手。请根据以下信息为用户生成一份详细的旅行计划。

**旅行偏好：**
- 目的地：${preferences.destination}
- 出行日期：${preferences.startDate} 至 ${preferences.endDate}
- 出行人数：${preferences.participants} 人
- 预算范围：${preferences.budgetRange === 'low' ? '经济型（人均 ¥500-1000/天）' : preferences.budgetRange === 'medium' ? '舒适型（人均 ¥1000-2000/天）' : '豪华型（人均 ¥2000+/天）'}
- 兴趣爱好：${preferences.interests.join('、') || '无特殊偏好'}
- 住宿偏好：${preferences.accommodationType === 'budget' ? '经济型酒店/民宿' : preferences.accommodationType === 'mid-range' ? '中档酒店' : '豪华酒店'}
- 交通方式：${preferences.transportationType === 'public' ? '公共交通' : preferences.transportationType === 'private' ? '私人交通' : '混合交通'}

**要求：**
1. 每天安排 2-4 个景点/活动，包括景点、餐饮、住宿
2. 每个地点包含：name（名称）、description（描述）、type（类型：attraction/restaurant/hotel/transport）、rating（评分 0-5）、estimatedDuration（预计停留时间分钟）、ticketPrice（门票价格，单位：人民币元）、mealPrice（餐饮价格，单位：人民币元）
3. 景点类型要多样化，包含历史文化、自然风光、美食体验等
4. 价格要符合预算范围，**必须使用人民币元作为货币单位**，不要使用日元或其他货币
5. 每个地点需要真实的坐标（coordinates）：[纬度, 经度]，使用该城市的真实坐标
6. 返回格式必须是纯 JSON 格式，不要包含任何其他文字
1. 每天安排 2-4 个景点/活动，包括景点、餐饮、住宿
2. 每个地点包含：name（名称）、description（描述）、type（类型：attraction/restaurant/hotel/transport）、rating（评分 0-5）、estimatedDuration（预计停留时间分钟）、ticketPrice（门票价格）、mealPrice（餐饮价格）
3. 景点类型要多样化，包含历史文化、自然风光、美食体验等
4. 价格要符合预算范围
5. 每个地点需要真实的坐标（coordinates）：[纬度, 经度]，使用该城市的真实坐标
6. 返回格式必须是纯 JSON 格式，不要包含任何其他文字

**返回 JSON 格式示例：**
\`\`\`json
{
  "days": [
    {
      "date": "2024-01-01",
      "destinations": [
        {
          "id": "dest-1",
          "name": "景点名称",
          "description": "景点描述",
          "coordinates": [39.9163, 116.3972],
          "type": "attraction",
          "rating": 4.5,
          "estimatedDuration": 120,
          "ticketPrice": 100
        }
      ]
    }
  ]
}
\`\`\`

请生成符合上述要求的旅行计划 JSON：`;
};

// 解析 GLM-4.7 的响应
const parseResponse = (content: string): any => {
  try {
    // 尝试直接解析
    return JSON.parse(content);
  } catch (error) {
    // 尝试提取 JSON 部分
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }

    // 尝试提取 { ... } 之间的内容
    const braceMatch = content.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      return JSON.parse(braceMatch[0]);
    }

    throw new Error('无法解析响应内容');
  }
};

// 生成旅行计划
export const generateTripPlan = async (preferences: TripPreferences): Promise<TripPlan> => {
  if (!API_KEY || API_KEY === 'your_glm_api_key_here') {
    throw new Error('请配置 GLM API Key');
  }

  try {
    const prompt = buildPrompt(preferences);

    const response = await axios.post(
      API_URL,
      {
        model: 'glm-4-flash',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的旅行规划助手，擅长根据用户需求生成详细的旅行计划。你的回答必须是纯 JSON 格式。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('API 返回内容为空');
    }

    const parsedData = parseResponse(content);

    // 构建完整的旅行计划
    const days = parsedData.days || [];
    let totalBudget = 0;

    days.forEach((day: any) => {
      if (!day.budget) {
        day.budget = [];
      }
      if (!day.destinations) {
        day.destinations = [];
      }

      // 为每个目的地生成预算项
      day.destinations.forEach((dest: any) => {
        let amount = 0;
        
        // 根据类型计算价格
        if (dest.type === 'hotel') {
          // 酒店使用住宿类型的默认价格
          amount = preferences.accommodationType === 'luxury' ? 800 : 
                   preferences.accommodationType === 'mid-range' ? 400 : 200;
        } else {
          // 景点、餐饮、交通使用 AI 返回的价格
          amount = dest.ticketPrice || dest.mealPrice || 0;
        }
        
        const budgetItem = {
          category: dest.type === 'attraction' ? 'ticket' :
                      dest.type === 'restaurant' ? 'restaurant' :
                      dest.type === 'hotel' ? 'hotel' : 'transport',
          name: dest.name,
          amount: amount,
          date: day.date
        };
        day.budget.push(budgetItem);
        totalBudget += budgetItem.amount;
      });
      day.destinations.forEach((dest: any) => {
        const budgetItem = {
          category: dest.type === 'attraction' ? 'ticket' :
                      dest.type === 'restaurant' ? 'restaurant' :
                      dest.type === 'hotel' ? 'hotel' : 'transport',
          name: dest.name,
          amount: dest.ticketPrice || dest.mealPrice || 0,
          date: day.date
        };
        day.budget.push(budgetItem);
        totalBudget += budgetItem.amount;
      });
    });

    // 如果没有预算数据，生成默认预算
    if (totalBudget === 0) {
      days.forEach((day: any) => {
        day.budget = [
          { category: 'ticket', name: '门票费用', amount: 0, date: day.date },
          { category: 'restaurant', name: '餐饮费用', amount: 0, date: day.date },
          { category: 'hotel', name: '住宿费用', amount: preferences.accommodationType === 'luxury' ? 800 : preferences.accommodationType === 'mid-range' ? 400 : 200, date: day.date },
          { category: 'transport', name: '交通费用', amount: preferences.transportationType === 'private' ? 300 : preferences.transportationType === 'mixed' ? 200 : 50, date: day.date }
        ];
        day.budget.forEach((item: any) => {
          totalBudget += item.amount;
        });
      });
    }

    return {
      id: Date.now().toString(),
      preferences,
      days,
      totalBudget,
      createdAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('生成行程计划失败:', error);
    if (error.response) {
      throw new Error(`API 调用失败: ${error.response.status} - ${error.response.data?.error?.message || error.message}`);
    }
    throw error;
  }
};

// 测试 API 连接
export const testConnection = async (): Promise<boolean> => {
  if (!API_KEY || API_KEY === 'your_glm_api_key_here') {
    return false;
  }

  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'glm-4-flash',
        messages: [
          {
            role: 'user',
            content: '你好'
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('API 连接测试失败:', error);
    return false;
  }
};
