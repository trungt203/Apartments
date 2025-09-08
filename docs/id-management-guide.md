# Hướng dẫn quản lý ID tự động cho bảng căn hộ

## Tổng quan

Script SQL `id-management.sql` cung cấp các tính năng quản lý ID tự động cho bảng `can_ho`:

1. **ID tự tăng theo ID cao nhất**: Khi thêm căn hộ mới, ID sẽ tự động tăng dựa trên ID cao nhất hiện có
2. **ID tự động dồn lại**: Khi xóa căn hộ và còn ít hơn 5 bản ghi, ID sẽ tự động được đánh số lại từ 1

## Cách triển khai

### 1. Chạy script SQL trong Supabase

1. Đăng nhập vào Supabase Dashboard
2. Chọn dự án của bạn
3. Chuyển đến "SQL Editor"
4. Mở file `id-management.sql`
5. Chạy script để áp dụng các thay đổi

### 2. Các tính năng chính

Script này thực hiện các thay đổi sau:

#### Tự động tăng ID dựa trên ID cao nhất

```sql
CREATE OR REPLACE FUNCTION auto_increment_can_ho_id()
RETURNS TRIGGER AS $$
DECLARE
  max_id BIGINT;
BEGIN
  -- Lấy ID lớn nhất hiện tại
  SELECT COALESCE(MAX(id), 0) INTO max_id FROM can_ho;
  
  -- Đặt ID mới cao hơn ID cao nhất
  NEW.id := max_id + 1;
  
  -- Cập nhật sequence
  PERFORM setval('can_ho_id_seq', NEW.id, true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Tự động dồn ID khi xóa

```sql
CREATE OR REPLACE FUNCTION reindex_can_ho_after_delete()
RETURNS TRIGGER AS $$
DECLARE
  max_id BIGINT;
  curr_id BIGINT;
  temp_table_name TEXT;
BEGIN
  -- Lấy ID lớn nhất hiện tại
  SELECT COALESCE(MAX(id), 0) INTO max_id FROM can_ho;
  
  -- Nếu không còn căn hộ nào hoặc chỉ còn ít căn hộ, reset sequence
  IF max_id <= 5 THEN
    -- Đánh số lại từ 1 nếu ít căn hộ
    temp_table_name := 'temp_can_ho_' || NOW()::TEXT;
    
    -- Tạo bảng tạm để lưu trữ dữ liệu
    EXECUTE 'CREATE TABLE ' || temp_table_name || ' AS SELECT * FROM can_ho';
    
    -- Xóa dữ liệu từ bảng chính
    TRUNCATE TABLE can_ho RESTART IDENTITY CASCADE;
    
    -- Chèn lại dữ liệu với ID mới
    EXECUTE 'INSERT INTO can_ho (...) SELECT ... FROM ' || temp_table_name;
    
    -- Xóa bảng tạm
    EXECUTE 'DROP TABLE ' || temp_table_name;
  ELSE
    -- Chỉ cập nhật lại sequence
    PERFORM setval('can_ho_id_seq', max_id + 1, false);
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
```

### 3. Dồn lại ID theo ý muốn

Nếu bạn muốn dồn lại ID bất cứ lúc nào, bạn có thể sử dụng hàm `reindex_can_ho_manually()`:

```sql
SELECT reindex_can_ho_manually();
```

## Tác động đến ứng dụng

Sau khi áp dụng những thay đổi này:

1. **Thêm căn hộ mới**: Không cần thay đổi mã nguồn, ID sẽ tự động được tạo cao hơn ID cao nhất hiện có.

2. **Xóa căn hộ**: Không cần thay đổi mã nguồn, ID sẽ tự động được dồn lại nếu số lượng căn hộ còn ít (<=5).

3. **Hợp đồng và quan hệ khóa ngoại**: Script đã cập nhật ràng buộc khóa ngoại để tự động xóa các bản ghi liên quan khi xóa căn hộ.

## Lưu ý

1. **Backup dữ liệu**: Hãy backup dữ liệu trước khi chạy script này.

2. **Số lượng căn hộ tối thiểu để dồn lại**: Mặc định là 5, bạn có thể điều chỉnh số này trong script nếu cần.

3. **Các bảng liên quan**: Nếu có thêm bảng khác tham chiếu đến `can_ho.id`, bạn cần cập nhật ràng buộc khóa ngoại tương tự như đã làm với bảng `hop_dong`.
