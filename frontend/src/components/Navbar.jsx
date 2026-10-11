import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isActive = (p) => pathname === p;

  const link = (to, label) => (
    <Link
      to={to}
      className={`text-sm transition ${
        isActive(to) ? 'text-white' : 'text-white/60 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-black/40">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          MediCode
        </Link>

        <div className="flex items-center gap-6">
          {link('/dashboard', 'Dashboard')}
          {user ? (
            <button
              onClick={logout}
              className="text-sm text-white/60 hover:text-white transition"
            >
              Logout
            </button>
          ) : (
            <>
              {link('/login', 'Login')}
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-lg bg-white text-black hover:bg-white/90 transition font-medium"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}