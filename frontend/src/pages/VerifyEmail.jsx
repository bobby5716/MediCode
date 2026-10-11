import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Galaxy from '../components/animations/Galaxy';
import ErrorBoundary from '../components/ErrorBoundary';
import API from '../services/api';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialEmail =
    location.state?.email || searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail.trim().toLowerCase());
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);

    try {
      const { data } = await API.post('/api/auth/verify-email', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      setMessage(data.message || 'Email verified. You can sign in.');
      setVerified(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not verify this code. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setError('');
    setMessage('');
    setResending(true);

    try {
      const { data } = await API.post(
        '/api/auth/resend-verification',
        { email: email.trim().toLowerCase() }
      );

      setMessage(
        data.message ||
          'Verification email submitted. Check your inbox and spam folder.'
      );
      setOtp('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not resend the code. Please try again.'
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 py-12 text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <ErrorBoundary silent>
          <Galaxy
            color1="#5227FF"
            color2="#00FFB2"
            color3="#B497CF"
            speed={0.35}
            density={1}
          />
        </ErrorBoundary>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 0%, rgba(5,5,7,0.65) 60%, #050507 100%)',
        }}
      />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a12]/80 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
        <Link
          to="/"
          className="text-sm font-semibold tracking-[0.18em] text-violet-300"
        >
          MEDICODE
        </Link>

        <div className="mb-6 mt-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-2xl">
          ✉
        </div>

        <h1 className="text-3xl font-bold tracking-tight">
          Verify your email
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/55">
          Enter the six-digit code sent to your email. Codes expire after
          10 minutes.
        </p>

        {verified ? (
          <div className="mt-6 space-y-5">
            <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
              {message}
            </p>

            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400"
            >
              Continue to sign in
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={verify} className="mt-6 space-y-4">
              <label className="block text-xs font-medium uppercase tracking-wider text-white/55">
                Email address

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm normal-case tracking-normal text-white outline-none transition focus:border-violet-400/60"
                  placeholder="you@example.com"
                />
              </label>

              <label className="block text-xs font-medium uppercase tracking-wider text-white/55">
                6-digit verification code

                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center text-xl font-semibold tracking-[0.45em] text-white outline-none transition focus:border-violet-400/60"
                  placeholder="000000"
                />
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"
                >
                  {error}
                </p>
              )}

              {message && (
                <p
                  role="status"
                  className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm text-cyan-100"
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? 'Verifying…' : 'Verify email'}
              </button>
            </form>

            <button
              type="button"
              onClick={resend}
              disabled={resending || !email.trim()}
              className="mt-4 w-full rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend verification code'}
            </button>

            <p className="mt-6 text-center text-sm text-white/45">
              Already verified?{' '}
              <Link
                to="/login"
                className="text-violet-300 underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}