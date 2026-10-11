import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageInput from '../components/module/ImageInput';
import TaskResult from '../components/module/TaskResult';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGES = [
  ['English', 'English'], ['Hindi', 'हिन्दी'], ['Telugu', 'తెలుగు'],
  ['Tamil', 'தமிழ்'], ['Bengali', 'বাংলা'], ['Marathi', 'मराठी'],
];

export default function GuestReport() {
  const { t } = useLanguage();
  const [reportText, setReportText] = useState('');
  const [language, setLanguage] = useState('English');
  const [image, setImage] = useState(null);
  const [consented, setConsented] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const checkReport = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    const toastId = toast.loading(t('Checking report…'));
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseURL}/api/demo/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          language,
          ...(image ? { imageBase64: image.imageBase64, imageMime: image.imageMime } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not check this report.');
      setResult(data);
      toast.success(t('Analysis complete'), { id: toastId });
    } catch (requestError) {
      setError(requestError.message || 'Could not check this report.');
      toast.error(requestError.message || 'Could not check this report.', { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setReportText('');
    setImage(null);
    setConsented(false);
  };

  return (
    <main className="min-h-screen bg-[#050507] text-white px-5 py-12 md:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/home" className="text-sm text-white/55 hover:text-white">← {t('Back to MediCode')}</Link>
        <div className="mt-10 mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{t('Free guest report check')}</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">{t('Understand your lab report')}</h1>
          <p className="mt-4 max-w-2xl text-white/60 leading-relaxed">{t('Paste lab values or upload a report image. No account is needed.')}</p>
        </div>

        {result ? (
          <TaskResult task={result} onReset={reset} />
        ) : (
          <form onSubmit={checkReport} className="space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4">
              <label className="block text-sm text-white/80" htmlFor="guest-report-text">{t('Lab report values')}</label>
              <textarea
                id="guest-report-text"
                rows={8}
                maxLength={10000}
                value={reportText}
                onChange={(event) => setReportText(event.target.value)}
                placeholder={t('Paste lab report values, e.g. Hemoglobin: 11.2 g/dL (reference 13.5–17.5)…')}
                className="w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed outline-none focus:border-cyan-400/50"
              />
              <p className="text-xs text-white/35">{reportText.length}/10,000</p>
              <div className="max-w-xs">
                <label className="mb-2 block text-xs text-white/50" htmlFor="guest-language">{t('Response language')}</label>
                <select id="guest-language" value={language} onChange={(event) => setLanguage(event.target.value)} className="w-full rounded-lg border border-white/10 bg-[#101016] px-3 py-2 text-sm">
                  {LANGUAGES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
            </div>

            <ImageInput onImage={setImage} />

            <label className="flex items-start gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4 text-xs leading-relaxed text-white/65">
              <input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} className="mt-0.5 accent-cyan-400" />
              <span>{t('I understand my report is sent to the configured AI provider for analysis. MediCode does not save this guest check; the result disappears when I refresh or leave this page. The provider may handle data under its own terms.')}</span>
            </label>

            {error && <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <button type="submit" disabled={busy || !consented || (!reportText.trim() && !image)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">
              {busy ? t('Checking…') : t('Check report')}
            </button>
            <p className="text-xs text-white/35">{t('AI explanations can be wrong and are not a diagnosis. Ask a healthcare professional about your results.')}</p>
          </form>
        )}
      </div>
    </main>
  );
}
