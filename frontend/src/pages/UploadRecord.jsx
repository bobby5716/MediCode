import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import SpecularButton from '../components/ui-custom/SpecularButton';
import ShinyText from '../components/text/ShinyText';
import API from '../services/api';
import toast from 'react-hot-toast';
import { pdfToImages, imageFileToBase64 } from '../utils/pdfToImage';

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 'Marathi'];

export default function UploadRecord() {
  const navigate = useNavigate();
  const inputRef = useRef();
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('English');
  const [abhaId, setAbhaId] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (f) => {
    if (!f) return;
    setError('');
    setFile(f);

    const isPdf = f.type === 'application/pdf';
    const isImage = f.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setError('Only PDF, JPG, or PNG files are supported');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setError('File must be under 15MB');
      return;
    }

    setLoading(true);
    try {
      if (isPdf) {
        const { images } = await pdfToImages(f, 3);
        setPages(images);
        if (images.length === 0) setError('Could not read PDF');
      } else {
        const img = await imageFileToBase64(f);
        setPages([img]);
      }
    } catch (err) {
      setError('Could not process file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const reset = () => {
    setFile(null);
    setPages([]);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const submit = async () => {
    if (pages.length === 0) {
      setError('No processed pages');
      return;
    }
    setBusy(true);
    setError('');
    const t = toast.loading('Extracting medical data…');
    try {
      const { data } = await API.post('/api/records', {
        imageBase64: pages[0].base64,
        imageMime: pages[0].mime,
        fileName: file?.name || 'document',
        fileSize: file?.size || 0,
        pageCount: pages.length,
        pagesProcessed: pages.length,
        language,
        abhaId,
      });
      toast.success('Extracted — review next', { id: t });
      navigate(`/records/${data._id}/review`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Extraction failed';
      setError(msg);
      toast.error(msg, { id: t });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell breadcrumb="Upload Medical Record">
      <div className="mb-8">
        <ShinyText
          text="NEW RECORD"
          speed={4}
          className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-mono block mb-3"
        />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Upload Medical Record
        </h1>
        <p className="text-sm text-white/45 mt-2 max-w-2xl">
          Upload a prescription, lab report, or discharge summary. AI extracts
          the data — you review before saving.
        </p>
      </div>

      {/* Language + ABHA */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-2">
            🌐 Summary language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="cursor-target w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-sm"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono block mb-2">
            🆔 ABHA ID <span className="text-white/25 normal-case tracking-normal">(optional, demo)</span>
          </label>
          <input
            type="text"
            value={abhaId}
            onChange={(e) => setAbhaId(e.target.value)}
            placeholder="e.g. 12-3456-7890-1234"
            className="cursor-target w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.08] text-sm placeholder-white/25"
          />
        </div>
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`cursor-target rounded-2xl border-2 border-dashed transition-all p-10 text-center ${
          dragOver
            ? 'border-violet-500/60 bg-violet-500/[0.06]'
            : 'border-white/[0.08] hover:border-white/20 bg-white/[0.01]'
        }`}
      >
        {!file ? (
          <>
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm text-white/70 mb-1">
              Drag a PDF or image here, or click to browse
            </p>
            <p className="text-xs text-white/35">
              PDF · JPG · PNG · max 15MB · up to 3 pages
            </p>
          </>
        ) : (
          <div className="text-left">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-white/90">{file.name}</p>
                <p className="text-xs text-white/40 mt-0.5">
                  {(file.size / 1024).toFixed(0)} KB · {pages.length} page{pages.length > 1 ? 's' : ''} processed
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs text-white/40 hover:text-white transition"
              >
                Change
              </button>
            </div>
            {loading ? (
              <div className="h-32 rounded-lg shimmer" />
            ) : (
              <div className="flex gap-2 overflow-x-auto">
                {pages.map((p, i) => (
                  <img
                    key={i}
                    src={p.preview}
                    alt={`page ${i + 1}`}
                    className="h-40 rounded-lg border border-white/10"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/25 text-red-200 text-sm">
          ⚠ {error}
        </div>
      )}

      {file && pages.length > 0 && !loading && (
        <div className="mt-6 flex items-center gap-4">
          <SpecularButton onClick={submit} disabled={busy}>
            {busy ? 'Extracting…' : 'Extract & Review'}
          </SpecularButton>
          <span className="text-xs text-white/30">
            Powered by Llama 4 Scout vision
          </span>
        </div>
      )}

      <div className="mt-10 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/20">
        <p className="text-[11px] text-amber-200/80 leading-relaxed">
          <strong>⚠ Medical disclaimer:</strong> AI extraction may contain errors.
          Always review the extracted fields before saving. This tool is not a
          substitute for professional medical advice.
        </p>
      </div>
    </AppShell>
  );
}