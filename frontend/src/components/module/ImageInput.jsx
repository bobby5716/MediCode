import { useRef, useState } from 'react';

/**
 * Reads an image file, compresses it client-side, returns base64 + mimeType.
 */
async function processImageFile(file, maxSize = 1024) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mime: 'image/jpeg', preview: dataUrl });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ImageInput({ onImage, onClear }) {
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Only images are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const { base64, mime, preview } = await processImageFile(file);
      setPreview(preview);
      onImage({ imageBase64: base64, imageMime: mime });
    } catch {
      setError('Failed to process image');
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview(null);
    onImage(null);
    onClear?.();
  };

  return (
    <div className="rounded-xl bg-emerald-500/[0.03] border border-emerald-500/15 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-mono">
          📷 Optional image
        </span>
        <span className="text-[11px] text-white/30">
          Photo of a handwritten note, prescription, or lab report
        </span>
      </div>

      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`cursor-target flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed cursor-pointer transition ${
            dragOver
              ? 'border-emerald-500/60 bg-emerald-500/[0.06]'
              : 'border-white/[0.08] hover:border-white/20'
          }`}
        >
          {busy ? (
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/40">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span className="text-xs text-white/40">
                {dragOver ? 'Drop image here' : 'Click or drag an image'}
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="preview"
            className="w-full max-h-56 object-contain rounded-lg bg-black/40"
          />
          <button
            type="button"
            onClick={clear}
            className="cursor-target absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black flex items-center justify-center text-white/70 hover:text-white text-xs transition"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-400 mt-2">⚠ {error}</p>
      )}
    </div>
  );
}