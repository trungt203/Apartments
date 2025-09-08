import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Apartment } from '../../types/apartment';
import { getApartmentById, addApartment, updateApartment, getMaxApartmentId } from '../../services/apartmentService';
import ApartmentImageUpload from '../../components/ApartmentImageUpload';

// Styled components
const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const FormContainer = styled.form`
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
`;

const SubmitButton = styled(Button)`
  background-color: #4CAF50;
  color: white;
  border: none;
  
  &:hover {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: white;
  color: #666;
  border: 1px solid #ddd;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.div`
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Tag = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  button {
    background: none;
    border: none;
    color: #c62828;
    margin-left: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
  }
`;

const TagInput = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  
  input {
    flex: 1;
  }
  
  button {
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0 15px;
    cursor: pointer;
    
    &:hover {
      background-color: #0b7dda;
    }
    
    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }
`;

interface RouteParams {
  id: string;
}

const initialApartmentState: Apartment = {
  id: 0,
  trang_thai: 'Còn trống',
  dia_chi: '',
  gia_thue: 0,
  dien_tich: 0,
  so_phong_ngu: 1,
  so_phong_tam: 1,
  mo_ta: '',
  tien_nghi: [],
  hinh_anh: [],
  ngay_cap_nhat: new Date().toISOString(),
  lien_he: ''
};

const ApartmentEditPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  // Kiểm tra các trường hợp về id
//   const isNewApartment = id === 'new';
const isNewApartment = id === 'new' || id === undefined;  // nếu bạn có route /new riêng
  // Chỉ kiểm tra ID không hợp lệ khi không phải là trang thêm mới
