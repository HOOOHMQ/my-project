import React from 'react';
import { Card, Table, Tag, Statistic, Row, Col } from 'antd';
import { DollarSign, Wallet, TrendingUp, PieChart } from 'lucide-react';
import { ItineraryDay } from '../../types';

interface BudgetProps {
  days: ItineraryDay[];
  totalBudget: number;
}

const Budget: React.FC<BudgetProps> = ({ days, totalBudget }) => {
  if (days.length === 0) {
    return (
      <div style={{
        padding: '48px',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        color: '#999'
      }}>
        <Wallet size={48} style={{ marginBottom: '16px' }} />
        <p style={{ fontSize: '16px' }}>生成行程后将显示预算明细</p>
      </div>
    );
  }

  // 计算各类别总花费
  const categoryTotals = {
    ticket: 0,
    hotel: 0,
    restaurant: 0,
    transport: 0,
    other: 0
  };

  days.forEach((day) => {
    day.budget.forEach((item) => {
      categoryTotals[item.category as keyof typeof categoryTotals] += item.amount;
    });
  });

  // 表格列定义
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => {
        const d = new Date(date);
        return `${d.getMonth() + 1}月${d.getDate()}日`;
      }
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => {
        const categoryConfig: Record<string, { text: string; color: string }> = {
          ticket: { text: '门票', color: '#ff6b6b' },
          hotel: { text: '住宿', color: '#6bcb77' },
          restaurant: { text: '餐饮', color: '#ffd93d' },
          transport: { text: '交通', color: '#4d96ff' },
          other: { text: '其他', color: '#888' }
        };
        const config = categoryConfig[category] || categoryConfig.other;
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: '项目',
      dataIndex: 'name',
      key: 'name',
      width: 200
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => `¥${amount.toLocaleString()}`
    }
  ];

  // 生成表格数据
  const dataSource = days.flatMap((day, dayIndex) =>
    day.budget.map((item, itemIndex) => ({
      key: `${dayIndex}-${itemIndex}`,
      date: day.date,
      category: item.category,
      name: item.name,
      amount: item.amount
    }))
  );

  return (
    <div>
      {/* 总览统计 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总预算"
              value={totalBudget}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#3f8600', fontSize: '28px' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均每天"
              value={Math.round(totalBudget / days.length)}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="门票费用"
              value={categoryTotals.ticket}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#ff6b6b', fontSize: '28px' }}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="住宿费用"
              value={categoryTotals.hotel}
              precision={0}
              prefix="¥"
              valueStyle={{ color: '#6bcb77', fontSize: '28px' }}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      {/* 分类明细 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={20} />
                <span>费用分布</span>
              </span>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ff6b6b', borderRadius: '2px' }} />
                <span style={{ flex: 1 }}>门票</span>
                <span style={{ fontWeight: 600 }}>¥{categoryTotals.ticket.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#6bcb77', borderRadius: '2px' }} />
                <span style={{ flex: 1 }}>住宿</span>
                <span style={{ fontWeight: 600 }}>¥{categoryTotals.hotel.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ffd93d', borderRadius: '2px' }} />
                <span style={{ flex: 1 }}>餐饮</span>
                <span style={{ fontWeight: 600 }}>¥{categoryTotals.restaurant.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#4d96ff', borderRadius: '2px' }} />
                <span style={{ flex: 1 }}>交通</span>
                <span style={{ fontWeight: 600 }}>¥{categoryTotals.transport.toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} />
                <span>消费分析</span>
              </span>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div>· 总行程天数: {days.length} 天</div>
              <div>· 日均消费: ¥{Math.round(totalBudget / days.length).toLocaleString()}</div>
              <div>· 最高消费日: ¥{Math.max(...days.map(d => d.budget.reduce((sum, b) => sum + b.amount, 0))).toLocaleString()}</div>
              <div>· 最低消费日: ¥{Math.min(...days.map(d => d.budget.reduce((sum, b) => sum + b.amount, 0))).toLocaleString()}</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 详细表格 */}
      <Card title="预算明细">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          size="middle"
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <strong>总计</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <strong style={{ fontSize: '16px', color: '#3f8600' }}>
                    ¥{totalBudget.toLocaleString()}
                  </strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default Budget;
