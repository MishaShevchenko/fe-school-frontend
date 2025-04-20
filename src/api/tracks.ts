
import api from './axios';

export const getTracks = async () => {
  const response = await api.get('api/tracks');
  return response.data;
};



export const createTrack = async (trackData:string) => {
  const response = await api.post('/tracks', trackData);
  return response.data;
};

