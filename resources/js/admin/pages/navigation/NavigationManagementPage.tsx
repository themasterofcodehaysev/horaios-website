import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, ChevronLeft, ChevronRight, AlertTriangle,
  Menu, ExternalLink, Check, X, MoreVertical, GripVertical,
} from 'lucide-react';
import { navigationService } from '../../services/navigation.service';
import type { NavigationMenu, NavigationMenuItem } from '../../types';

const NavigationManagementPage: React.FC = () => {
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<NavigationMenu | null>(null);
  const [menuModal, setMenuModal] = useState<{ open: boolean; menu: NavigationMenu | null }>({ open: false, menu: null });
  const [itemModal, setItemModal] = useState<{ open: boolean; item: NavigationMenuItem | null; menuId: number | null }>({ open: false, item: null, menuId: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; type: 'menu' | 'item'; id: number; name: string }>({ open: false, type: 'menu', id: 0, name: '' });

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await navigationService.getAllMenus();
      setMenus(data);
      if (data.length > 0 && !selectedMenu) {
        setSelectedMenu(data[0]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load navigation menus');
    } finally {
      setLoading(false);
    }
  }, [selectedMenu]);

  useEffect(() => { fetchMenus(); }, [fetchMenus]);

  const handleCreateMenu = async (menuData: Partial<NavigationMenu>) => {
    try {
      const newMenu = await navigationService.createMenu({
        name: menuData.name || '',
        location: (menuData.location || 'header') as "header" | "footer" | "quick_links",
        description: menuData.description || undefined,
        is_active: menuData.is_active ?? true,
        display_order: menuData.display_order ?? 0,
      });
      setMenuModal({ open: false, menu: null });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create menu');
    }
  };

  const handleUpdateMenu = async (menuData: Partial<NavigationMenu>) => {
    if (!menuModal.menu) return;
    try {
      await navigationService.updateMenu(menuModal.menu.id, {
        name: menuData.name,
        location: (menuData.location || 'header') as "header" | "footer" | "quick_links",
        description: menuData.description || undefined,
        is_active: menuData.is_active,
        display_order: menuData.display_order,
      });
      setMenuModal({ open: false, menu: null });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update menu');
    }
  };

  const handleDeleteMenu = async () => {
    try {
      await navigationService.deleteMenu(deleteModal.id);
      setDeleteModal({ open: false, type: 'menu', id: 0, name: '' });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete menu');
    }
  };

  const handleCreateItem = async (itemData: Partial<NavigationMenuItem>) => {
    if (!selectedMenu) return;
    try {
      await navigationService.createMenuItem({
        menu_id: selectedMenu.id,
        parent_id: itemData.parent_id,
        label: itemData.label || '',
        url: itemData.url || '',
        is_external: itemData.is_external ?? false,
        open_in_new_tab: itemData.open_in_new_tab ?? false,
        is_active: itemData.is_active ?? true,
        display_order: itemData.display_order ?? 0,
        icon: itemData.icon || undefined,
      });
      setItemModal({ open: false, item: null, menuId: null });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create menu item');
    }
  };

  const handleUpdateItem = async (itemData: Partial<NavigationMenuItem>) => {
    if (!itemModal.item) return;
    try {
      await navigationService.updateMenuItem(itemModal.item.id, {
        label: itemData.label,
        url: itemData.url,
        is_external: itemData.is_external,
        open_in_new_tab: itemData.open_in_new_tab,
        is_active: itemData.is_active,
        display_order: itemData.display_order,
        icon: itemData.icon || undefined,
      });
      setItemModal({ open: false, item: null, menuId: null });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update menu item');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await navigationService.deleteMenuItem(deleteModal.id);
      setDeleteModal({ open: false, type: 'menu', id: 0, name: '' });
      fetchMenus();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const renderMenuModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-h3 text-neutral-900 font-semibold mb-4">
          {menuModal.menu ? 'Edit Menu' : 'Create Menu'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              type="text"
              defaultValue={menuModal.menu?.name}
              id="menu-name"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Location</label>
            <select
              defaultValue={menuModal.menu?.location || 'header'}
              id="menu-location"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
              <option value="quick_links">Quick Links</option>
            </select>
          </div>
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              defaultValue={menuModal.menu?.description || ''}
              id="menu-description"
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={menuModal.menu?.is_active ?? true}
              id="menu-active"
              className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="menu-active" className="text-body-sm text-neutral-700">Active</label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setMenuModal({ open: false, menu: null })}
            className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const name = (document.getElementById('menu-name') as HTMLInputElement)?.value;
              const location = (document.getElementById('menu-location') as HTMLSelectElement)?.value as "header" | "footer" | "quick_links";
              const description = (document.getElementById('menu-description') as HTMLTextAreaElement)?.value || undefined;
              const isActive = (document.getElementById('menu-active') as HTMLInputElement)?.checked;
              
              if (menuModal.menu) {
                handleUpdateMenu({ name, location, description, is_active: isActive });
              } else {
                handleCreateMenu({ name, location, description, is_active: isActive });
              }
            }}
            className="px-4 py-2 text-body-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg"
          >
            {menuModal.menu ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderItemModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
        <h3 className="text-h3 text-neutral-900 font-semibold mb-4">
          {itemModal.item ? 'Edit Menu Item' : 'Add Menu Item'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Label</label>
            <input
              type="text"
              defaultValue={itemModal.item?.label}
              id="item-label"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">URL</label>
            <input
              type="text"
              defaultValue={itemModal.item?.url}
              id="item-url"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="/page or https://example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={itemModal.item?.is_external ?? false}
              id="item-external"
              className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="item-external" className="text-body-sm text-neutral-700">External Link</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={itemModal.item?.open_in_new_tab ?? false}
              id="item-new-tab"
              className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="item-new-tab" className="text-body-sm text-neutral-700">Open in New Tab</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={itemModal.item?.is_active ?? true}
              id="item-active"
              className="w-4 h-4 text-primary-red border-neutral-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="item-active" className="text-body-sm text-neutral-700">Active</label>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setItemModal({ open: false, item: null, menuId: null })}
            className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const label = (document.getElementById('item-label') as HTMLInputElement)?.value;
              const url = (document.getElementById('item-url') as HTMLInputElement)?.value;
              const isExternal = (document.getElementById('item-external') as HTMLInputElement)?.checked;
              const openInNewTab = (document.getElementById('item-new-tab') as HTMLInputElement)?.checked;
              const isActive = (document.getElementById('item-active') as HTMLInputElement)?.checked;
              
              if (itemModal.item) {
                handleUpdateItem({ label, url, is_external: isExternal, open_in_new_tab: openInNewTab, is_active: isActive });
              } else {
                handleCreateItem({ label, url, is_external: isExternal, open_in_new_tab: openInNewTab, is_active: isActive });
              }
            }}
            className="px-4 py-2 text-body-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg"
          >
            {itemModal.item ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Navigation Management</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage website navigation menus and menu items.
          </p>
        </div>
        <button
          onClick={() => setMenuModal({ open: true, menu: null })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Menu
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-neutral-200">
            <h3 className="text-body-sm font-semibold text-neutral-900">Menus</h3>
          </div>
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-neutral-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-body-sm text-neutral-600">{error}</p>
            </div>
          ) : menus.length === 0 ? (
            <div className="p-4 text-center">
              <Menu className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-body-sm text-neutral-500">No menus found</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {menus.map((menu) => (
                <div
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu)}
                  className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                    selectedMenu?.id === menu.id ? 'bg-primary-red/5 border-l-2 border-primary-red' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-body-sm font-medium text-neutral-900">{menu.name}</h4>
                      <p className="text-body-xs text-neutral-500">{menu.location}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${menu.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
          {selectedMenu ? (
            <>
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="text-body-sm font-semibold text-neutral-900">{selectedMenu.name}</h3>
                  <p className="text-body-xs text-neutral-500">{selectedMenu.location} • {selectedMenu.items.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMenuModal({ open: true, menu: selectedMenu })}
                    className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                    title="Edit Menu"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModal({ open: true, type: 'menu', id: selectedMenu.id, name: selectedMenu.name })}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Menu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setItemModal({ open: true, item: null, menuId: selectedMenu.id })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-red text-white rounded-lg text-body-xs font-medium hover:bg-primary-dark-red"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </button>
                </div>
              </div>
              <div className="p-4">
                {selectedMenu.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Menu className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-body-sm text-neutral-500 mb-4">No menu items yet</p>
                    <button
                      onClick={() => setItemModal({ open: true, item: null, menuId: selectedMenu.id })}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
                    >
                      <Plus className="w-4 h-4" /> Add First Item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedMenu.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg group hover:bg-neutral-100 transition-colors"
                      >
                        <GripVertical className="w-4 h-4 text-neutral-400 cursor-move" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-body-sm font-medium text-neutral-900 truncate">{item.label}</h4>
                            {item.is_external && <ExternalLink className="w-3 h-3 text-neutral-400" />}
                            {!item.is_active && <span className="text-body-xs text-neutral-400">(inactive)</span>}
                          </div>
                          <p className="text-body-xs text-neutral-500 truncate">{item.url}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setItemModal({ open: true, item, menuId: selectedMenu.id })}
                            className="p-1.5 text-neutral-600 hover:bg-neutral-200 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, type: 'item', id: item.id, name: item.label })}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Menu className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-body-sm font-medium text-neutral-900 mb-2">Select a Menu</h3>
              <p className="text-body-sm text-neutral-500">Choose a menu from the left to manage its items</p>
            </div>
          )}
        </div>
      </div>

      {menuModal.open && renderMenuModal()}
      {itemModal.open && renderItemModal()}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-h3 text-neutral-900 font-semibold mb-2">
              Delete {deleteModal.type === 'menu' ? 'Menu' : 'Menu Item'}
            </h3>
            <p className="text-body-sm text-neutral-600 mb-6">
              Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, type: 'menu', id: 0, name: '' })}
                className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={deleteModal.type === 'menu' ? handleDeleteMenu : handleDeleteItem}
                className="px-4 py-2 text-body-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationManagementPage;
