import api from './axios';

export const getGenres = async (): Promise<string[]> => {
  const response = await api.get<string[]>('api/genres');
  return response.data;
};


