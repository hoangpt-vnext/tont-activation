import React, { useState, useRef } from 'react';
import { Upload, Save, Plus, Trash2, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Layout, ImageIcon, Link as LinkIcon, Image as ImageLucide, Type, FileText } from 'lucide-react';
import { ProgramEvent, AppSettings } from '../types';
import { BRANDS } from '../constants';
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

  // --- Image Upload Logic ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
        showNotification('error', 'Kích thước ảnh quá lớn (Max 5MB)');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      callback(result);
      showNotification('success', 'Đã tải ảnh lên thành công!');
    };
    reader.onerror = () => {
        showNotification('error', 'Lỗi khi đọc file ảnh');
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  // --- Schedule Logic ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Robust ID generation to avoid duplicates
        const mappedEvents: ProgramEvent[] = jsonData.map((row: any, index: number) => ({
          id: `excel-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          city: row['Thành phố'] || row['City'] || '',
          date: row['Ngày'] || row['Date'] || '',
          time: row['Giờ'] || row['Time'] || '',
          venue: row['Tên quán'] || row['Venue'] || '',
          address: row['Địa chỉ'] || row['Address'] || '',
          // Check for 'Link' or 'Map Link' columns in excel
          mapLink: row['Link'] || row['Map Link'] || row['Link bản đồ'] || '',
          brand: row['Brand'] || '',
          description: row['Ghi chú'] || row['Description'] || ''
        }));

        setLocalEvents(mappedEvents);
        showNotification('success', `Đã nhập thành công ${mappedEvents.length} dòng từ Excel!`);
      } catch (error) {
        console.error("Excel Error:", error);
        showNotification('error', 'Lỗi đọc file Excel. Vui lòng kiểm tra định dạng.');
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCellChange = (id: string, field: keyof ProgramEvent, value: string) => {
    setLocalEvents(prev => prev.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const addNewRow = () => {
    const newEvent: ProgramEvent = {
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      city: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00 - 21:00',
      venue: '',
      address: '',
      mapLink: '',
      brand: 'Heineken',
      description: ''
    };
    setLocalEvents([newEvent, ...localEvents]);
  };

  const removeRow = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa dòng này?')) {
      setLocalEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const downloadTemplate = () => {
    const template = [
      { 
        'Thành phố': 'Hà Nội', 
        'Ngày': '2023-12-01', 
        'Giờ': '19:30 - 21:30', 
        'Tên quán': 'Tên quán mẫu', 
        'Địa chỉ': '123 Đường ABC', 
        'Link bản đồ': 'https://goo.gl/maps/xyz',
        'Brand': 'Tiger', 
        'Ghi chú': 'Mô tả sự kiện' 
      }
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Mau_Lich_Activation.xlsx");
  };

  // --- Settings Logic ---

  const handleSettingChange = (field: keyof AppSettings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePromotionChange = (index: number, field: string, value: string) => {
    const updatedPromotions = [...localSettings.promotions];
    updatedPromotions[index] = { ...updatedPromotions[index], [field]: value };
    setLocalSettings(prev => ({ ...prev, promotions: updatedPromotions }));
  };

  // --- Common ---

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
      {/* Header Admin */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Trang Quản Trị</h2>
            <div className="flex gap-4 mt-2">
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Quản lý Lịch trình
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'settings' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Quản lý Giao diện
                </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {activeTab === 'schedule' && (
                <>
                    <button 
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Mẫu Excel
                    </button>
                    <div className="relative">
                        <input 
                            type="file" 
                            accept=".xlsx, .xls, .csv" 
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            className="hidden"
                            id="excel-upload"
                        />
                        <label 
                            htmlFor="excel-upload"
                            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 cursor-pointer transition-colors text-sm font-medium"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Nhập Excel
                        </label>
                    </div>
                </>
            )}
            <button 
                onClick={saveAll}
                className="flex items-center gap-2 px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors text-sm font-bold shadow-sm"
            >
                <Save className="w-4 h-4" />
                Lưu {activeTab === 'schedule' ? 'Lịch trình' : 'Cấu hình'}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'schedule' ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                 <h3 className="font-semibold text-gray-700">Dữ liệu hiện tại ({localEvents.length} dòng)</h3>
                 <button 
                     onClick={addNewRow}
                     className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                 >
                     <Plus className="w-4 h-4" /> Thêm dòng mới
                 </button>
             </div>
             
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                 <thead className="bg-gray-50">
                     <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">#</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành phố</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày (YYYY-MM-DD)</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Quán</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link bản đồ</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                     <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Xóa</th>
                     </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                     {localEvents.map((event, idx) => (
                     <tr key={event.id} className="hover:bg-gray-50">
                         <td className="px-4 py-2 text-xs text-gray-400">{idx + 1}</td>
                         <td className="px-2 py-2">
                             <input 
                                 type="text" 
                                 value={event.city}
                                 onChange={(e) => handleCellChange(event.id, 'city', e.target.value)}
                                 className="w-full p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm outline-none"
                             />
                         </td>
                         <td className="px-2 py-2">
                             <input 
                                 type="text"
                                 value={event.date}
                                 onChange={(e) => handleCellChange(event.id, 'date', e.target.value)}
                                 className="w-full p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm outline-none"
                                 placeholder="YYYY-MM-DD"
                             />
                         </td>
                         <td className="px-2 py-2">
                             <input 
                                 type="text"
                                 value={event.time}
                                 onChange={(e) => handleCellChange(event.id, 'time', e.target.value)}
                                 className="w-24 p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm outline-none"
                                 placeholder="hh:mm - hh:mm"
                             />
                         </td>
                         <td className="px-2 py-2">
                             <input 
                                 type="text"
                                 value={event.venue}
                                 onChange={(e) => handleCellChange(event.id, 'venue', e.target.value)}
                                 className="w-full p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm font-medium outline-none"
                             />
                         </td>
                          <td className="px-2 py-2">
                             <input 
                                 type="text"
                                 value={event.address}
                                 onChange={(e) => handleCellChange(event.id, 'address', e.target.value)}
                                 className="w-full p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm outline-none"
                             />
                         </td>
                         <td className="px-2 py-2">
                             <div className="relative">
                                <input 
                                    type="text"
                                    value={event.mapLink || ''}
                                    onChange={(e) => handleCellChange(event.id, 'mapLink', e.target.value)}
                                    className="w-full pl-6 p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-sm outline-none text-blue-600"
                                    placeholder="https://..."
                                />
                                <LinkIcon className="w-3 h-3 absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" />
                             </div>
                         </td>
                         <td className="px-2 py-2">
                             <select 
                                 value={event.brand}
                                 onChange={(e) => handleCellChange(event.id, 'brand', e.target.value)}
                                 className="w-full p-1 border border-transparent hover:border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded text-xs outline-none bg-transparent"
                             >
                                {BRANDS.map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                             </select>
                         </td>
                         <td className="px-2 py-2 text-center">
                             <button 
                                 onClick={() => removeRow(event.id)}
                                 className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                             >
                                 <Trash2 className="w-4 h-4" />
                             </button>
                         </td>
                     </tr>
                     ))}
                 </tbody>
                 </table>
             </div>
             {localEvents.length === 0 && (
                 <div className="p-8 text-center text-gray-500 bg-gray-50">
                     Chưa có dữ liệu. Hãy tải file Excel hoặc thêm dòng mới.
                 </div>
             )}
         </div>
        ) : (
            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-green-700" />
                        Thiết lập chung
                    </h3>
                    <div className="grid gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={localSettings.logoUrl}
                                            onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                            placeholder="https://..."
                                        />
                                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center transition-colors" title="Tải ảnh lên">
                                            <Upload className="w-4 h-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (val) => handleSettingChange('logoUrl', val))} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Dán link ảnh hoặc tải ảnh từ máy tính (Logo hiển thị trên thanh menu).</p>
                                </div>
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center p-2 border border-gray-200">
                                    {localSettings.logoUrl ? (
                                        <img src={localSettings.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <ImageLucide className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (Hero Image)</label>
                             <div className="flex flex-col gap-4">
                                <div className="flex-1">
                                     <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={localSettings.heroImage}
                                            onChange={(e) => handleSettingChange('heroImage', e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                            placeholder="https://..."
                                        />
                                         <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300 rounded-lg px-3 py-2 flex items-center justify-center transition-colors" title="Tải ảnh lên">
                                            <Upload className="w-4 h-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (val) => handleSettingChange('heroImage', val))} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Ảnh lớn hiển thị ở đầu trang chủ.</p>
                                </div>
                                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
                                    {localSettings.heroImage ? (
                                        <img src={localSettings.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Không có ảnh</div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Preview</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Settings (Wording) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Type className="w-5 h-5 text-green-700" />
                        Nội dung chữ (Wording)
                    </h3>
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề Trang Chủ (Hero Title)</label>
                                <textarea 
                                    value={localSettings.heroTitle}
                                    onChange={(e) => handleSettingChange('heroTitle', e.target.value)}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả Trang Chủ (Hero Subtitle)</label>
                                <textarea 
                                    value={localSettings.heroSubtitle}
                                    onChange={(e) => handleSettingChange('heroSubtitle', e.target.value)}
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                         {/* CTA Section Config */}
                         <div className="border-t border-gray-100 pt-6 mt-2">
                            <h4 className="font-semibold text-gray-700 mb-3">Phần kêu gọi hành động (Footer CTA)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề CTA</label>
                                    <textarea 
                                        value={localSettings.ctaTitle || 'Bạn đã sẵn sàng nhập tiệc?'}
                                        onChange={(e) => handleSettingChange('ctaTitle', e.target.value)}
                                        rows={2}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả CTA</label>
                                    <textarea 
                                        value={localSettings.ctaDescription || 'Tìm ngay địa điểm gần nhất và tham gia vào không khí lễ hội cùng chúng tôi.'}
                                        onChange={(e) => handleSettingChange('ctaDescription', e.target.value)}
                                        rows={2}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề Lịch Trình</label>
                                <input 
                                    type="text"
                                    value={localSettings.scheduleTitle}
                                    onChange={(e) => handleSettingChange('scheduleTitle', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả Lịch Trình</label>
                                <input 
                                    type="text"
                                    value={localSettings.scheduleSubtitle}
                                    onChange={(e) => handleSettingChange('scheduleSubtitle', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Promotions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-green-700" />
                        Quản lý Chương trình (Carousel & Blog)
                    </h3>
                    <div className="space-y-6">
                        {localSettings.promotions.map((promo, idx) => (
                            <div key={promo.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                    <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        {promo.image ? (
                                            <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><ImageLucide className="w-6 h-6 text-gray-400"/></div>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Tiêu đề</label>
                                            <input 
                                                type="text" 
                                                value={promo.title}
                                                onChange={(e) => handlePromotionChange(idx, 'title', e.target.value)}
                                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
                                            <select 
                                                value={promo.brand}
                                                onChange={(e) => handlePromotionChange(idx, 'brand', e.target.value)}
                                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                            >
                                                {BRANDS.map(b => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Link Ảnh / Upload</label>
                                            <div className="flex items-center gap-2">
                                                <LinkIcon className="w-4 h-4 text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    value={promo.image}
                                                    onChange={(e) => handlePromotionChange(idx, 'image', e.target.value)}
                                                    className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                                <label className="cursor-pointer bg-white hover:bg-gray-100 text-gray-600 border border-gray-300 rounded px-3 py-2 flex items-center justify-center transition-colors shadow-sm" title="Upload ảnh từ máy">
                                                    <Upload className="w-4 h-4" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (val) => handlePromotionChange(idx, 'image', val))} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Nội dung chi tiết (Thể lệ / Blog)
                                    </label>
                                    <textarea 
                                        value={promo.content || ''}
                                        onChange={(e) => handlePromotionChange(idx, 'content', e.target.value)}
                                        rows={6}
                                        className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none font-mono"
                                        placeholder="Nhập nội dung chi tiết của chương trình tại đây..."
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Xuống dòng để tách đoạn văn.</p>
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