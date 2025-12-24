import { Promotion } from './types';

// HƯỚNG DẪN CẬP NHẬT (DÙNG CÔNG THỨC EXCEL 2 CỘT ẢNH):
// Cột A: Tên chương trình | Cột B: Brand | Cột C: Loại (Activation/AWO) 
// Cột D: Link Ảnh Laptop   | Cột E: Link Ảnh Mobile
// Cột F: Ngày bắt đầu      | Cột G: Ngày kết thúc | Cột H: Khu vực (VD: NTW, GHCM)
// Cột I: Link list quán    | Cột J: Nội dung
//
// CÔNG THỨC (Dán vào cột K):
// ="{ id: 'promo-" & TEXT(F2,"yymmdd") & "-r" & ROW() & "', title: '" & SUBSTITUTE(A2,"'","\'") & "', brand: '" & B2 & "', type: '" & C2 & "', image: '" & D2 & "', mobileImage: '" & E2 & "', startDate: '" & TEXT(F2,"yyyy-mm-dd") & "', endDate: '" & TEXT(G2,"yyyy-mm-dd") & "', regions: ['" & SUBSTITUTE(H2,", ","','") & "'], venueListLink: '" & I2 & "', content: `" & SUBSTITUTE(J2,"`","'") & "` },"

export const PROMOTION_DATA: Promotion[] = [
  // --- BẮT ĐẦU DÁN DỮ LIỆU TỪ DƯỚI DÒNG NÀY ---
{ id: 'promo-251201-r2', title: 'Tiger Festive - Săn Lộc Bản Lĩnh', brand: 'Tiger', type: 'Activation', image: 'https://i.postimg.cc/1XVz7F9k/Tiger_Festive_Activation.jpg', mobileImage: 'https://i.postimg.cc/yN1YxV48/KV-Tiger-Festive-9-16-VER-001.jpg', startDate: '2025-12-01', endDate: '2026-03-31', regions: ['NTW'], venueListLink: '', content: `Mùa Tết năm nay, Tiger mang đến một hành trình hoàn toàn mới:
“ĐÁNH THỨC BẢN LĨNH – SĂN LỘC KHAI XUÂN.”

Tại Điểm Hẹn Săn Lộc, các mãnh hổ sẽ được mở khóa hàng loạt trải nghiệm đậm tinh thần Tết, đậm màu sắc Tiger!
Hôm nay, Tiger không chỉ chúc lộc,
Tiger trao lộc.
Tiger khơi dậy lộc từ chính bản lĩnh của các mãnh hổ.` },
{ id: 'promo-251201-r3', title: 'Heineken Festive - Mở kết nối thật, Tết bật Heineken', brand: 'Heineken', type: 'Activation', image: 'https://i.postimg.cc/W3VKT4Qd/Design-Manual-TONT-Heineken-Festive-Proposal-Oct17th.png', mobileImage: 'https://i.postimg.cc/X7qyMZvh/z7322898858598_3b4c2214f224ab8c4cc5d9e9e58b39ab.jpg', startDate: '2025-12-01', endDate: '2026-03-31', regions: ['NTW'], venueListLink: '', content: `Tham gia ngay chuỗi sự kiện Heineken để trải nghiệm hương vị bia thượng hạng...` },
{ id: 'promo-260101-r4', title: 'Tiger YEP - Lên Tiệc cùng Tiger', brand: 'Tiger', type: 'AWO', image: 'https://i.postimg.cc/vZkcm4LG/Anh-chup-man-hinh-2025-12-24-023704.png', mobileImage: 'https://i.postimg.cc/NfQTh2pr/Anh-chup-man-hinh-2025-12-24-023505.png', startDate: '2026-01-01', endDate: '2026-04-15', regions: ['GHCM'], venueListLink: 'https://maps.app.goo.gl/TzNCwhxrbuShG3yq7', content: `Thời gian diễn ra: 01/01/2026 – 15/04/2026
 Phạm vi áp dụng: tại Tp. Hồ Chí Minh, Tây Ninh, Bình Dương, Bình Phước, Đồng Nai, Vũng Tàu
Quà tặng từ chương trình: 1 Hộp quà Tết Tiger
Đối tượng tham gia: 
- Mọi công dân đang sinh sống và làm việc tại Việt Nam từ đủ 18 tuổi trở lên, đáp ứng điều kiện đều có thể tham gia chương trình (Có đối chiếu CCCD khi nhận quà, không chụp hình).
- Quà tặng dành cho các khách hàng có tiệc và sử dụng 2 thùng/két Tiger trong thời gian diễn ra chương trình.
- Chương trình chỉ áp dụng tại các quán nằm trong danh sách áp dụng chương trình.
- Khách hàng có tiệc chỉ được nhận tối đa 02 (hai) bộ quà/Bàn trong suốt thời gian diễn ra chương trình.` },
{ id: 'promo-250801-r5', title: 'Tiger SP Kitset', brand: 'Tiger', type: 'AWO', image: '', mobileImage: '', startDate: '2025-08-01', endDate: '2025-12-15', regions: ['GHCM'], venueListLink: '', content: `Khui 6 Tiger 100% nhận quà` },

];