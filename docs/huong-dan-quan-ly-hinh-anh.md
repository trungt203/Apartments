# Hướng dẫn quản lý hình ảnh căn hộ với Supabase Storage

## 1. Thiết lập Storage trong Supabase

### Tạo bucket cho hình ảnh
1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn dự án của bạn
3. Vào menu "Storage" ở bên trái
4. Nhấn "Create new bucket"
5. Đặt tên bucket là "hinh_anh"
6. Đánh dấu "Public bucket" nếu bạn muốn hình ảnh có thể truy cập công khai
7. Nhấn "Create bucket"

### Cấu hình Policies (nếu chưa chạy SQL)
Nếu bạn chưa chạy file SQL để thiết lập policies, hãy vào tab "Policies" của bucket và thiết lập:

1. **Cho phép xem công khai**:
   - Operation: SELECT
   - Policy definition: `true`

2. **Cho phép tải lên hình ảnh**:
   - Operation: INSERT
   - Policy definition: `auth.role() = 'authenticated'`

3. **Cho phép xóa hình ảnh**:
   - Operation: DELETE
   - Policy definition: `auth.uid() = owner OR auth.role() = 'authenticated'`

## 2. Sử dụng Storage trong ứng dụng React

### Tải lên hình ảnh
Trong ứng dụng React, bạn có thể sử dụng đoạn code sau để tải lên hình ảnh:

```typescript
import { supabase } from '../supabase/supabaseClient';

// Hàm tải lên hình ảnh
const uploadImage = async (file: File, apartmentId: number): Promise<string> => {
  try {
    // Tạo tên file duy nhất
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `apartments/${apartmentId}/${fileName}`;

    // Tải lên Supabase Storage
    const { error } = await supabase.storage
      .from('hinh_anh')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Lấy URL công khai của ảnh
    const { data } = supabase.storage
      .from('hinh_anh')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Lỗi khi tải ảnh lên:', error);
    throw error;
  }
};

// Hàm tải lên nhiều ảnh cùng lúc
const uploadMultipleImages = async (
  files: File[],
  apartmentId: number
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, apartmentId));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Lỗi khi tải nhiều ảnh lên:', error);
    throw error;
  }
};
```

### Component tải lên hình ảnh

Đây là ví dụ về một component tải lên hình ảnh:

```tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabase/supabaseClient';

interface ImageUploadProps {
  apartmentId: number;
  onImagesUploaded: (urls: string[]) => void;
}

const UploadContainer = styled.div`
  margin-bottom: 20px;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const UploadLabel = styled.label`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  
  &:hover {
    background-color: #45a049;
  }
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const PreviewImage = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      background-color: rgba(255, 0, 0, 1);
    }
  }
`;

const ImageUpload: React.FC<ImageUploadProps> = ({ apartmentId, onImagesUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      // Tạo URL preview
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Giải phóng URL object để tránh rò rỉ bộ nhớ
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `apartments/${apartmentId}/${fileName}`;
        
        const { error } = await supabase.storage
          .from('hinh_anh')
          .upload(filePath, file);
          
        if (error) {
          console.error('Lỗi khi tải ảnh lên:', error);
          continue;
        }
        
        const { data } = supabase.storage
          .from('hinh_anh')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
      
      // Giải phóng tất cả URL objects
      previews.forEach(preview => URL.revokeObjectURL(preview));
      
      // Xóa tất cả các file đã chọn
      setSelectedFiles([]);
      setPreviews([]);
      
      // Gọi callback với danh sách URL đã tải lên
      onImagesUploaded(uploadedUrls);
      
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <UploadContainer>
      <UploadLabel htmlFor="file-upload">
        Chọn ảnh
      </UploadLabel>
      <UploadInput 
        id="file-upload" 
        type="file" 
        multiple 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      {selectedFiles.length > 0 && (
        <UploadButton 
          onClick={uploadFiles} 
          disabled={uploading}
        >
          {uploading ? 'Đang tải lên...' : `Tải lên ${selectedFiles.length} ảnh`}
        </UploadButton>
      )}
      
      {previews.length > 0 && (
        <PreviewContainer>
          {previews.map((preview, index) => (
            <PreviewImage key={index}>
              <img src={preview} alt={`Preview ${index}`} />
              <button onClick={() => removeFile(index)}>×</button>
            </PreviewImage>
          ))}
        </PreviewContainer>
      )}
    </UploadContainer>
  );
};

