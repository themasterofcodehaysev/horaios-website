import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Edit2, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, AlertTriangle,
  Layout, Save, RefreshCw, MoreVertical, GripVertical,
} from 'lucide-react';
import { homepageService } from '../../services/homepage.service';
import type { HomepageSection } from '../../types';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../hooks/useToast';

const HomepageCmsPage: React.FC = () => {
  const confirm = useConfirm();
  const { addToast } = useToast();
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; section: HomepageSection | null }>({ open: false, section: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; section: HomepageSection | null }>({ open: false, section: null });
  const [saving, setSaving] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await homepageService.getAllSections();
      setSections(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load homepage sections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const handleToggleVisibility = async (section: HomepageSection) => {
    try {
      const updated = await homepageService.updateSection(section.id, {
        is_visible: !section.is_visible,
      });
      setSections(prev => prev.map(s => s.id === section.id ? updated : s));
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update section');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    
    const sectionOrders = newSections.map((s, i) => ({ id: s.id, display_order: i }));
    try {
      await homepageService.reorderSections(sectionOrders);
      setSections(newSections);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reorder sections');
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    
    const sectionOrders = newSections.map((s, i) => ({ id: s.id, display_order: i }));
    try {
      await homepageService.reorderSections(sectionOrders);
      setSections(newSections);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to reorder sections');
    }
  };

  const handleInitialize = async () => {
    const ok = await confirm({
      title: 'Initialize Sections',
      message: 'This will create default homepage sections. Continue?',
      confirmLabel: 'Initialize',
      variant: 'primary',
      icon: 'info',
    });
    if (!ok) return;

    try {
      await homepageService.initializeDefaultSections();
      fetchSections();
      addToast({
        type: 'success',
        title: 'Sections Initialized',
        message: 'Default homepage sections have been created.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to initialize sections',
        message: err?.response?.data?.message || 'Please try again.',
      });
    }
  };

  const handleUpdateSection = async () => {
    if (!editModal.section) return;
    setSaving(true);
    try {
      const title = (document.getElementById('section-title') as HTMLInputElement)?.value;
      const content = (document.getElementById('section-content') as HTMLTextAreaElement)?.value;
      const background_image = (document.getElementById('section-bg-image') as HTMLInputElement)?.value;
      const background_color = (document.getElementById('section-bg-color') as HTMLInputElement)?.value;
      
      const updated = await homepageService.updateSection(editModal.section.id, {
        title,
        content,
        background_image,
        background_color,
      });
      setSections(prev => prev.map(s => s.id === editModal.section!.id ? updated : s));
      setEditModal({ open: false, section: null });
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update section');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.section) return;
    try {
      await homepageService.deleteSection(deleteModal.section.id);
      setDeleteModal({ open: false, section: null });
      fetchSections();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to delete section');
    }
  };

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-h3 text-neutral-900 font-semibold mb-4">Edit Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Title</label>
            <input
              type="text"
              defaultValue={editModal.section?.title}
              id="section-title"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label className="block text-body-sm font-medium text-neutral-700 mb-1">Content</label>
            <textarea
              defaultValue={editModal.section?.content || ''}
              id="section-content"
              rows={4}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">Background Image URL</label>
              <input
                type="text"
                defaultValue={editModal.section?.background_image || ''}
                id="section-bg-image"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-neutral-700 mb-1">Background Color</label>
              <input
                type="text"
                defaultValue={editModal.section?.background_color || ''}
                id="section-bg-color"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => setEditModal({ open: false, section: null })}
            className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateSection}
            disabled={saving}
            className="px-4 py-2 text-body-sm font-medium text-white bg-primary-red hover:bg-primary-dark-red rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h2 text-neutral-900 font-bold">Homepage CMS</h1>
          <p className="text-body-sm text-neutral-500 mt-1">
            Manage homepage sections, content, and layout.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInitialize}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-body-sm font-medium hover:bg-neutral-50 shadow-xs"
          >
            <RefreshCw className="w-4 h-4" /> Initialize Defaults
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-red border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-body-sm text-neutral-500">Loading homepage sections...</p>
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-600 mb-3">{error}</p>
            <button onClick={fetchSections} className="text-body-sm text-primary-red font-medium hover:underline">Retry</button>
          </div>
        ) : sections.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Layout className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
            <p className="text-body-sm text-neutral-500 mb-4">No homepage sections found</p>
            <button
              onClick={handleInitialize}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-red text-white rounded-lg text-body-sm font-medium hover:bg-primary-dark-red"
            >
              <RefreshCw className="w-4 h-4" /> Initialize Default Sections
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${!section.is_visible ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-neutral-400 cursor-move" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-body-sm font-medium text-neutral-900">{section.title}</h3>
                      <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-body-xs">
                        {section.key}
                      </span>
                      {!section.is_visible && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-body-xs">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-body-xs text-neutral-500 truncate">{section.content || 'No content'}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(section)}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      title={section.is_visible ? 'Hide' : 'Show'}
                    >
                      {section.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setEditModal({ open: true, section })}
                      className="p-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, section })}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editModal.open && renderEditModal()}

      {deleteModal.open && deleteModal.section && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-h3 text-neutral-900 font-semibold mb-2">Delete Section</h3>
            <p className="text-body-sm text-neutral-600 mb-6">
              Are you sure you want to delete "{deleteModal.section.title}"? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, section: null })}
                className="px-4 py-2 text-body-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default HomepageCmsPage;
