import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  try {
    const response = await instance.get(`api/products/admin?${queryString}`);

    if (response.status === 204) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }

    return { data: response.data, error: null };

  } catch (error) {
    console.error('Error al listar productos (admin):', error);

    return { data: { total: 0, productItems: [] }, error };
  }
};