export default ImageUpload;
```

## 3. Hiển thị hình ảnh từ Supabase Storage

Để hiển thị hình ảnh từ Supabase Storage, bạn có thể sử dụng URL trực tiếp:

```tsx
import React from 'react';
import styled from 'styled-components';

interface ImageGalleryProps {
  images: string[];
}

const GalleryContainer = styled.div`
  margin-bottom: 20px;
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
`;

const Thumbnail = styled.img<{ active: boolean }>`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.6};
  border: ${props => props.active ? '2px solid #4CAF50' : 'none'};
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  
  // Nếu không có hình ảnh, hiển thị ảnh mặc định
  if (images.length === 0) {
    return (
      <GalleryContainer>
        <MainImage 
          src="https://via.placeholder.com/800x400?text=Không+có+hình+ảnh" 
          alt="Không có hình ảnh" 
        />
      </GalleryContainer>
    );
  }
  
  return (
    <GalleryContainer>
      <MainImage 
        src={images[selectedIndex]} 
        alt={`Hình ảnh ${selectedIndex + 1}`} 
      />
      
      {images.length > 1 && (
        <ThumbnailsContainer>
          {images.map((image, index) => (
            <Thumbnail 
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              active={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </ThumbnailsContainer>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;
```

## 4. Xóa hình ảnh từ Supabase Storage

Để xóa hình ảnh từ Supabase Storage:

```typescript
import { supabase } from '../supabase/supabaseClient';

// Hàm xóa một hình ảnh
const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    // Lấy đường dẫn từ URL
    // Ví dụ: https://xyzsupabase.co/storage/v1/object/public/hinh_anh/apartments/1/123456.jpg
    // -> apartments/1/123456.jpg
    const path = imagePath.split('hinh_anh/')[1];
    
    const { error } = await supabase.storage
      .from('hinh_anh')
      .remove([path]);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    throw error;
  }
};

// Hàm xóa nhiều hình ảnh
const deleteMultipleImages = async (imagePaths: string[]): Promise<void> => {
  try {
    const paths = imagePaths.map(imagePath => {
      return imagePath.split('hinh_anh/')[1];
    });
    
    const { error } = await supabase.storage
      .from('hinh_anh')
      .remove(paths);
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Lỗi khi xóa nhiều ảnh:', error);
    throw error;
  }
};
```

## 5. Lưu ý quan trọng

1. **Quản lý URL hình ảnh**:
   - Khi tải lên hình ảnh thành công, lưu URL vào mảng `hinh_anh` trong bảng `can_ho`
   - Khi cập nhật căn hộ, cập nhật mảng URL mới

2. **Xóa hình ảnh khi xóa căn hộ**:
   - Khi xóa một căn hộ, hãy nhớ xóa tất cả hình ảnh liên quan trong Storage
   - Có thể tạo function/trigger trong PostgreSQL để tự động xóa

3. **Xử lý lỗi**:
   - Luôn xử lý lỗi khi tải lên/xóa hình ảnh
   - Hiển thị thông báo lỗi cho người dùng

4. **Giới hạn kích thước**:
   - Nên giới hạn kích thước hình ảnh tải lên (khuyến nghị < 5MB)
   - Có thể nén ảnh phía client trước khi tải lên

5. **Bảo mật**:
   - Luôn kiểm tra quyền người dùng trước khi cho phép tải lên/xóa
   - Tránh để lộ URL bucket không công khai

## 6. Tối ưu hóa

1. **Tối ưu hóa hình ảnh**:
   - Sử dụng thư viện như `browser-image-compression` để nén ảnh trước khi tải lên
   - Tạo thumbnail cho hiển thị danh sách, giữ ảnh gốc cho chi tiết

2. **Lazy loading**:
   - Sử dụng `loading="lazy"` cho các thẻ `<img>` hoặc thư viện lazy-loading

3. **Quản lý cache**:
   - Thêm headers cache phù hợp cho bucket Storage
