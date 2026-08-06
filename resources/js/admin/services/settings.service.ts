import api from './api';
import { ApiResponse } from '../types';

export interface ChurchSettings {
  [key: string]: any;
}

export const SettingsService = {
  getChurchSettings: async (): Promise<ChurchSettings> => {
    const { data } = await api.get<ApiResponse<ChurchSettings>>('/settings/church');
    return data.data;
  },

  getAll: async (): Promise<ChurchSettings> => {
    const { data } = await api.get<ApiResponse<ChurchSettings>>('/settings/church');
    return data.data;
  },

  updateChurchSettings: async (settings: Record<string, any>): Promise<ChurchSettings> => {
    const { data } = await api.put<ApiResponse<ChurchSettings>>('/settings/church', { settings });
    return data.data;
  },

  update: async (settings: Record<string, any>): Promise<ChurchSettings> => {
    const { data } = await api.put<ApiResponse<ChurchSettings>>('/settings/church', { settings });
    return data.data;
  },
};

export const settingsService = SettingsService;
