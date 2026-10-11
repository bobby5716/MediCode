
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Galaxy from '../components/animations/Galaxy';
import ErrorBoundary from '../components/ErrorBoundary';
import BlurText from '../components/text/BlurText';
import SpotlightCard from '../components/ui-custom/SpotlightCard';
import SpecularButton from '../components/ui-custom/SpecularButton';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setBusy(true);

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');

      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ErrorBoundary silent>
          <Galaxy
            color1="#5227FF"
            color2="#00FFB2"
            color3="#B497CF"
            speed={0.35}
            density={1.0}
          />
        </ErrorBoundary>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(5,5,7,0.6) 60%, #050507 100%)',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <BlurText
          text="Welcome back to MediCode"
          delay={120}
          animateBy="words"
          className="mb-8 text-center text-4xl font-bold md:text-5xl"
        />

        <SpotlightCard className="w-full max-w-md rounded-2xl p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="mb-1 block text-sm">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-white/30 focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between gap-3">
                <label htmlFor="login-password" className="block text-sm">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs text-violet-300 underline underline-offset-4 transition hover:text-violet-200"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 focus:border-white/30 focus:outline-none"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {needsVerification && (
              <Link
                to={`/verify-email?email=${encodeURIComponent(
                  form.email.trim().toLowerCase()
                )}`}
                className="block text-sm text-violet-300 underline underline-offset-4"
              >
                Verify this email / resend code
              </Link>
            )}

            <div className="flex justify-center pt-2">
              <SpecularButton type="submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign In'}
              </SpecularButton>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            No account?{' '}
            <Link to="/register" className="text-white underline">
              Register
            </Link>
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}
