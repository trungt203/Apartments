import React, { useState } from 'react';
import styled from 'styled-components';
import { ApartmentFilter } from '../types/apartment';
import { useApartments } from '../context/ApartmentContext';

const FilterContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const FilterForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const FilterInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const RangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const ApplyButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  
  &:hover {
    background-color: #45a049;
  }
`;

const ResetButton = styled(Button)`
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const FilterComponent: React.FC = () => {
  const { filter, setFilter } = useApartments();
  
  // State tạm thời để lưu trữ giá trị bộ lọc trước khi áp dụng
  const [tempFilter, setTempFilter] = useState<ApartmentFilter>(filter);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Chuyển đổi giá trị sang số nếu cần
    let processedValue: string | number = value;
    if (name !== 'trang_thai' && value !== '') {
      processedValue = Number(value);
    }
    
    setTempFilter(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter(tempFilter);
  };
  
  const handleResetFilter = () => {
    const emptyFilter: ApartmentFilter = {};
    setTempFilter(emptyFilter);
    setFilter(emptyFilter);
  };
  
  return (
    <FilterContainer>
      <FilterTitle>Lọc căn hộ</FilterTitle>
      <FilterForm onSubmit={handleApplyFilter}>
        <FilterGroup>
          <FilterLabel>Trạng thái</FilterLabel>
          <FilterSelect
            name="trang_thai"
            value={tempFilter.trang_thai || ''}
            onChange={handleInputChange}
          >
            <option value="">Tất cả</option>
            <option value="Còn trống">Còn trống</option>
            <option value="Đã cho thuê">Đã cho thuê</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Giá thuê (VNĐ/tháng)</FilterLabel>
          <RangeContainer>
            <FilterInput
              type="number"
              name="gia_thue_min"
              placeholder="Từ"
              value={tempFilter.gia_thue_min || ''}
              onChange={handleInputChange}
              min="0"
            />
            <FilterInput
              type="number"
              name="gia_thue_max"
              placeholder="Đến"
              value={tempFilter.gia_thue_max || ''}
              onChange={handleInputChange}
              min="0"
            />
          </RangeContainer>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Diện tích (m²)</FilterLabel>
          <RangeContainer>
            <FilterInput
              type="number"
              name="dien_tich_min"
              placeholder="Từ"
              value={tempFilter.dien_tich_min || ''}
              onChange={handleInputChange}
              min="0"
            />
            <FilterInput
              type="number"
              name="dien_tich_max"
              placeholder="Đến"
              value={tempFilter.dien_tich_max || ''}
              onChange={handleInputChange}
              min="0"
            />
          </RangeContainer>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Số phòng ngủ</FilterLabel>
          <FilterSelect
            name="so_phong_ngu"
            value={tempFilter.so_phong_ngu || ''}
            onChange={handleInputChange}
          >
            <option value="">Tất cả</option>
            <option value="1">1 phòng</option>
            <option value="2">2 phòng</option>
            <option value="3">3 phòng</option>
            <option value="4">4+ phòng</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Số phòng tắm</FilterLabel>
          <FilterSelect
            name="so_phong_tam"
            value={tempFilter.so_phong_tam || ''}
            onChange={handleInputChange}
          >
            <option value="">Tất cả</option>
            <option value="1">1 phòng</option>
            <option value="2">2 phòng</option>
            <option value="3">3+ phòng</option>
          </FilterSelect>
        </FilterGroup>
        
        <ButtonContainer>
          <ResetButton type="button" onClick={handleResetFilter}>
            Đặt lại
          </ResetButton>
          <ApplyButton type="submit">
            Áp dụng
          </ApplyButton>
        </ButtonContainer>
      </FilterForm>
    </FilterContainer>
  );
};

export default FilterComponent;
