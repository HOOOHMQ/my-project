import React, { useEffect, useRef, useState } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Destination } from '../../types';
import { MapPin, Clock, Star } from 'lucide-react';

interface AMapVisualizationProps {
  destinations: Destination[];
  dayIndex?: number;
}

const AMapVisualization: React.FC<AMapVisualizationProps> = ({ destinations, dayIndex = 0 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polyline, setPolyline] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadMap();
    return () => {
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance && destinations.length > 0) {
      updateMapMarkers();
    }
  }, [destinations, mapInstance]);

  const loadMap = async () => {
    try {
      const AMap = await AMapLoader.load({
        key: import.meta.env.VITE_AMAP_API_KEY || '',
        version: '2.0',
        plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar']
      });

      if (mapRef.current) {
        const map = new AMap.Map(mapRef.current, {
          zoom: 13,
          resizeEnable: true,
          rotateEnable: true
        });

        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: { top: '110px', right: '40px' } }));

        setMapInstance(map);
        setIsLoaded(true);
      }
    } catch (error) {
      console.error('高德地图加载失败:', error);
      // 如果没有配置 API key，显示提示信息
      setIsLoaded(false);
    }
  };

  const updateMapMarkers = () => {
    if (!mapInstance || destinations.length === 0) return;

    // 清除旧的标记和路线
    markers.forEach(marker => marker.setMap(null));
    if (polyline) {
      polyline.setMap(null);
    }

    // 创建新标记
    const newMarkers: any[] = [];

    destinations.forEach((dest, index) => {
      const marker = new (window as any).AMap.Marker({
        position: [dest.coordinates[1], dest.coordinates[0]], // 高德地图使用 [经度, 纬度]
        title: dest.name,
        content: createMarkerContent(dest, index),
        offset: new (window as any).AMap.Pixel(-20, -40)
      });

      // 创建信息窗体
      const infoWindow = new (window as any).AMap.InfoWindow({
        content: createInfoWindowContent(dest),
        offset: new (window as any).AMap.Pixel(0, -40)
      });

      marker.on('click', () => {
        infoWindow.open(mapInstance, [dest.coordinates[1], dest.coordinates[0]]);
      });

      marker.setMap(mapInstance);
      newMarkers.push(marker);
    });

    // 绘制路线
    if (destinations.length > 1) {
      const path = destinations.map(dest => [dest.coordinates[1], dest.coordinates[0]]);
      const newPolyline = new (window as any).AMap.Polyline({
        path,
        isOutline: true,
        outlineColor: '#ffeeff',
        borderWeight: 1,
        strokeColor: '#4d96ff',
        strokeOpacity: 1,
        strokeWeight: 4,
        strokeStyle: 'dashed',
        lineJoin: 'round'
      });

      newPolyline.setMap(mapInstance);
      setPolyline(newPolyline);
    }

    // 调整视野以包含所有标记
    mapInstance.setFitView(newMarkers);

    setMarkers(newMarkers);
  };

  const createMarkerContent = (dest: Destination, index: number) => {
    const typeColors = {
      attraction: '#ff6b6b',
      restaurant: '#ffd93d',
      hotel: '#6bcb77',
      transport: '#4d96ff'
    };

    const color = typeColors[dest.type] || '#888';

    return `
      <div style="
        position: relative;
        width: 40px;
        height: 40px;
      ">
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
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
            font-size: 16px;
          ">
            ${index + 1}
          </span>
        </div>
      </div>
    `;
  };

  const createInfoWindowContent = (dest: Destination) => {
    return `
      <div style="padding: 12px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
          ${dest.name}
        </h3>
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
          ${dest.description}
        </p>
        <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
          <span>⭐</span>
          <span style="font-size: 14px;">${dest.rating}</span>
        </div>
        ${dest.estimatedDuration > 0 ? `
          <div style="display: flex; align-items: center; gap: 4px;">
            <span>⏱️</span>
            <span style="font-size: 14px; color: #666;">
              预计停留 ${dest.estimatedDuration} 分钟
            </span>
          </div>
        ` : ''}
      </div>
    `;
  };

  // 如果没有 API key 或没有配置，显示提示
  const apiKey = import.meta.env.VITE_AMAP_API_KEY;
  if (!apiKey || apiKey === 'your_amap_api_key_here') {
    return (
      <div style={{
        height: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        color: '#999',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <MapPin size={48} />
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>请配置高德地图 API Key</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            在 .env 文件中设置 VITE_AMAP_API_KEY
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div
      ref={mapRef}
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  );
};

export default AMapVisualization;
