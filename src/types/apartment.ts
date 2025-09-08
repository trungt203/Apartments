// Định nghĩa kiểu dữ liệu cho căn hộ
export interface Apartment {
  id: number;
  trang_thai: string; // Trạng thái: "Đã cho thuê", "Còn trống", "Đang sửa chữa"
  dia_chi: string; // Địa chỉ đầy đủ
  gia_thue: number; // Giá thuê hàng tháng
  dien_tich: number; // Diện tích (m²)
  so_phong_ngu: number; // Số phòng ngủ
  so_phong_tam: number; // Số phòng tắm
  mo_ta: string; // Mô tả chi tiết
  tien_nghi: string[]; // Danh sách tiện nghi
  hinh_anh: string[]; // URL hình ảnh từ Supabase Storage
  ngay_cap_nhat: string; // Ngày cập nhật thông tin
  lien_he: string; // Thông tin liên hệ
}

// Định nghĩa kiểu dữ liệu cho filter tìm kiếm
export interface ApartmentFilter {
  trang_thai?: string;
  gia_thue_min?: number;
  gia_thue_max?: number;
  dien_tich_min?: number;
  dien_tich_max?: number;
  so_phong_ngu?: number;
  so_phong_tam?: number;
}
