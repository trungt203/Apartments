import { supabase } from '../supabase/supabaseClient';
import { Apartment, ApartmentFilter } from '../types/apartment';

// Tên bảng trong Supabase
const APARTMENTS_TABLE = 'can_ho';

// Lấy danh sách tất cả căn hộ
export const getAllApartments = async (): Promise<Apartment[]> => {
  const { data, error } = await supabase
    .from(APARTMENTS_TABLE)
    .select('*');

  if (error) {
    console.error('Lỗi khi lấy danh sách căn hộ:', error);
    throw error;
  }

  return data as Apartment[];
};

// Lấy ID lớn nhất từ danh sách căn hộ
export const getMaxApartmentId = async (): Promise<number> => {
  try {
    const { data, error } = await supabase
      .from(APARTMENTS_TABLE)
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Lỗi khi lấy ID lớn nhất:', error);
      return 0; // Trả về 0 nếu có lỗi, để ID mới sẽ là 1
    }

    return data ? Number(data.id) : 0;
  } catch (error) {
    console.error('Lỗi khi truy vấn ID lớn nhất:', error);
    return 0; // Trả về 0 nếu có lỗi
  }
};

// Lấy thông tin chi tiết một căn hộ
export const getApartmentById = async (id: number): Promise<Apartment | null> => {
  // Kiểm tra ID hợp lệ
  if (isNaN(id) || id <= 0) {
    console.error(`ID căn hộ không hợp lệ: ${id}`);
    throw new Error(`ID căn hộ không hợp lệ: ${id}`);
  }

  try {
    const { data, error } = await supabase
      .from(APARTMENTS_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Lỗi khi lấy thông tin căn hộ có id ${id}:`, error);
      throw new Error(`Không thể tìm thấy căn hộ với ID đã cung cấp. ID căn hộ phải là một số nguyên dương.`);
    }

    if (!data) {
      throw new Error(`Không tìm thấy căn hộ với ID: ${id}`);
    }

    return data as Apartment;
  } catch (error: any) {
    console.error(`Lỗi khi lấy thông tin căn hộ có id ${id}:`, error);
    throw error;
  }
};

// Lọc căn hộ theo các tiêu chí
export const filterApartments = async (filter: ApartmentFilter): Promise<Apartment[]> => {
  let query = supabase.from(APARTMENTS_TABLE).select('*');

  // Áp dụng các bộ lọc
  if (filter.trang_thai) {
    query = query.eq('trang_thai', filter.trang_thai);
  }

  if (filter.gia_thue_min) {
    query = query.gte('gia_thue', filter.gia_thue_min);
  }

  if (filter.gia_thue_max) {
    query = query.lte('gia_thue', filter.gia_thue_max);
  }

  if (filter.dien_tich_min) {
    query = query.gte('dien_tich', filter.dien_tich_min);
  }

  if (filter.dien_tich_max) {
    query = query.lte('dien_tich', filter.dien_tich_max);
  }

  if (filter.so_phong_ngu) {
    query = query.eq('so_phong_ngu', filter.so_phong_ngu);
  }

  if (filter.so_phong_tam) {
    query = query.eq('so_phong_tam', filter.so_phong_tam);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Lỗi khi lọc danh sách căn hộ:', error);
    throw error;
  }

  return data as Apartment[];
};

// Tải ảnh lên Supabase Storage
export const uploadImage = async (file: File, apartmentId: number): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${apartmentId}/${Date.now()}.${fileExt}`;
  const filePath = `apartments/${fileName}`;

  const { error } = await supabase.storage
    .from('hinh_anh')
    .upload(filePath, file);

  if (error) {
    console.error('Lỗi khi tải ảnh lên:', error);
    throw error;
  }

  // Lấy URL công khai của ảnh
  const { data } = supabase.storage
    .from('hinh_anh')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Thêm căn hộ mới
export const addApartment = async (apartment: Omit<Apartment, 'id'>): Promise<Apartment> => {
  try {
    // Xử lý trường số để tránh NaN
    const formattedApartment = {
      ...apartment,
      // Đảm bảo các trường số không là NaN
      gia_thue: isNaN(Number(apartment.gia_thue)) ? 0 : Number(apartment.gia_thue),
      dien_tich: isNaN(Number(apartment.dien_tich)) ? 0 : Number(apartment.dien_tich),
      so_phong_ngu: isNaN(Number(apartment.so_phong_ngu)) ? 0 : Number(apartment.so_phong_ngu),
      so_phong_tam: isNaN(Number(apartment.so_phong_tam)) ? 0 : Number(apartment.so_phong_tam),
      // Đảm bảo dữ liệu là mảng text[] phù hợp với kiểu dữ liệu trong PostgreSQL
      tien_nghi: Array.isArray(apartment.tien_nghi) 
        ? apartment.tien_nghi 
        : (apartment.tien_nghi ? JSON.parse(apartment.tien_nghi as unknown as string) : []),
      hinh_anh: Array.isArray(apartment.hinh_anh) 
        ? apartment.hinh_anh 
        : (apartment.hinh_anh ? JSON.parse(apartment.hinh_anh as unknown as string) : [])
    };
    
    console.log('Thêm căn hộ mới đã xử lý:', formattedApartment);
    
    // Sử dụng INSERT và để PostgreSQL tự tạo ID
    const { data, error } = await supabase
      .from(APARTMENTS_TABLE)
      .insert(formattedApartment)
      .select()
      .single();

    if (error) {
      console.error('Lỗi khi thêm căn hộ mới:', error);
      throw new Error(`Lỗi khi lưu thông tin căn hộ: ${error.message}`);
    }

    if (!data || !data.id || isNaN(Number(data.id)) || Number(data.id) <= 0) {
      throw new Error('Không thể tạo căn hộ mới: Không nhận được ID hợp lệ');
    }

    console.log('Căn hộ mới đã được tạo với ID:', data.id);
    
    // Đảm bảo ID là số và trả về đối tượng căn hộ
    return {
      ...data,
      id: Number(data.id)
    } as Apartment;
  } catch (error) {
    console.error('Lỗi khi xử lý dữ liệu căn hộ:', error);
    throw error;
  }
};

// Cập nhật thông tin căn hộ
export const updateApartment = async (id: number, apartment: Partial<Apartment>): Promise<Apartment> => {
  try {
    // Xử lý trường số để tránh NaN
    const formattedApartment = {
      ...apartment,
      // Đảm bảo các trường số không là NaN nếu có trong dữ liệu cập nhật
      gia_thue: apartment.gia_thue !== undefined 
        ? (isNaN(Number(apartment.gia_thue)) ? 0 : Number(apartment.gia_thue)) 
        : undefined,
      dien_tich: apartment.dien_tich !== undefined 
        ? (isNaN(Number(apartment.dien_tich)) ? 0 : Number(apartment.dien_tich)) 
        : undefined,
      so_phong_ngu: apartment.so_phong_ngu !== undefined 
        ? (isNaN(Number(apartment.so_phong_ngu)) ? 0 : Number(apartment.so_phong_ngu)) 
        : undefined,
      so_phong_tam: apartment.so_phong_tam !== undefined 
        ? (isNaN(Number(apartment.so_phong_tam)) ? 0 : Number(apartment.so_phong_tam)) 
        : undefined,
      // Đảm bảo dữ liệu là mảng text[] phù hợp với kiểu dữ liệu trong PostgreSQL
      tien_nghi: apartment.tien_nghi && Array.isArray(apartment.tien_nghi) 
        ? apartment.tien_nghi 
        : (apartment.tien_nghi ? JSON.parse(apartment.tien_nghi as unknown as string) : undefined),
      hinh_anh: apartment.hinh_anh && Array.isArray(apartment.hinh_anh) 
        ? apartment.hinh_anh 
        : (apartment.hinh_anh ? JSON.parse(apartment.hinh_anh as unknown as string) : undefined)
    };
    
    console.log(`Cập nhật căn hộ có id ${id} đã xử lý:`, formattedApartment);
    
    // Kiểm tra id trước khi cập nhật
    if (!id || isNaN(Number(id)) || Number(id) <= 0) {
      throw new Error('ID căn hộ không hợp lệ: ' + id);
    }

    const { data, error } = await supabase
      .from(APARTMENTS_TABLE)
      .update(formattedApartment)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Lỗi khi cập nhật căn hộ có id ${id}:`, error);
      throw new Error(`Lỗi khi cập nhật thông tin căn hộ: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Không tìm thấy căn hộ với ID: ${id}`);
    }

    return data as Apartment;
  } catch (error) {
    console.error('Lỗi khi xử lý dữ liệu căn hộ:', error);
    throw error;
  }
};

// Xóa căn hộ
export const deleteApartment = async (id: number): Promise<void> => {
  try {
    // Kiểm tra ID hợp lệ
    if (isNaN(id) || id <= 0) {
      throw new Error(`ID căn hộ không hợp lệ: ${id}`);
    }

    // Thêm truy vấn để kiểm tra căn hộ tồn tại trước khi xóa
    const { data: existingApartment, error: checkError } = await supabase
      .from(APARTMENTS_TABLE)
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      console.error(`Lỗi khi kiểm tra căn hộ có id ${id}:`, checkError);
      throw new Error(`Không thể xóa căn hộ: ${checkError.message}`);
    }

    if (!existingApartment) {
      throw new Error(`Không tìm thấy căn hộ với ID: ${id}`);
    }

    // Thực hiện xóa căn hộ
    const { error } = await supabase
      .from(APARTMENTS_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Lỗi khi xóa căn hộ có id ${id}:`, error);
      throw error;
    }

    console.log(`Đã xóa căn hộ có id ${id} thành công`);
  } catch (error) {
    console.error(`Lỗi khi xóa căn hộ có id ${id}:`, error);
    throw error;
  }
};
