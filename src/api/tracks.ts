
import { TrackFormData } from '../components/CreateTrackModal';
import { Track } from '../types';
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



export const createTrack = async (trackData: TrackFormData) => {
  const response = await api.post('/api/tracks', trackData);
  return response.data;
};
export const updateTrack = async (id: number, data: Partial<Track>) => {
  const response = await api.put(`api/tracks/${id}`, data)
  return response.data
}

export const deleteTrack = async (id: number| string) => {
  const response = await api.delete(`api/tracks/${id}`)
  return response.data
}



