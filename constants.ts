import { AppSettings } from './types';
import { PROMOTION_DATA } from './data_promotions';
import { EVENT_DATA } from './data_events';

export const CITIES = ['Hà Nội', 'TP.HCM', 'BRVT', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang', 'Vũng Tàu', 'Bình Dương'];
export const BRANDS = ['Heineken', 'Tiger', 'Bia Việt', 'Bivina', 'Larue', 'Strongbow', 'Edelweiss'];
export const REGIONS = ['NTW', 'GHCM', 'CE', 'NO', 'MKD'];

// Re-export data for App to use
export const MOCK_EVENTS = EVENT_DATA;

export const DEFAULT_SETTINGS: AppSettings = {
  // SỬA LỖI LOGO: Link cũ là link trang web, không phải link ảnh trực tiếp.
  // Đã thay thế bằng logo Heineken SVG chính thức.
  // Nếu muốn dùng ảnh riêng từ Postimg, hãy lấy "Direct Link" (thường có dạng https://i.postimg.cc/.../anh.png)
  logoUrl: 'https://i.postimg.cc/8cK41qW9/logo-heineken-new.jpg',
  
  heroImage: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop',
  heroTitle: 'Khuấy Động Cuộc Vui\nCùng Heineken Vietnam',
  heroSubtitle: 'Khám phá lịch trình các sự kiện sôi động nhất tại các điểm bán trên toàn quốc. Trải nghiệm đẳng cấp, tận hưởng từng khoảnh khắc.',
  
  ctaTitle: 'Bạn đã sẵn sàng nhập tiệc?',
  ctaDescription: 'Tìm ngay địa điểm gần nhất và tham gia vào không khí lễ hội cùng chúng tôi.',

  scheduleTitle: 'Lịch Trình Sự Kiện',
  scheduleSubtitle: 'Tìm kiếm và theo dõi các hoạt động activation mới nhất.',

  promotions: PROMOTION_DATA
};