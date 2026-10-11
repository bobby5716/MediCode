
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import AuthFlowShell from '../components/layout/AuthFlowShell';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const { data } = await API.post('/api/auth/forgot-password', { email });
      setMessage(data.message || 'If the account exists, a reset code will be sent.');
      navigate('/reset-password', { state: { email }, replace: false });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to request a reset code.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthFlowShell
      title="Forgot password?"
      subtitle="Enter the email address associated with your account to request a password-reset code."
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

        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="text-sm text-emerald-300">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 font-semibold text-black disabled:opacity-50"
        >
          {busy ? 'Sending…' : 'Send reset code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/55">
        Remember your password? <Link to="/login" className="text-emerald-300 underline">Sign in</Link>
      </p>
    </AuthFlowShell>
  );
}