//   const isInvalidOrMissingId = !isNewApartment && (!id || isNaN(Number(id)) || Number(id) <= 0);
const isInvalidOrMissingId = !isNewApartment && (!id || isNaN(Number(id)) || Number(id) <= 0);
  
  const [apartment, setApartment] = useState<Apartment>(initialApartmentState);
  const [loading, setLoading] = useState<boolean>(!isNewApartment && !isInvalidOrMissingId);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(isInvalidOrMissingId ? 'ID căn hộ không hợp lệ hoặc không tồn tại' : null);
  const [newTienNghi, setNewTienNghi] = useState<string>('');
  const [nextId, setNextId] = useState<number>(0);
  
  // Lấy ID tối đa và tự động cộng 1 khi vào trang thêm mới
  useEffect(() => {
    const fetchMaxId = async () => {
      if (isNewApartment) {
        try {
          const maxId = await getMaxApartmentId();
          const newId = maxId + 1;
          setNextId(newId);
          console.log(`ID tối đa hiện tại: ${maxId}, ID mới dự kiến: ${newId}`);
        } catch (err) {
          console.error('Lỗi khi lấy ID tối đa:', err);
        }
      }
    };
    
    fetchMaxId();
  }, [isNewApartment]);
  
  useEffect(() => {
    const fetchApartment = async () => {
      // Không làm gì nếu là trang tạo mới hoặc ID không hợp lệ
      if (isNewApartment || isInvalidOrMissingId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // ID đã được kiểm tra ở trên, nên chúng ta có thể an toàn chuyển đổi
        const apartmentId = Number(id);
        
        const data = await getApartmentById(apartmentId);
        if (data) {
          setApartment(data);
        } else {
          setError('Không tìm thấy thông tin căn hộ');
        }
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin căn hộ');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApartment();
  }, [id, isNewApartment]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Xử lý các trường số
    if (['gia_thue', 'dien_tich', 'so_phong_ngu', 'so_phong_tam'].includes(name)) {
      // Nếu giá trị trống, đặt về 0 hoặc null
      if (value === '' || isNaN(Number(value))) {
        setApartment((prev: Apartment) => ({
          ...prev,
          [name]: null
        }));
      } else {
        setApartment((prev: Apartment) => ({
          ...prev,
          [name]: name === 'dien_tich' ? parseFloat(value) : parseInt(value, 10)
        }));
      }
    } else {
      setApartment((prev: Apartment) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleAddTienNghi = () => {
    if (newTienNghi.trim() === '') return;
    
    setApartment((prev: Apartment) => ({
      ...prev,
      tien_nghi: [...prev.tien_nghi, newTienNghi.trim()]
    }));
    
    setNewTienNghi('');
  };
  
  const handleRemoveTienNghi = (index: number) => {
    setApartment((prev: Apartment) => {
      const newTienNghi = [...prev.tien_nghi];
      newTienNghi.splice(index, 1);
      return {
        ...prev,
        tien_nghi: newTienNghi
      };
    });
  };
  
  const handleImagesChanged = (newImages: string[]) => {
    setApartment((prev: Apartment) => ({
      ...prev,
      hinh_anh: newImages
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu
    if (!apartment.dia_chi || !apartment.gia_thue || !apartment.dien_tich) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Chuẩn bị dữ liệu căn hộ, đảm bảo không có NaN
      const apartmentToSave = {
        ...apartment,
        // Đảm bảo các trường số không phải NaN
        gia_thue: apartment.gia_thue === null || isNaN(Number(apartment.gia_thue)) 
          ? 0 : Number(apartment.gia_thue),
        dien_tich: apartment.dien_tich === null || isNaN(Number(apartment.dien_tich)) 
          ? 0 : Number(apartment.dien_tich),
        so_phong_ngu: apartment.so_phong_ngu === null || isNaN(Number(apartment.so_phong_ngu)) 
          ? 0 : Number(apartment.so_phong_ngu),
        so_phong_tam: apartment.so_phong_tam === null || isNaN(Number(apartment.so_phong_tam)) 
          ? 0 : Number(apartment.so_phong_tam),
        ngay_cap_nhat: new Date().toISOString()
      };
      
      console.log('Đang lưu thông tin căn hộ:', apartmentToSave);
      
      if (isNewApartment) {
        // Tạo căn hộ mới
        try {
          // Hiển thị ID dự kiến
          console.log(`ID dự kiến cho căn hộ mới: ${nextId}`);
          
          const newApartment = await addApartment(apartmentToSave);
          console.log('Đã tạo căn hộ mới với ID:', newApartment.id);
          
          // Kiểm tra ID hợp lệ sau khi tạo
          if (!newApartment || !newApartment.id || Number(newApartment.id) <= 0) {
            throw new Error('Không thể tạo căn hộ mới: ID không hợp lệ');
          }
          
          // Chuyển hướng đến trang chi tiết căn hộ mới với ID hợp lệ
          navigate(`/admin/apartments/${newApartment.id}`);
        } catch (error: any) {
          console.error('Lỗi khi thêm căn hộ mới:', error);
          throw error; // Chuyển tiếp lỗi để xử lý trong khối catch ở ngoài
        }
      } else if (id !== 'new' && isInvalidOrMissingId) {
        // Không cho phép lưu nếu ID không hợp lệ
        throw new Error('Không thể cập nhật căn hộ: ID không hợp lệ hoặc không tồn tại');
      } else {
        // Cập nhật căn hộ hiện có (đã kiểm tra ID ở trên)
        const apartmentId = Number(id);
        await updateApartment(apartmentId, apartmentToSave);
        console.log('Đã cập nhật căn hộ có ID:', apartmentId);
        navigate(`/admin/apartments`);
      }
    } catch (err: any) {
      console.error('Lỗi chi tiết:', err);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = 'Đã xảy ra lỗi khi lưu thông tin căn hộ';
      
      if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      if (err.details) {
        errorMessage += ` (${err.details})`;
      }
      
      if (err.hint) {
        errorMessage += ` - Gợi ý: ${err.hint}`;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Đang tải thông tin căn hộ...</p>
        </div>
      </PageContainer>
    );
  }
  
  // Hiển thị thông báo lỗi ID không hợp lệ
  if (isInvalidOrMissingId) {
    return (
      <PageContainer>
        <PageTitle>Lỗi</PageTitle>
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
              onClick={() => navigate('/admin/apartments')}
            >
              Quay lại danh sách căn hộ
            </button>
          </p>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageTitle>
        {isNewApartment 
          ? `Thêm căn hộ mới${nextId > 0 ? ` (ID dự kiến: ${nextId})` : ''}` 
          : `Chỉnh sửa căn hộ #${id}`}
      </PageTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Trạng thái</Label>
          <Select 
            name="trang_thai" 
            value={apartment.trang_thai} 
            onChange={handleInputChange}
            required
          >
            <option value="Còn trống">Còn trống</option>
            <option value="Đã cho thuê">Đã cho thuê</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Địa chỉ đầy đủ *</Label>
          <Input 
            type="text" 
            name="dia_chi" 
            value={apartment.dia_chi} 
            onChange={handleInputChange}
            required
            placeholder="Nhập địa chỉ đầy đủ của căn hộ"
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <Label>Giá thuê (VNĐ/tháng) *</Label>
            <Input 
              type="number" 
              name="gia_thue" 
              value={apartment.gia_thue} 
              onChange={handleInputChange}
              required
              min="0"
              step="100000"
              placeholder="Nhập giá thuê"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Diện tích (m²) *</Label>
            <Input 
              type="number" 
              name="dien_tich" 
              value={apartment.dien_tich} 
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              placeholder="Nhập diện tích"
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Số phòng ngủ</Label>
            <Input 
              type="number" 
              name="so_phong_ngu" 
              value={apartment.so_phong_ngu} 
              onChange={handleInputChange}
              required
              min="0"
              max="10"
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Số phòng tắm</Label>
            <Input 
              type="number" 
              name="so_phong_tam" 
              value={apartment.so_phong_tam} 
              onChange={handleInputChange}
              required
              min="0"
              max="10"
            />
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label>Mô tả chi tiết</Label>
          <Textarea 
            name="mo_ta" 
            value={apartment.mo_ta} 
            onChange={handleInputChange}
            placeholder="Nhập mô tả chi tiết về căn hộ"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Thông tin liên hệ</Label>
          <Input 
            type="text" 
            name="lien_he" 
            value={apartment.lien_he} 
            onChange={handleInputChange}
            placeholder="Nhập thông tin liên hệ"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Tiện nghi</Label>
          
          <TagsContainer>
            {apartment.tien_nghi.map((item: string, index: number) => (
              <Tag key={index}>
                {item}
                <button type="button" onClick={() => handleRemoveTienNghi(index)}>×</button>
              </Tag>
            ))}
          </TagsContainer>
          
          <TagInput>
            <Input 
              type="text" 
              value={newTienNghi} 
              onChange={(e) => setNewTienNghi(e.target.value)}
              placeholder="Nhập tiện nghi mới"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTienNghi();
                }
              }}
            />
            <button 
              type="button" 
              onClick={handleAddTienNghi}
              disabled={!newTienNghi.trim()}
            >
              Thêm
            </button>
          </TagInput>
        </FormGroup>
        
        <FormGroup>
          <ApartmentImageUpload
            apartmentId={isNewApartment ? Date.now() : Number(id)}
            existingImages={apartment.hinh_anh}
            onImagesChanged={handleImagesChanged}
          />
        </FormGroup>
        
        <ButtonContainer>
          <CancelButton 
            type="button" 
            onClick={() => navigate('/admin/apartments')}
          >
            Hủy
          </CancelButton>
          
          <SubmitButton 
            type="submit"
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu căn hộ'}
          </SubmitButton>
        </ButtonContainer>
      </FormContainer>
    </PageContainer>
  );
};

export default ApartmentEditPage;
