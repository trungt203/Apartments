import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabase/supabaseClient';

interface ImageUploadProps {
  apartmentId: number;
  existingImages?: string[];
  onImagesChanged: (urls: string[]) => void;
}

const UploadContainer = styled.div`
  margin-bottom: 20px;
`;

const UploadTitle = styled.h3`
  margin-bottom: 15px;
  color: #333;
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
  font-weight: 500;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const UploadLabel = styled.label`
  background-color: #2196F3;
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: inline-block;
  margin-right: 10px;
  font-weight: 500;
  
  &:hover {
    background-color: #0b7dda;
  }
`;

const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ImageItem = styled.div`
  position: relative;
  height: 150px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(244, 67, 54, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background-color: rgba(244, 67, 54, 1);
  }
`;

const EmptyState = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
  text-align: center;
  color: #666;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin-right: 10px;
  display: inline-block;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StatusMessage = styled.div<{ isError?: boolean }>`
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.isError ? '#ffebee' : '#e8f5e9'};
  color: ${props => props.isError ? '#c62828' : '#2e7d32'};
`;

const ApartmentImageUpload: React.FC<ImageUploadProps> = ({ 
  apartmentId, 
  existingImages = [],
  onImagesChanged 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localImages, setLocalImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  
  // Hàm trợ giúp để lấy tên file từ URL
  const getFilePathFromUrl = (url: string): string => {
    try {
      // Kiểm tra nếu URL không hợp lệ
      if (!url || typeof url !== 'string') {
        console.error('URL không hợp lệ:', url);
        return '';
      }
      
      // Một số trường hợp đặc biệt
      if (url.includes('blob:')) {
        console.warn('URL blob không thể xóa từ storage:', url);
        return '';
      }
      
      // Phương pháp 1: Sử dụng URL object
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      console.log('Phân tích URL:', {
        url,
        pathname,
        hasHinhAnh: pathname.includes('/hinh_anh/'),
        hasApartments: pathname.includes('/apartments/'),
        hasObjectPublic: pathname.includes('/object/public/')
      });
      
      // Kiểm tra xem đường dẫn có chứa "/hinh_anh/" không
      if (pathname.includes('/hinh_anh/')) {
        return pathname.split('/hinh_anh/')[1];
      }
      
      // Phương pháp 2: Tìm "apartments/" trong đường dẫn
      if (pathname.includes('/apartments/')) {
        // Lấy phần sau "/object/public/"
        if (pathname.includes('/object/public/')) {
          const parts = pathname.split('/object/public/');
          if (parts.length > 1) {
            return parts[1];
          }
        }
        
        // Hoặc tìm phần sau "storage/v1/"
        if (pathname.includes('/storage/v1/object/public/')) {
          const storageParts = pathname.split('/storage/v1/object/public/');
          if (storageParts.length > 1) {
            return storageParts[1];
          }
        }
        
        // Phương pháp cuối cùng: lấy phần từ 'apartments/' đến hết
        const apartmentsMatch = pathname.match(/apartments\/.*$/);
        if (apartmentsMatch) {
          return apartmentsMatch[0];
        }
      }
      
      // Nếu không tìm thấy theo cách nào, trả về pathname (không bao gồm domain)
      console.warn('Không thể phân tích URL theo cách thông thường. Sử dụng pathname:', pathname);
      // Bỏ "/" ở đầu nếu có
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch (error) {
      console.error('Lỗi khi phân tích URL:', error);
      return '';
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      setMessage(null);
    }
  };
  
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setMessage(null);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMessage({
            text: `File "${file.name}" vượt quá 5MB. Vui lòng chọn file nhỏ hơn.`,
            isError: true
          });
          continue;
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `apartments/${apartmentId}/${fileName}`;
        
        // Thêm metadata để hỗ trợ RLS
        const fileOptions = {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
          duplex: 'half',
          metadata: {
            apartmentId: apartmentId.toString(),
            uploadedBy: 'user', // Thay bằng userId nếu có
            fileName: file.name,
            contentType: file.type
          }
        };
        
        const { error: uploadError } = await supabase.storage
          .from('hinh_anh')
          .upload(filePath, file, fileOptions);
          
        if (uploadError) {
          console.error('Lỗi khi tải ảnh lên:', uploadError);
          setMessage({
            text: `Lỗi khi tải ảnh "${file.name}": ${uploadError.message}`,
            isError: true
          });
          continue;
        }
        
        const { data } = supabase.storage
          .from('hinh_anh')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(data.publicUrl);
      }
      
      if (uploadedUrls.length > 0) {
        const newImages = [...localImages, ...uploadedUrls];
        setLocalImages(newImages);
        onImagesChanged(newImages);
        
        setMessage({
          text: `Đã tải lên ${uploadedUrls.length} hình ảnh thành công.`,
          isError: false
        });
        
        // Xóa tất cả các file đã chọn
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên:', error);
      setMessage({
        text: 'Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại sau.',
        isError: true
      });
    } finally {
      setUploading(false);
    }
  };
  
  const deleteImage = async (imageUrl: string, index: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }
    
    try {
      // Debug: Log URL để kiểm tra
      console.log('URL hình ảnh cần xóa:', imageUrl);
      
      // Cập nhật UI trước để tránh trải nghiệm "văng ra"
      const newImages = [...localImages];
      newImages.splice(index, 1);
      setLocalImages(newImages);
      
      // Sử dụng hàm trợ giúp để lấy đúng đường dẫn file
      const filePath = getFilePathFromUrl(imageUrl);
      
      if (!filePath) {
        console.warn('Không thể xác định đường dẫn file từ URL. Chỉ cập nhật UI.');
        onImagesChanged(newImages);
        setMessage({
          text: 'Đã xóa hình ảnh khỏi danh sách.',
          isError: false
        });
        return;
      }
      
      console.log('Đường dẫn file được phân tích:', filePath);
      
      // Xử lý bất đồng bộ với try-catch riêng
      // để không làm gián đoạn trải nghiệm người dùng
      try {
        const { error, data } = await supabase.storage
          .from('hinh_anh')
          .remove([filePath]);
        
        console.log('Kết quả xóa:', { error, data });
          
        if (error) {
          console.error('Lỗi khi xóa file từ storage:', error);
          // Vẫn giữ cập nhật UI ngay cả khi xóa file thất bại
        }
      } catch (storageError) {
        console.error('Lỗi khi gọi API xóa:', storageError);
        // Vẫn giữ cập nhật UI ngay cả khi xóa file thất bại
      }
      
      // Thông báo cho component cha về thay đổi
      onImagesChanged(newImages);
      
      setMessage({
        text: 'Đã xóa hình ảnh thành công.',
        isError: false
      });
    } catch (error) {
      console.error('Lỗi tổng thể khi xóa ảnh:', error);
      setMessage({
        text: 'Đã xảy ra lỗi khi xóa hình ảnh. Vui lòng thử lại sau.',
        isError: true
      });
    }
  };
  
  return (
    <UploadContainer>
      <UploadTitle>Hình ảnh căn hộ</UploadTitle>
      
      <div>
        <UploadLabel htmlFor="apartment-image-upload">
          <span role="img" aria-label="upload">📁</span> Chọn ảnh
        </UploadLabel>
        
        <UploadInput 
          id="apartment-image-upload" 
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
            {uploading ? (
              <>
                <LoadingSpinner /> Đang tải lên...
              </>
            ) : (
              <>Tải lên {selectedFiles.length} ảnh</>
            )}
          </UploadButton>
        )}
      </div>
      
      {message && (
        <StatusMessage isError={message.isError}>
          {message.text}
        </StatusMessage>
      )}
      
      {selectedFiles.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <div style={{ fontWeight: 500, marginBottom: '10px' }}>Ảnh đã chọn:</div>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {localImages.length > 0 ? (
        <ImagesContainer>
          {localImages.map((imageUrl, index) => (
            <ImageItem key={index}>
              <PreviewImage src={imageUrl} alt={`Hình ảnh ${index + 1}`} />
              <DeleteButton onClick={() => deleteImage(imageUrl, index)}>
                ×
              </DeleteButton>
            </ImageItem>
          ))}
        </ImagesContainer>
      ) : (
        <EmptyState>
          <p>Chưa có hình ảnh nào. Hãy tải lên một số hình ảnh cho căn hộ.</p>
        </EmptyState>
      )}
    </UploadContainer>
  );
};

export default ApartmentImageUpload;
