# Hướng dẫn khắc phục lỗi khi tải ảnh lên Supabase Storage

## Vấn đề

Khi tải hình ảnh lên, bạn có thể gặp lỗi:
```
Lỗi khi tải ảnh "z6956819127293_4f80ed3406dd391dee59398f3da0f645.jpg": new row violates row-level security policy
```

Đây là vấn đề liên quan đến chính sách bảo mật cấp hàng (Row-Level Security - RLS) trong Supabase. RLS là một tính năng an ninh giúp kiểm soát quyền truy cập vào dữ liệu và file dựa trên các quy tắc.

## Giải pháp

### 1. Cập nhật mã nguồn

Đã cập nhật hàm upload trong file `ApartmentImageUpload.tsx` để thêm metadata khi tải lên. Điều này giúp chính sách RLS có thể xác định đúng quyền truy cập.

### 2. Thiết lập chính sách RLS trong Supabase

Sử dụng script SQL trong file `database/supabase-storage-rls.sql` để thiết lập chính sách RLS cho bucket storage:

1. Đăng nhập vào Supabase Dashboard
2. Chọn dự án của bạn
3. Chuyển đến "SQL Editor"
4. Mở script `supabase-storage-rls.sql`
5. Chạy script này để thiết lập chính sách RLS

### 3. Xác minh cấu hình Storage

1. Trong Supabase Dashboard, chuyển đến tab "Storage"
2. Xác nhận bucket "hinh_anh" đã được tạo
3. Kiểm tra tab "Policies" để đảm bảo các chính sách đã được áp dụng:
   - SELECT: Cho phép mọi người xem hình ảnh
   - INSERT: Cho phép tải lên hình ảnh
   - UPDATE: Cho phép cập nhật hình ảnh 
   - DELETE: Cho phép xóa hình ảnh

### 4. Kiểm tra Authentication (nếu cần)

Nếu bạn sử dụng xác thực trong ứng dụng:
1. Đảm bảo người dùng đã đăng nhập trước khi tải ảnh lên
2. Kiểm tra trạng thái session trong supabaseClient

## Ghi chú

- Metadata giúp Supabase xác định quyền sở hữu file
- RLS policies kiểm soát quyền truy cập đến từng file
- Các policy có thể được tùy chỉnh dựa trên yêu cầu cụ thể của ứng dụng

## Kiểm tra sau khi cấu hình

Sau khi thiết lập, hãy thử tải lại một hình ảnh để xác nhận rằng lỗi đã được khắc phục.
