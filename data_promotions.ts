
import { Promotion } from './types';

// HƯỚNG DẪN CẬP NHẬT (DÙNG CÔNG THỨC EXCEL CHO DANH SÁCH CHƯƠNG TRÌNH):
// Thứ tự các cột trong Excel của bạn:
// A: STT | B: Brand | C: Type (Activation/AWO) | D: Title | E: Region (Dữ liệu: GHCM, NO, CE, MKD) 
// F: Start Date | G: End Date | H: PC Image Link 
// I: Mobile Image Link | J: Venue List Link (AWO only) | K: Content
//
// CÔNG THỨC CHỐNG LỖI XUỐNG DÒNG (Dán vào cột L):
// ="{ id: 'promo-" & TEXT(F2,"yymmdd") & "-r" & ROW() & "', title: '" & SUBSTITUTE(SUBSTITUTE(D2, CHAR(10), " "), "'", "\'") & "', brand: '" & B2 & "', type: '" & C2 & "', regions: ['" & E2 & "'], cities: [], startDate: '" & TEXT(F2,"yyyy-mm-dd") & "', endDate: '" & TEXT(G2,"yyyy-mm-dd") & "', image: '" & H2 & "', mobileImage: '" & I2 & "', bu: '" & E2 & "', venueListLink: '" & J2 & "', content: '" & SUBSTITUTE(SUBSTITUTE(K2, CHAR(10), "\n"), "'", "\'") & "' },"

export const PROMOTION_DATA: Promotion[] = [
{ 
  id: 'promo-251201-r2', 
  title: 'Tiger Festive - Săn Lộc Bản Lĩnh', 
  brand: 'Tiger', 
  type: 'Activation', 
  image: 'https://i.postimg.cc/1XVz7F9k/Tiger_Festive_Activation.jpg', 
  mobileImage: 'https://i.postimg.cc/yN1YxV48/KV-Tiger-Festive-9-16-VER-001.jpg', 
  startDate: '2025-12-01', 
  endDate: '2026-03-31', 
  regions: ['NTW'],
  cities: ['Hà Nội', 'Hải Phòng'],
  bu: 'NTW',
  content: `Mùa Tết năm nay, Tiger mang đến một hành trình hoàn toàn mới: “ĐÁNH THỨC BẢN LĨNH – SĂN LỘC KHAI XUÂN.”` 
},
{ 
  id: 'promo-251201-r3', 
  title: 'Heineken Festive - Mở kết nối thật, Tết bật Heineken', 
  brand: 'Heineken', 
  type: 'Activation', 
  image: 'https://i.postimg.cc/W3VKT4Qd/Design-Manual-TONT-Heineken-Festive-Proposal-Oct17th.png', 
  mobileImage: 'https://i.postimg.cc/X7qyMZvh/z7322898858598_3b4c2214f224ab8c4cc5d9e9e58b39ab.jpg', 
  startDate: '2025-12-01', 
  endDate: '2026-03-31', 
  regions: ['NTW'],
  cities: ['Hà Nội', 'Đà Nẵng'],
  bu: 'NTW',
  content: `Tham gia ngay chuỗi sự kiện Heineken để trải nghiệm hương vị bia thượng hạng...` 
},
{ 
  id: 'promo-260101-r4', 
  title: 'Tiger YEP - Lên Tiệc cùng Tiger', 
  brand: 'Tiger', 
  type: 'AWO', 
  image: 'https://i.postimg.cc/vZkcm4LG/Anh-chup-man-hinh-2025-12-24-023704.png', 
  mobileImage: 'https://i.postimg.cc/NfQTh2pr/Anh-chup-man-hinh-2025-12-24-023505.png', 
  startDate: '2026-01-01', 
  endDate: '2026-04-15', 
  regions: ['GHCM'],
  cities: [],
  bu: 'GHCM',
  venueListLink: 'https://maps.app.goo.gl/TzNCwhxrbuShG3yq7', 
  content: `Thời gian diễn ra: 01/01/2026 – 15/04/2026...` 
},
{ 
  id: 'promo-250801-r5', 
  title: 'Tiger SP Kitset', 
  brand: 'Tiger', 
  type: 'AWO', 
  image: '', 
  mobileImage: '', 
  startDate: '2025-08-01', 
  endDate: '2025-12-15', 
  regions: ['GHCM'],
  cities: [],
  bu: 'GHCM',
  content: `Khui 6 Tiger 100% nhận quà` 
},
];
