import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import ProfileModal from './ProfileModal';

const NAV_ITEMS = [
  {
    section: 'Overview',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: '◇', accent: '#22d3ee' },
      { path: '/alerts',    label: 'Alerts',    icon: '⚠', accent: '#ef4444' },
      { path: '/patients',  label: 'Patients',  icon: '◉', accent: '#10b981' },
      { path: '/history',   label: 'History',   icon: '◷', accent: '#a78bfa' },
      { path: '/records', label: 'Health Records', icon: '📄', accent: '#22d3ee' },
    ],
  },
  {
    section: 'AI Workflows',
    items: [
      { path: '/modules/ambient-visit',     label: 'Ambient Scribe',   icon: '◈', accent: '#ec4899' },
      { path: '/modules/clinical-notes',    label: 'Clinical Notes',   icon: '◇', accent: '#8b5cf6' },
      { path: '/modules/lab-explainer',     label: 'Lab Explainer',    icon: '◆', accent: '#22d3ee' },
      { path: '/modules/triage',            label: 'Smart Triage',     icon: '▲', accent: '#f97316' },
      { path: '/modules/medication',        label: 'Medication',       icon: '⬢', accent: '#ef4444' },
      { path: '/modules/resource-forecast', label: 'Forecast',         icon: '◈', accent: '#22c55e' },
    ],
  },
];

export default function AppShell({ children, breadcrumb = 'Dashboard' }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050507] text-white flex grain">
      <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-black/40 backdrop-blur-xl">
        <Link to="/dashboard" className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.06]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <span className="text-black font-bold text-sm">M</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">MediCode</p>
            <p className="text-[10px] text-white/40 leading-tight">AI Copilot</p>
          </div>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((group) => (
            <div key={group.section} className="mb-6">
              <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/30 font-medium">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`cursor-target group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-white/[0.05] text-white active-glow'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span
                        className="text-base w-5 text-center"
                        style={{ color: active ? item.accent : undefined }}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <span
                          className="ml-auto w-1 h-1 rounded-full"
                          style={{ background: item.accent }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="cursor-target w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.04] transition"
          >
            <Avatar size={32} />
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.email || ''}</p>
            </div>
            <span className="text-white/30 text-xs">⚙</span>
          </button>
          <button
            onClick={logout}
            className="cursor-target w-full mt-1 text-left text-[11px] text-white/40 hover:text-white/80 transition px-2 py-1"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl flex items-center px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/dashboard" className="text-white/40 hover:text-white/70 transition">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white/80 font-medium">{breadcrumb}</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI online
            </span>
            <button
              onClick={() => setProfileOpen(true)}
              className="cursor-target md:hidden"
            >
              <Avatar size={30} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-5xl mx-auto px-6 py-8 fade-up">{children}</div>
        </main>
      </div>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}