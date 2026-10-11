import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Avatar from './Avatar';

/**
 * Resize + center-crop any uploaded image to a square 400x400 JPEG.
 */
async function processImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 400;
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');

        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;

        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error('Image processing failed'));
            resolve(
              new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
            );
          },
          'image/jpeg',
          0.85
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProfileModal({ open, onClose }) {
  // ⚠️ ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURN
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      setError('');

      if (!file.type.startsWith('image/')) {
        setError('Only images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setUploading(true);

      try {
        const processed = await processImage(file);
        const formData = new FormData();
        formData.append('avatar', processed);

        const { data } = await API.post('/api/upload/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        updateUser({ avatar: data.avatar });
        setPreview(null);
        URL.revokeObjectURL(localPreview);
      } catch (err) {
        setError(err.response?.data?.message || 'Upload failed');
        setPreview(null);
        URL.revokeObjectURL(localPreview);
      } finally {
        setUploading(false);
      }
    },
    [updateUser]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // ✅ NOW it's safe to early-return — all hooks have been called
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0a0f] p-8 shadow-[0_0_100px_-20px_rgba(139,92,246,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-px left-1/2 -translate-x-1/2 w-40 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Profile</h2>
            <p className="text-xs text-white/40 mt-0.5">Manage your account</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-target w-8 h-8 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Avatar drag-drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center mb-7 rounded-2xl border-2 border-dashed transition-all p-5 ${
            dragOver
              ? 'border-violet-500/60 bg-violet-500/[0.06] scale-[1.02]'
              : 'border-white/[0.06] bg-white/[0.01]'
          }`}
        >
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-violet-500/40"
              />
            ) : (
              <Avatar size={96} />
            )}

            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(139,92,246,0.2)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="60"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}

            {!uploading && (
              <button
                onClick={() => inputRef.current?.click()}
                className="cursor-target absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-violet-500 hover:bg-violet-400 flex items-center justify-center text-white text-sm transition shadow-lg shadow-violet-500/30"
                title="Change photo"
              >
                ✎
              </button>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="hidden"
            />
          </div>

          <p className="text-[11px] text-white/40 mt-4 text-center leading-relaxed">
            {dragOver
              ? '✨ Drop to upload'
              : 'Click the pencil or drag & drop an image'}
            <br />
            <span className="text-white/25">
              JPG · PNG · WEBP — max 5MB · auto-cropped to square
            </span>
          </p>
        </div>

        {/* Info rows */}
        <div className="space-y-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <Row label="Name" value={user?.name} />
          <Row label="Email" value={user?.email} />
          <Row label="Role" value={user?.role} capitalize />
        </div>

        {error && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/[0.08] border border-red-500/25 text-red-200 text-xs mb-4">
            <span className="text-red-400">⚠</span>
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="cursor-target w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, capitalize }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className={`text-white/85 text-sm ${capitalize ? 'capitalize' : ''}`}>
        {value || '—'}
      </span>
    </div>
  );
}