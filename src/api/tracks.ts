
import api from './axios';

type GetTracksParams = {
  page?: number;
  limit?: number;
  sort?: string;
  order?: string;
  search?: string;
  genre?: string;
};

export const getTracks = async (params: GetTracksParams = {}) => {
  const response = await api.get('api/tracks', { params });
  return response.data;
};



export const createTrack = async (trackData:string) => {
  const response = await api.post('/tracks', trackData);
  return response.data;
};

