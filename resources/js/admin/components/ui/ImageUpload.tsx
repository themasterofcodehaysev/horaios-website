import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadService } from '../../services/upload.service';
import { getImageUrl } from '../../utils/imageUrl';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'general',
  label,
  helperText,
  className = '',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB.');
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Create an instant local preview so the user sees the selected image immediately
    if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    blobUrlRef.current = objectUrl;
    setLocalPreview(objectUrl);

    try {
      const url = await uploadService.uploadImage(file, folder, (percent) => {
        setProgress(percent);
      });
      onChange(url);
      setLocalPreview(url);
    } catch (err: any) {
      console.error('Upload failed:', err);
      const message = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setError(message);
      // Revert preview on failure
      if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setLocalPreview(null);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (blobUrlRef.current && blobUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setLocalPreview(null);
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const rawSrc = localPreview || value;
  const displaySrc = rawSrc ? (rawSrc.startsWith('blob:') || rawSrc.startsWith('data:') ? rawSrc : getImageUrl(rawSrc)) : null;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Hidden file input used for both initial select and change */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {displaySrc ? (
        <div className="relative group rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center max-w-md shadow-xs">
          <img
            key={displaySrc}
            src={displaySrc}
            alt="Uploaded preview"
            className="max-h-56 w-full object-cover rounded-xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.startsWith('data:image/svg+xml')) {
                target.src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%239ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
              }
            }}
          />

          {/* Uploading Progress Overlay */}
          {uploading ? (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 p-4 text-white">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
              <div className="w-full max-w-xs space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Hover Action Buttons */
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="px-3 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="p-1.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50 hover:bg-white'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <div className="w-full max-w-xs space-y-1">
                  <div className="flex justify-between text-xs text-gray-600 font-medium">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Click to upload
                  </span>{' '}
                  <span className="text-gray-500">or drag and drop</span>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP, or GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default ImageUpload;

