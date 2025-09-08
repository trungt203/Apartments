import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Apartment } from '../types/apartment';
import { getApartmentById } from '../services/apartmentService';

// Styled components
const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #555;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 500;
  
  &:hover {
    color: #000;
  }
  
  &:before {
    content: '←';
    margin-right: 8px;
  }
`;

const ApartmentHeader = styled.div`
  margin-bottom: 30px;
`;

const ApartmentTitle = styled.h1`
  margin-bottom: 10px;
  color: #333;
`;

const ApartmentAddress = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 5px;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  color: white;
  background-color: ${props => {
    switch(props.status) {
      case 'Còn trống':
        return '#4CAF50'; // Xanh lá
      case 'Đã cho thuê':
        return '#F44336'; // Đỏ
      case 'Đang sửa chữa':
        return '#FF9800'; // Cam
      default:
        return '#9E9E9E'; // Xám
    }
  }};
`;

const ApartmentContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageGallery = styled.div`
  margin-bottom: 30px;
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

const DescriptionSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const Description = styled.p`
  color: #555;
  line-height: 1.6;
  white-space: pre-line;
`;

const AmenitiesList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const AmenityItem = styled.li`
  display: flex;
  align-items: center;
  color: #555;
  
  &:before {
    content: '✓';
    color: #4CAF50;
    margin-right: 10px;
  }
`;

const InfoSidebar = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  position: sticky;
  top: 20px;
`;

const PriceTag = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ff5722;
  margin-bottom: 20px;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  color: #666;
`;

const InfoValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const ContactSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const ContactTitle = styled.h4`
  margin-bottom: 10px;
  color: #333;
`;

const ContactInfo = styled.p`
  color: #555;
  margin-bottom: 5px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  color: #666;
`;

const ErrorContainer = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

// Define route params type compatible with react-router-dom v6
type RouteParams = {
  id: string;
}

const ApartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  // Kiểm tra ID hợp lệ
  const isInvalidOrMissingId = !id || isNaN(Number(id)) || Number(id) <= 0;
  
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState<boolean>(!isInvalidOrMissingId);
  const [error, setError] = useState<string | null>(isInvalidOrMissingId ? 'ID căn hộ không hợp lệ hoặc không tồn tại' : null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  
  useEffect(() => {
    const fetchApartment = async () => {
      // Không làm gì nếu ID không hợp lệ
      if (isInvalidOrMissingId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // ID đã được kiểm tra ở trên
        const apartmentId = Number(id);
        
        const data = await getApartmentById(apartmentId);
        setApartment(data);
      } catch (err) {
        setError('Không thể tải thông tin căn hộ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApartment();
  }, [id]);

  // Định dạng số tiền theo định dạng VND
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Định dạng ngày tháng
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <p>Đang tải thông tin căn hộ...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  // Hiển thị thông báo lỗi ID không hợp lệ
  if (isInvalidOrMissingId) {
    return (
      <PageContainer>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#c62828' }}>ID căn hộ không hợp lệ</h3>
          <p>
            Không thể tìm thấy căn hộ với ID đã cung cấp. ID căn hộ phải là một số nguyên dương.
          </p>
          <p>
            <button 
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
              onClick={() => navigate('/')}
            >
              Quay lại danh sách căn hộ
            </button>
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error || !apartment) {
    return (
      <PageContainer>
        <BackLink to="/">Quay lại danh sách</BackLink>
        <ErrorContainer>
          <p>{error || 'Không tìm thấy thông tin căn hộ'}</p>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/">Quay lại danh sách</BackLink>
      
      <ApartmentHeader>
        <ApartmentTitle>Căn hộ {apartment.id}</ApartmentTitle>
        <ApartmentAddress>{apartment.dia_chi}</ApartmentAddress>
        <StatusBadge status={apartment.trang_thai}>
          {apartment.trang_thai}
        </StatusBadge>
      </ApartmentHeader>
      
      <ApartmentContent>
        <div>
          <ImageGallery>
            <MainImage 
              src={apartment.hinh_anh[selectedImageIndex] || 'https://via.placeholder.com/800x400?text=Không+có+hình+ảnh'} 
              alt={`Căn hộ ${apartment.id}`} 
            />
            
            {apartment.hinh_anh.length > 1 && (
              <ThumbnailsContainer>
                {apartment.hinh_anh.map((image, index) => (
                  <Thumbnail 
                    key={index}
                    src={image}
                    alt={`Ảnh ${index + 1}`}
                    active={index === selectedImageIndex}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </ThumbnailsContainer>
            )}
          </ImageGallery>
          
          <DescriptionSection>
            <SectionTitle>Mô tả</SectionTitle>
            <Description>{apartment.mo_ta}</Description>
          </DescriptionSection>
          
          {apartment.tien_nghi && apartment.tien_nghi.length > 0 && (
            <DescriptionSection>
              <SectionTitle>Tiện nghi</SectionTitle>
              <AmenitiesList>
                {apartment.tien_nghi.map((item, index) => (
                  <AmenityItem key={index}>{item}</AmenityItem>
                ))}
              </AmenitiesList>
            </DescriptionSection>
          )}
        </div>
        
        <InfoSidebar>
          <PriceTag>{formatCurrency(apartment.gia_thue)}/tháng</PriceTag>
          
          <InfoList>
            <InfoItem>
              <InfoLabel>Diện tích</InfoLabel>
              <InfoValue>{apartment.dien_tich} m²</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Số phòng ngủ</InfoLabel>
              <InfoValue>{apartment.so_phong_ngu}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Số phòng tắm</InfoLabel>
              <InfoValue>{apartment.so_phong_tam}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Trạng thái</InfoLabel>
              <InfoValue>{apartment.trang_thai}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Ngày cập nhật</InfoLabel>
              <InfoValue>{formatDate(apartment.ngay_cap_nhat)}</InfoValue>
            </InfoItem>
          </InfoList>
          
          <ContactSection>
            <ContactTitle>Thông tin liên hệ</ContactTitle>
            <ContactInfo>{apartment.lien_he}</ContactInfo>
          </ContactSection>
        </InfoSidebar>
      </ApartmentContent>
    </PageContainer>
  );
};

export default ApartmentDetailPage;
