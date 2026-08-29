import api from './api';
import type {
  ApiResponse,
  NavigationMenu,
  NavigationMenuItem,
  CreateNavigationMenuPayload,
  UpdateNavigationMenuPayload,
  CreateNavigationMenuItemPayload,
  UpdateNavigationMenuItemPayload,
} from '../types';

export const navigationService = {
  async getAllMenus(): Promise<NavigationMenu[]> {
    const { data } = await api.get<ApiResponse<NavigationMenu[]>>('/admin/navigation');
    return data.data;
  },

  async getPublicNavigation(location = 'header'): Promise<NavigationMenu[]> {
    const { data } = await api.get<ApiResponse<NavigationMenu[]>>(`/navigation?location=${location}`);
    return data.data;
  },

  async createMenu(payload: CreateNavigationMenuPayload): Promise<NavigationMenu> {
    const { data } = await api.post<ApiResponse<NavigationMenu>>('/admin/navigation', payload);
    return data.data;
  },

  async updateMenu(id: number, payload: UpdateNavigationMenuPayload): Promise<NavigationMenu> {
    const { data } = await api.put<ApiResponse<NavigationMenu>>(`/admin/navigation/${id}`, payload);
    return data.data;
  },

  async deleteMenu(id: number): Promise<void> {
    await api.delete(`/admin/navigation/${id}`);
  },

  async createMenuItem(payload: CreateNavigationMenuItemPayload): Promise<NavigationMenuItem> {
    const { data } = await api.post<ApiResponse<NavigationMenuItem>>('/admin/navigation/items', payload);
    return data.data;
  },

  async updateMenuItem(id: number, payload: UpdateNavigationMenuItemPayload): Promise<NavigationMenuItem> {
    const { data } = await api.put<ApiResponse<NavigationMenuItem>>(`/admin/navigation/items/${id}`, payload);
    return data.data;
  },

  async deleteMenuItem(id: number): Promise<void> {
    await api.delete(`/admin/navigation/items/${id}`);
  },

  async reorderItems(menuId: number, items: Array<{ id: number; display_order: number }>): Promise<void> {
    await api.post(`/admin/navigation/${menuId}/reorder`, { items });
  },
};
