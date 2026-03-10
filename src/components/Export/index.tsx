import React from 'react';
import { Button, Space, message } from 'antd';
import { Download, FileText, Image as ImageIcon } from 'lucide-react';
import { TripPlan } from '../../types';
import { exportToPDF, exportToImage, exportBudgetToPDF } from '../../utils/export';

interface ExportProps {
  tripPlan: TripPlan | null;
  elementId: string;
}

const Export: React.FC<ExportProps> = ({ tripPlan, elementId }) => {
  const handleExportPDF = async () => {
    if (!tripPlan) {
      message.warning('请先生成行程');
      return;
    }

    try {
      await exportToPDF(tripPlan, elementId);
      message.success('PDF导出成功');
    } catch (error) {
      message.error('PDF导出失败，请重试');
    }
  };

  const handleExportImage = async () => {
    if (!tripPlan) {
      message.warning('请先生成行程');
      return;
    }

    try {
      await exportToImage(elementId);
      message.success('图片导出成功');
    } catch (error) {
      message.error('图片导出失败，请重试');
    }
  };

  const handleExportBudget = () => {
    if (!tripPlan) {
      message.warning('请先生成行程');
      return;
    }

    try {
      exportBudgetToPDF(tripPlan);
      message.success('预算明细导出成功');
    } catch (error) {
      message.error('预算明细导出失败，请重试');
    }
  };

  if (!tripPlan) {
    return null;
  }

  return (
    <Space size="middle">
      <Button
        type="default"
        icon={<FileText size={18} />}
        onClick={handleExportPDF}
        style={{
          height: '40px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        导出PDF
      </Button>

      <Button
        type="default"
        icon={<ImageIcon size={18} />}
        onClick={handleExportImage}
        style={{
          height: '40px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        导出图片
      </Button>

      <Button
        type="primary"
        icon={<Download size={18} />}
        onClick={handleExportBudget}
        style={{
          height: '40px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        导出预算明细
      </Button>
    </Space>
  );
};

export default Export;
