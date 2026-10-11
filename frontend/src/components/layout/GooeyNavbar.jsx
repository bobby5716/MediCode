import { Link, useLocation } from 'react-router-dom';
import GooeyNav from '../nav/GooeyNav';
import ErrorBoundary from '../ErrorBoundary';
import { LanguageSwitcher } from '../../context/LanguageContext';

const NAV_ITEMS = [
  { label: 'Home',    href: '/home' },
  { label: 'Problem', href: '/home#problem' },
  { label: 'Modules', href: '/home#modules' },
  { label: 'Process', href: '/home#how' },
  { label: 'Login',   href: '/login' },
];

export default function GooeyNavbar() {
  const { pathname, hash } = useLocation();

  return (
    <>
      {/* Override GooeyNav defaults: no glow, subtle pill, clean text */}
      <style>{`
        /* Remove all shadows + text-shadows */
        .gooey-nav-container nav ul li,
        .gooey-nav-container nav ul li.active,
        .gooey-nav-container .effect.text,
        .gooey-nav-container .effect.text.active {
          box-shadow: none !important;
          text-shadow: none !important;
        }

        /* Active pill: replace solid black with translucent white */
        .gooey-nav-container nav ul li.active::after {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: none !important;
        }

        /* Kill the gooey filter effect that causes the black bleed */
        .gooey-nav-container .effect.filter {
          display: none !important;
        }

        /* Active text stays white (was black for contrast with the pill) */
        .gooey-nav-container nav ul li.active,
        .gooey-nav-container .effect.text.active {
          color: #ffffff !important;
        }

        /* Nav container: no bg bleeding */
        .gooey-nav-container,
        .gooey-nav-container nav,
        .gooey-nav-container nav ul {
          background: transparent !important;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ─── MediCode logo: shield + blood drop + red "Code" ─── */}
          <Link to="/home" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              {/* Shield frame */}
              <svg
                viewBox="0 0 24 24"
                className="absolute inset-0 w-full h-full"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path
                  d="M12 2 L20 6 L20 12 C20 17 16 21 12 22 C8 21 4 17 4 12 L4 6 Z"
                  className="text-white/25"
                />
              </svg>
              {/* Blood drop */}
              <svg viewBox="0 0 24 24" className="relative w-3.5 h-3.5">
                <path
                  d="M12 3 C12 3 6 10 6 14 A6 6 0 0 0 18 14 C18 10 12 3 12 3 Z"
                  fill="url(#bloodGradNav)"
                />
                <defs>
                  <linearGradient id="bloodGradNav" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#b91c1c" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-bold tracking-tight text-sm">
              Medi<span className="text-red-500">Code</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center">
            <ErrorBoundary silent>
              <GooeyNav
                items={NAV_ITEMS}
                animationTime={600}
                particleCount={12}
                particleDistances={[70, 10]}
                particleR={80}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3]}
                initialActiveIndex={NAV_ITEMS.findIndex(
                  (i) => i.href === pathname || (hash && i.href.includes(hash))
                )}
              />
            </ErrorBoundary>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link
              to="/register"
              className="text-[13px] px-3 sm:px-4 py-1.5 rounded-lg bg-white text-black font-medium hover:bg-white/90 transition whitespace-nowrap"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
