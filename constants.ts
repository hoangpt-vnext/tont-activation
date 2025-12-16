import { ProgramEvent, Promotion, AppSettings } from './types';

export const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Nha Trang'];
export const BRANDS = ['Heineken', 'Tiger', 'Bia Việt', 'Bivina', 'Larue', 'Strongbow'];

export const DEFAULT_SETTINGS: AppSettings = {
  logoUrl: 'https://cdn.haitrieu.com/wp-content/uploads/2022/12/Logo-Heineken-Vietnam.png',
  
  heroImage: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?q=80&w=2070&auto=format&fit=crop',
  heroTitle: 'Khuấy Động Cuộc Vui\nCùng Heineken Vietnam',
  heroSubtitle: 'Khám phá lịch trình các sự kiện sôi động nhất tại các điểm bán trên toàn quốc. Trải nghiệm đẳng cấp, tận hưởng từng khoảnh khắc.',
  
  ctaTitle: 'Bạn đã sẵn sàng nhập tiệc?',
  ctaDescription: 'Tìm ngay địa điểm gần nhất và tham gia vào không khí lễ hội cùng chúng tôi.',

  scheduleTitle: 'Lịch Trình Sự Kiện',
  scheduleSubtitle: 'Tìm kiếm và theo dõi các hoạt động activation mới nhất.',

  promotions: [
    {
      id: '1',
      title: 'Heineken - Nhẹ Êm Mà Đậm Chất',
      image: 'https://images.unsplash.com/photo-1623592863624-9b8824142fb7?q=80&w=800&auto=format&fit=crop',
      brand: 'Heineken',
      content: `Tham gia ngay chuỗi sự kiện Heineken để trải nghiệm hương vị bia thượng hạng...\n\n1. Thời gian: Từ 01/11 đến 31/12\n2. Địa điểm: Các beer club trên toàn quốc\n3. Quà tặng: Cơ hội nhận ngay 1 thùng bia Heineken Silver khi check-in tại sự kiện.`
    },
    {
      id: '2',
      title: 'Tiger - Sảng Khoái Bùng Nổ',
      image: 'https://images.unsplash.com/photo-1567602336688-66236b2886f4?q=80&w=800&auto=format&fit=crop',
      brand: 'Tiger',
      content: `Đánh thức bản lĩnh cùng Tiger Beer. Đừng bỏ lỡ đêm nhạc EDM sôi động...\n\nThể lệ tham dự:\n- Mua 1 tháp bia Tiger tặng 1 phiếu bốc thăm\n- Giải nhất: iPhone 15 Pro Max`
    },
    {
      id: '3',
      title: 'Bia Việt - Tự Hào Chất Việt',
      image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800&auto=format&fit=crop',
      brand: 'Bia Việt',
      content: `Bia Việt kết nối mọi người, cùng nâng ly chúc mừng chiến thắng đội tuyển Việt Nam.`
    },
    {
      id: '4',
      title: 'Strongbow - Cider Chill Phết',
      image: 'https://images.unsplash.com/photo-1571616428782-9cb99e46a7be?q=80&w=800&auto=format&fit=crop',
      brand: 'Strongbow',
      content: `Chill nhẹ nhàng cùng Strongbow Cider vị dâu đỏ mọng. Không gian âm nhạc Acoustic lãng mạn đang chờ bạn.`
    }
  ]
};

// Helper to get today's date in YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

export const MOCK_EVENTS: ProgramEvent[] = [
  {
    id: '1',
    city: 'Hà Nội',
    date: getToday(), // Set to today for demo
    time: '19:00 - 21:00',
    venue: 'Sky Bar 360',
    address: '54 Liễu Giai, Ba Đình',
    mapLink: '', 
    brand: 'Heineken',
    description: 'Đêm nhạc acoustic chill'
  },
  {
    id: '2',
    city: 'TP. Hồ Chí Minh',
    date: '2023-11-16',
    time: '20:00 - 22:00',
    venue: 'Beer Club Vuvuzela',
    address: '11B Nguyễn Bỉnh Khiêm, Quận 1',
    brand: 'Tiger',
    description: 'Sôi động cùng DJ Tít'
  },
  {
    id: '3',
    city: 'Đà Nẵng',
    date: '2023-11-17',
    time: '18:30 - 20:30',
    venue: 'Golden Pine Pub',
    address: '52 Bạch Đằng, Hải Châu 1',
    mapLink: 'https://goo.gl/maps/example',
    brand: 'Larue',
    description: 'Tiệc bia bên sông Hàn'
  },
  {
    id: '4',
    city: 'Nha Trang',
    date: '2023-11-22',
    time: '16:00 - 19:00',
    venue: 'Sailing Club',
    address: '72-74 Trần Phú, Lộc Thọ',
    brand: 'Bivina',
    description: 'Beach Party sôi động'
  },
  {
    id: '5',
    city: 'Hà Nội',
    date: '2023-11-23',
    time: '18:00 - 20:00',
    venue: 'Tạ Hiện Corner',
    address: 'Ngã tư Tạ Hiện - Lương Ngọc Quyến',
    brand: 'Bia Việt',
    description: 'Street Food & Beer'
  }
];