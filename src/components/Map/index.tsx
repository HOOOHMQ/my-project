import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Destination } from '../../types';
import { MapPin, Navigation, Clock, Star } from 'lucide-react';

// 修复Leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapVisualizationProps {
  destinations: Destination[];
  dayIndex?: number;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({ destinations, dayIndex = 0 }) => {
  if (destinations.length === 0) {
    return (
      <div style={{
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        color: '#999'
      }}>
        <div style={{ textAlign: 'center' }}>
          <MapPin size={48} />
          <p style={{ marginTop: '12px', fontSize: '16px' }}>
            {dayIndex === 0 ? '生成行程后将在地图上显示' : '该日暂无景点'}
          </p>
        </div>
      </div>
    );
  }

  // 计算地图中心点
  const center = destinations.reduce(
    (acc, dest) => [
      acc[0] + dest.coordinates[0] / destinations.length,
      acc[1] + dest.coordinates[1] / destinations.length
    ],
    [0, 0]
  );

  // 生成路线坐标
  const routeCoordinates = destinations.map((dest) => dest.coordinates);

  // 根据类型选择不同的图标颜色
  const getMarkerColor = (type: Destination['type']) => {
    switch (type) {
      case 'attraction':
        return '#ff6b6b';
      case 'restaurant':
        return '#ffd93d';
      case 'hotel':
        return '#6bcb77';
      case 'transport':
        return '#4d96ff';
      default:
        return '#888';
    }
  };

  // 创建自定义图标
  const createCustomIcon = (type: Destination['type'], index: number) => {
    const color = getMarkerColor(type);
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: bold;
              font-size: 14px;
            ">
              ${index + 1}
            </span>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  return (
    <div style={{ height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={center as [number, number]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 绘制路线 */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#4d96ff',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10'
            }}
          />
        )}

        {/* 标记景点 */}
        {destinations.map((dest, index) => (
          <Marker
            key={dest.id}
            position={dest.coordinates}
            icon={createCustomIcon(dest.type, index)}
          >
            <Popup>
              <div style={{ minWidth: '200px', padding: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
                  {dest.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  {dest.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <Star size={14} fill="#ffc107" color="#ffc107" />
                  <span style={{ fontSize: '14px' }}>{dest.rating}</span>
                </div>
                {dest.estimatedDuration > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#666" />
                    <span style={{ fontSize: '14px', color: '#666' }}>
                      预计停留 {dest.estimatedDuration} 分钟
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapVisualization;
