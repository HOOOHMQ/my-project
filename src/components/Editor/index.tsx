import React, { useState } from 'react';
import {
  Card,
  List,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
  Popconfirm,
  message
} from 'antd';
import {
  Edit2,
  Trash2,
  Plus,
  MapPin,
  Clock,
  Star,
  Navigation,
  DollarSign
} from 'lucide-react';
import { Destination, Destination as DestinationType } from '../../types';
import { useTripStore } from '../../store/tripStore';

interface EditorProps {
  dayIndex: number;
  destinations: Destination[];
  isEditing?: boolean;
}

const Editor: React.FC<EditorProps> = ({ dayIndex, destinations, isEditing = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);
  const [form] = Form.useForm();

  const { addDestination, removeDestination, updateDestination } = useTripStore();

  const handleAdd = () => {
    setEditingDestination(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (destination: Destination) => {
    setEditingDestination(destination);
    form.setFieldsValue({
      name: destination.name,
      description: destination.description,
      type: destination.type,
      rating: destination.rating,
      estimatedDuration: destination.estimatedDuration,
      ticketPrice: destination.ticketPrice || 0,
      mealPrice: destination.mealPrice || 0,
      coordinates: {
        lat: destination.coordinates[0],
        lng: destination.coordinates[1]
      }
    });
    setIsModalOpen(true);
  };

  const handleDelete = (destinationId: string) => {
    removeDestination(dayIndex, destinationId);
    message.success('已删除景点');
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const destination: Destination = {
        id: editingDestination?.id || `custom-${Date.now()}`,
        name: values.name,
        description: values.description,
        type: values.type,
        rating: values.rating,
        estimatedDuration: values.estimatedDuration,
        coordinates: [values.coordinates.lat, values.coordinates.lng],
        ticketPrice: values.ticketPrice || undefined,
        mealPrice: values.mealPrice || undefined
      };

      if (editingDestination) {
        updateDestination(dayIndex, editingDestination.id, destination);
        message.success('已更新景点');
      } else {
        addDestination(dayIndex, destination);
        message.success('已添加景点');
      }

      setIsModalOpen(false);
    } catch (error) {
      message.error('请填写完整信息');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const getTypeColor = (type: DestinationType['type']) => {
    switch (type) {
      case 'attraction':
        return 'red';
      case 'restaurant':
        return 'orange';
      case 'hotel':
        return 'green';
      case 'transport':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getTypeText = (type: DestinationType['type']) => {
    switch (type) {
      case 'attraction':
        return '景点';
      case 'restaurant':
        return '餐饮';
      case 'hotel':
        return '住宿';
      case 'transport':
        return '交通';
      default:
        return '其他';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          <Navigation size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          景点列表 ({destinations.length})
        </h3>
        {isEditing && (
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAdd}>
            添加景点
          </Button>
        )}
      </div>

      {destinations.length === 0 ? (
        <div style={{
          padding: '48px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#999'
        }}>
          <MapPin size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '16px' }}>
            {isEditing ? '点击"添加景点"开始规划行程' : '暂无景点'}
          </p>
        </div>
      ) : (
        <List
          dataSource={destinations}
          renderItem={(dest, index) => (
            <List.Item
              style={{
                padding: '16px',
                marginBottom: '12px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e8e8e8',
                transition: 'all 0.3s',
                ':hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }
              }}
              actions={
                isEditing
                  ? [
                      <Button
                        type="link"
                        icon={<Edit2 size={16} />}
                        onClick={() => handleEdit(dest)}
                      >
                        编辑
                      </Button>,
                      <Popconfirm
                        title="确定删除此景点吗？"
                        onConfirm={() => handleDelete(dest.id)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="link" danger icon={<Trash2 size={16} />}>
                          删除
                        </Button>
                      </Popconfirm>
                    ]
                  : []
              }
            >
              <List.Item.Meta
                avatar={
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: getTypeColor(dest.type) === 'red' ? '#ff6b6b' :
                                   getTypeColor(dest.type) === 'orange' ? '#ffd93d' :
                                   getTypeColor(dest.type) === 'green' ? '#6bcb77' : '#4d96ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    {index + 1}
                  </div>
                }
                title={
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 600, marginRight: '8px' }}>
                      {dest.name}
                    </span>
                    <Tag color={getTypeColor(dest.type)}>{getTypeText(dest.type)}</Tag>
                  </div>
                }
                description={
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <p style={{ margin: '4px 0' }}>{dest.description}</p>
                    <Space size="large">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#ffc107" color="#ffc107" />
                        {dest.rating}
                      </span>
                      {dest.estimatedDuration > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} />
                          {dest.estimatedDuration} 分钟
                        </span>
                      )}
                      {(dest.ticketPrice || dest.mealPrice) && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} />
                          ¥{((dest.ticketPrice || 0) + (dest.mealPrice || 0)).toLocaleString()}
                        </span>
                      )}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}

      {/* 添加/编辑模态框 */}
      <Modal
        title={editingDestination ? '编辑景点' : '添加景点'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: '24px' }}
        >
          <Form.Item
            label="景点名称"
            name="name"
            rules={[{ required: true, message: '请输入景点名称' }]}
          >
            <Input placeholder="例如：故宫博物院" />
          </Form.Item>

          <Form.Item
            label="景点描述"
            name="description"
            rules={[{ required: true, message: '请输入景点描述' }]}
          >
            <Input.TextArea rows={2} placeholder="简要描述景点特色" />
          </Form.Item>

          <Form.Item
            label="景点类型"
            name="type"
            rules={[{ required: true, message: '请选择景点类型' }]}
          >
            <Select placeholder="选择类型">
              <Select.Option value="attraction">景点</Select.Option>
              <Select.Option value="restaurant">餐饮</Select.Option>
              <Select.Option value="hotel">住宿</Select.Option>
              <Select.Option value="transport">交通</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="坐标位置">
            <Input.Group compact>
              <Form.Item
                name={['coordinates', 'lat']}
                noStyle
                rules={[{ required: true, message: '请输入纬度' }]}
              >
                <InputNumber
                  style={{ width: '50%' }}
                  placeholder="纬度"
                  precision={6}
                  step={0.000001}
                />
              </Form.Item>
              <Form.Item
                name={['coordinates', 'lng']}
                noStyle
                rules={[{ required: true, message: '请输入经度' }]}
              >
                <InputNumber
                  style={{ width: '50%' }}
                  placeholder="经度"
                  precision={6}
                  step={0.000001}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item
            label="评分"
            name="rating"
            rules={[{ required: true, message: '请输入评分' }]}
          >
            <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="预计停留时间（分钟）"
            name="estimatedDuration"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="门票价格">
            <Form.Item name="ticketPrice" noStyle>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如果没有门票，留空即可" />
            </Form.Item>
          </Form.Item>

          <Form.Item label="餐饮价格">
            <Form.Item name="mealPrice" noStyle>
              <InputNumber min={0} style={{ width: '100%' }} placeholder="如果是餐饮，请输入价格" />
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Editor;
