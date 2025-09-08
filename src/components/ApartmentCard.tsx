import React from 'react';
import styled from 'styled-components';
import { Apartment } from '../types/apartment';
import { Link } from 'react-router-dom';

interface ApartmentCardProps {
  apartment: Apartment;
}

const CardContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusBadge = styled.div<{ status: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
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

const CardContent = styled.div`
  padding: 15px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
`;

const Address = styled.p`
  margin-bottom: 10px;
  color: #666;
  font-size: 14px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #ff5722;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  // Định dạng số tiền theo định dạng VND
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <CardContainer>
      <StyledLink to={`/apartment/${apartment.id}`}>
        <ImageContainer>
          <Image 
            src={apartment.hinh_anh[0] || 'https://via.placeholder.com/300x200?text=Không+có+hình+ảnh'} 
            alt={`Căn hộ ${apartment.id}`} 
          />
          <StatusBadge status={apartment.trang_thai}>
            {apartment.trang_thai}
          </StatusBadge>
        </ImageContainer>
        
        <CardContent>
          <Title>Căn hộ {apartment.id}</Title>
          <Address>{apartment.dia_chi}</Address>
          
          <InfoRow>
            <InfoItem>
              <span role="img" aria-label="diện tích" style={{ marginRight: '5px' }}>📏</span> 
              {apartment.dien_tich} m²
            </InfoItem>
            <InfoItem>
              <span role="img" aria-label="phòng ngủ" style={{ marginRight: '5px' }}>🛏️</span> 
              {apartment.so_phong_ngu} PN
            </InfoItem>
            <InfoItem>
              <span role="img" aria-label="phòng tắm" style={{ marginRight: '5px' }}>🚿</span> 
              {apartment.so_phong_tam} PT
            </InfoItem>
          </InfoRow>
          
          <Price>{formatCurrency(apartment.gia_thue)}/tháng</Price>
        </CardContent>
      </StyledLink>
    </CardContainer>
  );
};

export default ApartmentCard;
