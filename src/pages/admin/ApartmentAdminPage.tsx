import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Apartment } from '../../types/apartment';
import { getAllApartments, deleteApartment } from '../../services/apartmentService';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  margin: 0;
`;

const AddButton = styled(Link)`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: #45a049;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
  
  th {
    padding: 15px;
    text-align: left;
    color: #333;
    font-weight: 500;
    border-bottom: 2px solid #ddd;
  }
`;

const TableBody = styled.tbody`
  background-color: white;
  
  tr {
    &:hover {
      background-color: #f9f9f9;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
  
  td {
    padding: 15px;
    color: #555;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 500;
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

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #2196F3;
  cursor: pointer;
  margin-right: 10px;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
  
  &.delete {
    color: #F44336;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 50px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
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

const ApartmentAdminPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const fetchApartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllApartments();
      setApartments(data);
    } catch (err) {
      console.error(err);
      setError('Không thể tải danh sách căn hộ');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApartments();
  }, []);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/apartments/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa căn hộ này?')) {
      return;
    }
    
    try {
      await deleteApartment(id);
      // Sau khi xóa thành công, cập nhật lại danh sách
      fetchApartments();
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi xóa căn hộ');
    }
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
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
          <p>Đang tải danh sách căn hộ...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Quản lý căn hộ</PageTitle>
        <AddButton to="/admin/apartments/new">+ Thêm căn hộ</AddButton>
      </PageHeader>
      
      {error && <ErrorContainer>{error}</ErrorContainer>}
      
      {apartments.length > 0 ? (
        <Table>
          <TableHead>
            <tr>
              <th>ID</th>
              <th>Địa chỉ</th>
              <th>Giá thuê</th>
              <th>Diện tích</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
              <th>Thao tác</th>
            </tr>
          </TableHead>
          <TableBody>
            {apartments.map((apartment) => (
              <tr key={apartment.id}>
                <td>{apartment.id}</td>
                <td>{apartment.dia_chi}</td>
                <td>{formatCurrency(apartment.gia_thue)}</td>
                <td>{apartment.dien_tich} m²</td>
                <td>
                  <StatusBadge status={apartment.trang_thai}>
                    {apartment.trang_thai}
                  </StatusBadge>
                </td>
                <td>{formatDate(apartment.ngay_cap_nhat)}</td>
                <td>
                  <ActionButton 
                    onClick={() => handleEdit(apartment.id)}
                  >
                    Sửa
                  </ActionButton>
                  <ActionButton 
                    className="delete"
                    onClick={() => handleDelete(apartment.id)}
                  >
                    Xóa
                  </ActionButton>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyMessage>
          <h3>Chưa có căn hộ nào</h3>
          <p>Hãy thêm căn hộ đầu tiên của bạn</p>
        </EmptyMessage>
      )}
    </PageContainer>
  );
};

export default ApartmentAdminPage;
