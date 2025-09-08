import React from 'react';
import styled from 'styled-components';
import { useApartments } from '../context/ApartmentContext';
import ApartmentCard from '../components/ApartmentCard';
import FilterComponent from '../components/FilterComponent';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const ApartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
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

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
  grid-column: 1 / -1;
`;

const ApartmentListPage: React.FC = () => {
  const { apartments, loading, error } = useApartments();

  return (
    <PageContainer>
      <PageTitle>Danh sách căn hộ cho thuê</PageTitle>
      
      <FilterComponent />
      
      {error && (
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      )}
      
      {loading ? (
        <LoadingContainer>
          <p>Đang tải danh sách căn hộ...</p>
        </LoadingContainer>
      ) : (
        <ApartmentGrid>
          {apartments.length > 0 ? (
            apartments.map(apartment => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))
          ) : (
            <EmptyMessage>
              <h3>Không tìm thấy căn hộ nào</h3>
              <p>Vui lòng thử lại với bộ lọc khác</p>
            </EmptyMessage>
          )}
        </ApartmentGrid>
      )}
    </PageContainer>
  );
};

export default ApartmentListPage;
