import React, { useState } from 'react';
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  Button,
  Card,
  Space,
  message
} from 'antd';
import { Plane, Calendar, Users, DollarSign, MapPin, Heart } from 'lucide-react';
import { useTripStore } from '../../store/tripStore';
import { TripPreferences } from '../../types';
import { interestOptions } from '../../data/mockData';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const TripPlanner: React.FC = () => {
  const [form] = Form.useForm();
  const { regenerateTrip, isLoading } = useTripStore();

  const handleSubmit = async (values: any) => {
    try {
      const preferences: TripPreferences = {
        destination: values.destination,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        participants: values.participants || 1,
        budgetRange: values.budgetRange || 'medium',
        interests: values.interests || [],
        accommodationType: values.accommodationType || 'mid-range',
        transportationType: values.transportationType || 'mixed'
      };

      await regenerateTrip(preferences);
      message.success('行程生成成功！');
    } catch (error) {
      message.error('行程生成失败，请重试');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <Plane size={24} />
            <span style={{ fontSize: '18px', fontWeight: 600 }}>智能行程规划</span>
          </Space>
        }
        style={{
          maxWidth: 800,
          margin: '0 auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            participants: 1,
            budgetRange: 'medium',
            accommodationType: 'mid-range',
            transportationType: 'mixed'
          }}
        >
          <Form.Item
            label="目的地"
            name="destination"
            rules={[{ required: true, message: '请输入目的地' }]}
          >
            <Input
              placeholder="例如：北京、上海、杭州"
              prefix={<MapPin size={18} />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="出行日期"
            name="dateRange"
            rules={[{ required: true, message: '请选择出行日期' }]}
          >
            <RangePicker
              size="large"
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </Form.Item>

          <Form.Item
            label="出行人数"
            name="participants"
            rules={[{ required: true, message: '请输入出行人数' }]}
          >
            <InputNumber
              min={1}
              max={20}
              size="large"
              style={{ width: '100%' }}
              prefix={<Users size={18} />}
            />
          </Form.Item>

          <Form.Item
            label="预算范围"
            name="budgetRange"
            rules={[{ required: true, message: '请选择预算范围' }]}
          >
            <Select size="large" prefix={<DollarSign size={18} />}>
              <Select.Option value="low">经济型（人均 ¥500-1000/天）</Select.Option>
              <Select.Option value="medium">舒适型（人均 ¥1000-2000/天）</Select.Option>
              <Select.Option value="high">豪华型（人均 ¥2000+/天）</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="兴趣爱好"
            name="interests"
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="选择您的兴趣爱好"
              style={{ width: '100%' }}
              prefix={<Heart size={18} />}
            >
              {interestOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="住宿偏好"
            name="accommodationType"
          >
            <Select size="large">
              <Select.Option value="budget">经济型酒店/民宿</Select.Option>
              <Select.Option value="mid-range">中档酒店</Select.Option>
              <Select.Option value="luxury">豪华酒店</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="交通方式"
            name="transportationType"
          >
            <Select size="large">
              <Select.Option value="public">公共交通</Select.Option>
              <Select.Option value="private">私人交通</Select.Option>
              <Select.Option value="mixed">混合交通</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              block
              icon={<Plane size={18} />}
              style={{ height: '48px', fontSize: '16px' }}
            >
              {isLoading ? '生成中...' : '生成行程计划'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TripPlanner;
