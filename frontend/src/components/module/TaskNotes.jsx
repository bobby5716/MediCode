import { useState, useEffect } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';
import SpecularButton from '../ui-custom/SpecularButton';

export default function TaskNotes({ taskId, initialNotes = '' }) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setNotes(initialNotes);
    setSaved(true);
  }, [initialNotes, taskId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.patch(`/api/ai/tasks/${taskId}/notes`, { notes });
      setSaved(true);
      toast.success('Notes saved');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 rounded-full bg-amber-500/60" />
          <p className="text-[11px] uppercase tracking-widest text-white/45 font-medium">
            Clinical Notes
          </p>
        </div>
        {!saved && (
          <span className="text-[10px] text-amber-400/80 font-mono">unsaved</span>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        rows={4}
        placeholder="Add your observations, follow-up actions, or any notes for this analysis…"
        className="cursor-target w-full px-4 py-3 rounded-xl bg-black/40 border border-white/[0.08] text-sm leading-relaxed resize-y"
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-white/25 font-mono">
          {notes.length} characters
        </span>
        <div className="flex items-center gap-3">
          {notes !== initialNotes && (
            <button
              onClick={() => {
                setNotes(initialNotes);
                setSaved(true);
              }}
              className="cursor-target text-xs text-white/40 hover:text-white transition"
            >
              Reset
            </button>
          )}
          <SpecularButton onClick={handleSave} disabled={saving || saved}>
            {saving ? 'Saving…' : 'Save Notes'}
          </SpecularButton>
        </div>
      </div>
    </div>
  );
}