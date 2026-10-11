import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSocket } from '../../services/socket';
import toast from 'react-hot-toast';

const SEV_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
};

export default function AlertListener() {
  useEffect(() => {
    const s = getSocket();

    s.on('alert:new', (alert) => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted' && document.visibilityState !== 'visible') {
        const n = new Notification(`⚠ ${alert.severity.toUpperCase()} Alert`, {
          body: `${alert.title}\n${alert.summary || ''}`.slice(0, 200),
          tag: alert._id,
          requireInteraction: alert.severity === 'critical',
        });
        n.onclick = () => {
          window.focus();
          window.location.href = `/tasks/${alert._id}`;
          n.close();
        };
      }

      toast.custom(
        (t) => (
          <Link
            to={`/tasks/${alert._id}`}
            onClick={() => toast.dismiss(t.id)}
            className={`block max-w-md w-full rounded-xl border shadow-2xl p-4 cursor-pointer transition ${
              t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
            style={{
              background: '#0a0a0f',
              borderColor: `${SEV_COLORS[alert.severity]}40`,
              boxShadow: `0 0 40px -10px ${SEV_COLORS[alert.severity]}80`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: `${SEV_COLORS[alert.severity]}20`,
                  border: `1px solid ${SEV_COLORS[alert.severity]}50`,
                }}
              >
                <span className="text-lg" style={{ color: SEV_COLORS[alert.severity] }}>
                  ⚠
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] uppercase tracking-widest font-mono font-bold"
                    style={{ color: SEV_COLORS[alert.severity] }}
                  >
                    {alert.severity} alert
                  </span>
                  {alert.patientId && (
                    <span className="text-[10px] text-white/40 font-mono">
                      {alert.patientId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-white/90 font-medium truncate">
                  {alert.title}
                </p>
                <p className="text-xs text-white/50 line-clamp-2 mt-0.5">
                  {alert.summary}
                </p>
                <p className="text-[10px] text-white/40 mt-2 font-mono">
                  Click to view →
                </p>
              </div>
            </div>
          </Link>
        ),
        { duration: 8000, position: 'top-right' }
      );
    });

    return () => {
      s.off('alert:new');
    };
  }, []);

  return null;
}