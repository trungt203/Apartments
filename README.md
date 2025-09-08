# Ứng dụng Quản lý Căn hộ cho Thuê

Ứng dụng React để hiển thị và quản lý danh sách các căn hộ cho thuê, với giao diện tiếng Việt và kết nối với Supabase.

## Các chức năng chính

- Hiển thị danh sách căn hộ cho thuê
- Xem thông tin chi tiết từng căn hộ
- Lọc căn hộ theo nhiều tiêu chí: trạng thái, giá, diện tích, số phòng ngủ/tắm
- Quản lý hình ảnh sử dụng Supabase Storage
- Giao diện hoàn toàn bằng tiếng Việt

## Cài đặt

1. Clone repository này về máy:

```bash
git clone <repository-url>
cd apartments-app
```

2. Cài đặt các thư viện phụ thuộc:

```bash
npm install
```

3. Cấu hình Supabase:

- Tạo tài khoản và dự án mới tại [Supabase](https://supabase.com)
- Tạo bảng `can_ho` với cấu trúc phù hợp (xem hướng dẫn bên dưới)
- Tạo bucket `hinh_anh` trong Storage để lưu trữ hình ảnh
- Cập nhật thông tin kết nối trong file `src/supabase/supabaseClient.ts`

4. Khởi chạy ứng dụng:

```bash
npm start
```

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
