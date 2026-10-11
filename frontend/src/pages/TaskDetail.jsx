import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppShell from '../components/layout/AppShell';
import TaskResult from '../components/module/TaskResult';
import TaskNotes from '../components/module/TaskNotes';
import API from '../services/api';
import { exportTaskPDF } from '../utils/pdfExport';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get(`/api/ai/tasks/${id}`)
      .then((res) => setTask(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Task not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await API.delete(`/api/ai/tasks/${id}`);
      navigate('/history');
    } catch {
      setError('Failed to delete');
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(task, null, 2));
  };

  const handleExportPDF = () => {
    if (task) exportTaskPDF(task);
  };

  const handlePrint = () => window.print();

  return (
    <AppShell breadcrumb="Task detail">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3 print:hidden">
        <Link
          to="/history"
          className="cursor-target text-xs text-white/50 hover:text-white transition"
        >
          ← Back to history
        </Link>

        {task && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportPDF}
              className="cursor-target px-3 py-1.5 rounded-lg border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 transition text-xs"
            >
              ↓ PDF
            </button>
            <button
              onClick={handlePrint}
              className="cursor-target px-3 py-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition text-xs"
            >
              🖨 Print
            </button>
            <button
              onClick={handleCopyJSON}
              className="cursor-target px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition text-xs"
            >
              Copy JSON
            </button>
            <button
              onClick={handleDelete}
              className="cursor-target px-3 py-1.5 rounded-lg border border-red-500/20 text-red-300/80 hover:text-red-300 hover:border-red-500/40 transition text-xs"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="h-24 rounded-2xl shimmer" />
          <div className="h-40 rounded-2xl shimmer" />
          <div className="h-40 rounded-2xl shimmer" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/[0.08] border border-red-500/25 text-red-200 text-sm">
          {error}
        </div>
      )}

      {task && (
        <div className="print-doc space-y-5">
          <TaskResult task={task} onReset={() => navigate('/history')} />
          <TaskNotes taskId={task._id} initialNotes={task.notes || ''} />
        </div>
      )}
    </AppShell>
  );
}