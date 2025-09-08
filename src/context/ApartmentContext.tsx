import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Apartment, ApartmentFilter } from '../types/apartment';
import { getAllApartments, filterApartments } from '../services/apartmentService';

interface ApartmentContextType {
  apartments: Apartment[];
  loading: boolean;
  error: string | null;
  filter: ApartmentFilter;
  setFilter: React.Dispatch<React.SetStateAction<ApartmentFilter>>;
  refreshApartments: () => Promise<void>;
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);

export const ApartmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApartmentFilter>({});

  const fetchApartments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Apartment[];
      
      // Kiểm tra xem có bộ lọc nào được áp dụng không
      const hasFilter = Object.keys(filter).length > 0;
      
      if (hasFilter) {
        data = await filterApartments(filter);
      } else {
        data = await getAllApartments();
      }
      
      setApartments(data);
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải danh sách căn hộ');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tải dữ liệu ban đầu
  useEffect(() => {
    fetchApartments();
  }, [filter]); // Tải lại khi bộ lọc thay đổi

  const refreshApartments = async () => {
    await fetchApartments();
  };

  return (
    <ApartmentContext.Provider
      value={{
        apartments,
        loading,
        error,
        filter,
        setFilter,
        refreshApartments
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
};

// Hook để sử dụng context
export const useApartments = () => {
  const context = useContext(ApartmentContext);
  if (context === undefined) {
    throw new Error('useApartments must be used within an ApartmentProvider');
  }
  return context;
};
