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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  min-height: 90px;
  width: 100%;
`;

const FilterLabel = styled.label`
  margin-bottom: 8px;
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
  gap: 15px;
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  
  &::after {
    content: "—";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #999;
    font-weight: 300;
    pointer-events: none;
  }
`;

const RangeLabel = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  display: block;
`;

const RangeInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
  gap: 15px;
  grid-column: 1 / -1; /* Span across all columns */
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
        
        <FilterGroup>
          <FilterLabel>Giá thuê (VNĐ/tháng)</FilterLabel>
          <RangeContainer>
            <RangeInputGroup>
              <RangeLabel>Từ</RangeLabel>
              <FilterInput
                type="number"
                name="gia_thue_min"
                placeholder="Tối thiểu"
                value={tempFilter.gia_thue_min || ''}
                onChange={handleInputChange}
                min="0"
                step="500000"
              />
            </RangeInputGroup>
            <RangeInputGroup>
              <RangeLabel>Đến</RangeLabel>
              <FilterInput
                type="number"
                name="gia_thue_max"
                placeholder="Tối đa"
                value={tempFilter.gia_thue_max || ''}
                onChange={handleInputChange}
                min="0"
                step="500000"
              />
            </RangeInputGroup>
          </RangeContainer>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>Diện tích (m²)</FilterLabel>
          <RangeContainer>
            <RangeInputGroup>
              <RangeLabel>Từ</RangeLabel>
              <FilterInput
                type="number"
                name="dien_tich_min"
                placeholder="Tối thiểu"
                value={tempFilter.dien_tich_min || ''}
                onChange={handleInputChange}
                min="0"
                step="5"
              />
            </RangeInputGroup>
            <RangeInputGroup>
              <RangeLabel>Đến</RangeLabel>
              <FilterInput
                type="number"
                name="dien_tich_max"
                placeholder="Tối đa"
                value={tempFilter.dien_tich_max || ''}
                onChange={handleInputChange}
                min="0"
                step="5"
              />
            </RangeInputGroup>
          </RangeContainer>
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
