
import React, { useState, useRef } from 'react';
import { Upload, Save, Plus, Trash2, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Layout, ImageIcon, Link as LinkIcon, Image as ImageLucide, Type, FileText, X, ArrowUp, ArrowDown, Calendar, Tag, ExternalLink, Smartphone, Monitor, Grid, Home, FileImage } from 'lucide-react';
import { ProgramEvent, AppSettings, Promotion, Region } from '../types';
import { BRANDS, REGIONS } from '../constants';
import * as XLSX from 'xlsx';

interface AdminPageProps {
  events: ProgramEvent[];
  setEvents: (events: ProgramEvent[]) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ events, setEvents, settings, setSettings }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'settings'>('schedule');
  const [localEvents, setLocalEvents] = useState<ProgramEvent[]>(JSON.parse(JSON.stringify(events)));
  const [localSettings, setLocalSettings] = useState<AppSettings>(JSON.parse(JSON.stringify(settings)));
  
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showNotification('error', 'Kích thước ảnh quá lớn (Max 5MB)');
        return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
      showNotification('success', 'Đã tải ảnh lên thành công!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSettingChange = (field: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePromotionChange = (index: number, field: string, value: any) => {
    const updatedPromotions = [...localSettings.promotions];
    updatedPromotions[index] = { ...updatedPromotions[index], [field]: value };
    setLocalSettings(prev => ({ ...prev, promotions: updatedPromotions }));
  };

  const addNewPromotion = () => {
      const today = new Date().toISOString().split('T')[0];
      // Fix: Added missing required property 'cities' to conform with Promotion interface
      const newPromo: Promotion = {
          id: `promo-${Date.now()}`,
          title: 'Chương trình mới',
          brand: 'Heineken',
          image: '',
          mobileImage: '',
          content: 'Nhập nội dung chi tiết chương trình tại đây...',
          type: 'Activation',
          startDate: today,
          endDate: today,
          regions: ['NTW'],
          cities: []
      };
      setLocalSettings(prev => ({ ...prev, promotions: [newPromo, ...prev.promotions] }));
      showNotification('success', 'Đã thêm chương trình mới!');
  };

  const removePromotion = (index: number) => {
      if(window.confirm('Bạn có chắc chắn muốn xóa chương trình này?')) {
        const updatedPromotions = [...localSettings.promotions];
        updatedPromotions.splice(index, 1);
        setLocalSettings(prev => ({ ...prev, promotions: updatedPromotions }));
      }
  };

  const saveAll = () => {
    if (activeTab === 'schedule') {
        setEvents(localEvents);
        showNotification('success', 'Đã cập nhật lịch trình!');
    } else {
        setSettings(localSettings);
        showNotification('success', 'Đã cập nhật giao diện web!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Trang Quản Trị</h2>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('schedule')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'schedule' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Lịch Trình</button>
            <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'settings' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Giao Diện</button>
            <button onClick={saveAll} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-all"><Save className="w-4 h-4" /> Lưu Thay Đổi</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-green-700" /> Quản lý Chương trình</h3>
                    <button onClick={addNewPromotion} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"><Plus className="w-4 h-4" /> Thêm mới</button>
                </div>
                <div className="space-y-6">
                    {localSettings.promotions.map((promo, idx) => (
                        <div key={promo.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Image Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1"><Monitor className="w-3 h-3" /> Ảnh Laptop (PC - Desktop)</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={promo.image} onChange={(e) => handlePromotionChange(idx, 'image', e.target.value)} className="flex-1 p-2 text-sm border rounded" placeholder="https://link-anh-laptop.png" />
                                            <label className="cursor-pointer bg-white border p-2 rounded hover:bg-gray-100"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (val) => handlePromotionChange(idx, 'image', val))} /></label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Ảnh Mobile (Điện thoại)</label>
                                        <div className="flex gap-2">
                                            <input type="text" value={promo.mobileImage} onChange={(e) => handlePromotionChange(idx, 'mobileImage', e.target.value)} className="flex-1 p-2 text-sm border rounded" placeholder="https://link-anh-mobile.png" />
                                            <label className="cursor-pointer bg-white border p-2 rounded hover:bg-gray-100"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (val) => handlePromotionChange(idx, 'mobileImage', val))} /></label>
                                        </div>
                                    </div>
                                </div>
                                {/* Info Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Tiêu đề chương trình</label>
                                        <input type="text" value={promo.title} onChange={(e) => handlePromotionChange(idx, 'title', e.target.value)} className="w-full p-2 text-sm border rounded font-semibold" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Brand</label>
                                            <select value={promo.brand} onChange={(e) => handlePromotionChange(idx, 'brand', e.target.value)} className="w-full p-2 text-sm border rounded">{BRANDS.map(b => <option key={b} value={b}>{b}</option>)}</select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Loại</label>
                                            <select value={promo.type} onChange={(e) => handlePromotionChange(idx, 'type', e.target.value)} className="w-full p-2 text-sm border rounded"><option value="Activation">Activation</option><option value="AWO">AWO</option></select>
                                        </div>
                                    </div>
                                    <button onClick={() => removePromotion(idx)} className="flex items-center gap-1 text-red-600 text-xs font-bold hover:underline mt-2"><Trash2 className="w-3 h-3" /> Xóa chương trình này</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
