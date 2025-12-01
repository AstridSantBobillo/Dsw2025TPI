import { instance } from '../../shared/api/axiosInstance';

export const getClientProducts = async (search = "", status = "enabled", pageNumber = 1, pageSize = 20) => {
  const queryString = new URLSearchParams({
    search,
    status, // SIEMPRE productos habilitados
    pageNumber,
    pageSize,
  });

  try{
  const response = await instance.get(`api/products?${queryString}`);

     if (response.status === 204) {
      return { data: { totalCount: 0, items: [] }, error: null };
    }

  return { data: response.data, error: null };

  } catch (error) {
    console.error('Error al listar productos (client):', error);
    return { data: { total: 0, productItems: [] }, error };
  }
};