# Hướng dẫn cấu hình RLS cho Supabase Storage

## Cú pháp RLS trong PostgreSQL

Khi thiết lập RLS (Row-Level Security) trong PostgreSQL, cần chú ý cú pháp khác nhau cho các loại thao tác:

1. **SELECT, DELETE, UPDATE**: Sử dụng từ khóa `USING` để xác định điều kiện
2. **INSERT**: Sử dụng từ khóa `WITH CHECK` để xác định điều kiện

## Sửa lỗi "only WITH CHECK expression allowed for INSERT"

Lỗi này xảy ra khi bạn sử dụng từ khóa `USING` cho policy INSERT. Cách sửa:

```sql
-- Sai
CREATE POLICY "policy_name" ON table_name FOR INSERT USING (condition);

-- Đúng
CREATE POLICY "policy_name" ON table_name FOR INSERT WITH CHECK (condition);
```

## Giải thích policy trong storage.objects

1. **SELECT**: Cho phép đọc file
   ```sql
   CREATE POLICY "Read Access" ON storage.objects FOR SELECT 
   USING (bucket_id = 'bucket_name');
   ```

2. **INSERT**: Cho phép tải file lên
   ```sql
   CREATE POLICY "Insert Access" ON storage.objects FOR INSERT 
   WITH CHECK (bucket_id = 'bucket_name');
   ```

3. **UPDATE**: Cho phép cập nhật file
   ```sql
   CREATE POLICY "Update Access" ON storage.objects FOR UPDATE 
   USING (bucket_id = 'bucket_name');
   ```

4. **DELETE**: Cho phép xóa file
   ```sql
   CREATE POLICY "Delete Access" ON storage.objects FOR DELETE 
   USING (bucket_id = 'bucket_name');
   ```

## Policy phức tạp hơn

Nếu bạn muốn thêm điều kiện phức tạp, ví dụ chỉ cho phép người dùng xóa file của chính họ:

```sql
CREATE POLICY "Delete Own Files" ON storage.objects FOR DELETE 
USING (
  bucket_id = 'bucket_name' 
  AND (auth.uid() = owner_id OR auth.uid() IN (SELECT id FROM admins))
);
```

## Kiểm tra và quản lý policy

Để xem tất cả policy đã thiết lập trong Supabase:

1. Vào SQL Editor
2. Chạy câu lệnh:
   ```sql
   SELECT * FROM pg_policies WHERE schemaname = 'storage';
   ```

## Xóa policy

Nếu cần xóa một policy đã tạo:

```sql
DROP POLICY "Policy Name" ON storage.objects;
```

## Sửa đổi policy

Để sửa đổi policy:

```sql
ALTER POLICY "Policy Name" ON storage.objects 
[TO role_name] 
[USING (using_expression)] 
[WITH CHECK (check_expression)];
```

## Lưu ý quan trọng

- RLS policies chỉ áp dụng khi được kích hoạt trên bảng
- Để kích hoạt RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Trong Supabase, RLS đã được bật sẵn cho hầu hết các bảng
