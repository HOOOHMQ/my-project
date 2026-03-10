import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { TripPlan } from '../types';

/**
 * 导出为PDF
 */
export const exportToPDF = async (tripPlan: TripPlan, elementId: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('找不到要导出的元素');
    }

    // 使用html2canvas将元素转换为canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // A4宽度
    const pageHeight = 297; // A4高度
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // 第一页
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果内容超过一页，添加新页
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 生成PDF文件名
    const fileName = `旅行计划-${tripPlan.preferences.destination}-${tripPlan.id}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('导出PDF失败:', error);
    throw error;
  }
};

/**
 * 导出为图片
 */
export const exportToImage = async (elementId: string): Promise<void> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('找不到要导出的元素');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const link = document.createElement('a');
    link.download = `旅行计划-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('导出图片失败:', error);
    throw error;
  }
};

/**
 * 导出预算明细为PDF
 */
export const exportBudgetToPDF = (tripPlan: TripPlan): void => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // 标题
    pdf.setFontSize(20);
    pdf.text(`${tripPlan.preferences.destination} 旅行预算明细`, 105, 20, { align: 'center' });

    // 基本信息
    pdf.setFontSize(12);
    pdf.text(`出发日期: ${tripPlan.preferences.startDate}`, 20, 35);
    pdf.text(`结束日期: ${tripPlan.preferences.endDate}`, 20, 42);
    pdf.text(`人数: ${tripPlan.preferences.participants}`, 20, 49);
    pdf.text(`总预算: ¥${tripPlan.totalBudget.toLocaleString()}`, 20, 56);

    // 生成每日预算表格
    const tableData = tripPlan.days.flatMap((day, index) => {
      const dayData = [
        [`第 ${index + 1} 天 (${day.date})`, '', '', ''],
        ...day.budget.map(item => [
          '',
          getCategoryName(item.category),
          item.name,
          `¥${item.amount.toLocaleString()}`
        ])
      ];
      return dayData;
    });

    autoTable(pdf, {
      startY: 70,
      head: [['日期', '类别', '项目', '金额']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [66, 139, 202] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30, fontStyle: 'bold' }
      }
    });

    pdf.save(`预算明细-${tripPlan.preferences.destination}.pdf`);
  } catch (error) {
    console.error('导出预算PDF失败:', error);
    throw error;
  }
};

/**
 * 获取类别名称
 */
const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    ticket: '门票',
    hotel: '住宿',
    restaurant: '餐饮',
    transport: '交通',
    other: '其他'
  };
  return categoryMap[category] || category;
};

/**
 * 格式化日期
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

/**
 * 格式化货币
 */
export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString()}`;
};

/**
 * 计算天数差
 */
export const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};
