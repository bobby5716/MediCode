
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import AuthFlowShell from '../components/layout/AuthFlowShell';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setBusy(true);

    try {
      const { data } = await API.post('/api/auth/reset-password', {
        email,
        otp,
        password,
      });

      setMessage(data.message || 'Password reset successfully.');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFlowShell
      title="Reset password"
      subtitle="Enter the reset code from your email and choose a new password of at least eight characters."
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-white/70">Email address</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400/60"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">6-digit reset code</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-emerald-400/60"
            placeholder="000000"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">New password</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400/60"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-white/70">Confirm new password</label>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-emerald-400/60"
            placeholder="Enter the password again"
          />
        </div>

        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-semibold text-black disabled:opacity-50"
        >
          {busy ? 'Updating…' : 'Reset password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/55">
        <Link to="/forgot-password" className="text-emerald-300 underline">Request another code</Link>
      </p>
    </AuthFlowShell>
  );
}
