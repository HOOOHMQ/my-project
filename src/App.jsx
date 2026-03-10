import React, { useState } from 'react';
import { ConfigProvider, Layout, Tabs, Button, theme, Space } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Plane, Home, Map, Wallet, FileText, RotateCcw, Download } from 'lucide-react';
import './App.css';

// 组件导入
import TripPlanner from './components/Planner';
import AMapVisualization from './components/Map/AMapVisualization';
import Budget from './components/Budget';
import Editor from './components/Editor';
import Export from './components/Export';

// Store导入
import { useTripStore } from './store/tripStore';

const { Header, Content, Sider } = Layout;

function App() {
  const [activeTab, setActiveTab] = useState('plan');
  const [isEditing, setIsEditing] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const { currentPlan, setCurrentPlan, regenerateTrip } = useTripStore();

  const handleReset = () => {
    setCurrentPlan(null);
    setActiveTab('plan');
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const tabsItems = [
    {
      key: 'plan',
      label: (
        <span>
          <Plane size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          行程规划
        </span>
      ),
      children: <TripPlanner />
    },
    {
      key: 'map',
      label: (
        <span>
          <Map size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          地图可视化
        </span>
      ),
      children: currentPlan ? (
        <div id="trip-content">
          {currentPlan.days.map((day, index) => (
            <div key={index} style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                第 {index + 1} 天 - {new Date(day.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
              </h3>
              <AMapVisualization destinations={day.destinations} dayIndex={index} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999'
        }}>
          <Map size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px' }}>请先规划行程</p>
        </div>
      )
    },
    {
      key: 'budget',
      label: (
        <span>
          <Wallet size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          预算明细
        </span>
      ),
      children: <Budget days={currentPlan?.days || []} totalBudget={currentPlan?.totalBudget || 0} />
    },
    {
      key: 'itinerary',
      label: (
        <span>
          <FileText size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          行程详情
        </span>
      ),
      children: currentPlan ? (
        <div id="trip-content">
          {currentPlan.days.map((day, index) => (
            <div key={index} style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h3 style={{ fontSize: '18px', margin: 0 }}>
                  第 {index + 1} 天 - {new Date(day.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                </h3>
              </div>
              <Editor
                dayIndex={index}
                destinations={day.destinations}
                isEditing={isEditing}
              />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999'
        }}>
          <FileText size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px' }}>请先规划行程</p>
        </div>
      )
    }
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '0 48px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plane size={24} color="#fff" />
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>
              智能体旅行助手
            </h1>
          </div>
          {currentPlan && (
            <Space size="middle">
              <Button
                icon={isEditing ? <FileText size={18} /> : <RotateCcw size={18} />}
                onClick={toggleEditMode}
              >
                {isEditing ? '预览模式' : '编辑模式'}
              </Button>
              <Button
                danger
                icon={<RotateCcw size={18} />}
                onClick={handleReset}
              >
                重新规划
              </Button>
            </Space>
          )}
        </Header>

        <Layout>
          <Content style={{ padding: '48px', background: '#f0f2f5' }}>
            <div
              style={{
                padding: '48px',
                minHeight: '100%',
                background: colorBgContainer,
                borderRadius: borderRadiusLG
              }}
            >
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
                  {currentPlan
                    ? `${currentPlan.preferences.destination}旅行计划`
                    : '开始规划您的旅行'
                  }
                </h2>
                {currentPlan && (
                  <Export tripPlan={currentPlan} elementId="trip-content" />
                )}
              </div>

              {currentPlan && (
                <div style={{
                  padding: '16px',
                  marginBottom: '24px',
                  background: '#f0f5ff',
                  border: '1px solid #adc6ff',
                  borderRadius: '8px'
                }}>
                  <Space size="large">
                    <span><strong>目的地:</strong> {currentPlan.preferences.destination}</span>
                    <span><strong>出行日期:</strong> {currentPlan.preferences.startDate} 至 {currentPlan.preferences.endDate}</span>
                    <span><strong>人数:</strong> {currentPlan.preferences.participants} 人</span>
                    <span><strong>总预算:</strong> ¥{currentPlan.totalBudget.toLocaleString()}</span>
                  </Space>
                </div>
              )}

              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabsItems}
                size="large"
                style={{ marginTop: '24px' }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
