import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Galaxy from '../components/animations/Galaxy';
import CursorLayer from '../components/layout/CursorLayer';
import BlurText from '../components/text/BlurText';
import ShinyText from '../components/text/ShinyText';
import SplitText from '../components/text/SplitText';
import SpecularButton from '../components/ui-custom/SpecularButton';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
  });

  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const result = await register(form);

      navigate(
        `/verify-email?email=${encodeURIComponent(
          result.email || form.email.trim().toLowerCase()
        )}`,
        {
          state: {
            email: result.email || form.email.trim().toLowerCase(),
          },
        }
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <CursorLayer />

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

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 py-12 lg:grid-cols-2">
          <div className="hidden flex-col justify-center lg:flex">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px w-10 bg-white/20" />
              <ShinyText
                text="GET STARTED"
                speed={4}
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40"
              />
            </div>

            <BlurText
              text="Join MediCode"
              delay={120}
              animateBy="words"
              direction="top"
              className="mb-8 text-6xl font-bold leading-[1.02] tracking-tighter xl:text-7xl"
            />

            <div className="mb-10 max-w-md">
              <SplitText
                text="Five clinical AI workflows, one platform. Free to start, no credit card."
                className="text-base leading-relaxed text-white/50"
                delay={20}
                duration={1}
              />
            </div>

            <ul className="max-w-md space-y-4">
              {[
                { label: 'Clinical Note Summarizer', accent: '#8b5cf6' },
                { label: 'Lab Report Explainer', accent: '#22d3ee' },
                { label: 'Smart Triage Assistant', accent: '#f97316' },
                { label: 'Medication Interaction Check', accent: '#ef4444' },
                { label: 'Resource Forecast', accent: '#22c55e' },
              ].map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-center gap-3 text-sm text-white/60"
                >
                  <span
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{
                      background: feature.accent,
                      boxShadow: `0 0 8px ${feature.accent}`,
                    }}
                  />
                  {feature.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0">
            <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)] backdrop-blur-xl md:p-10">
              <div
                className="absolute -top-px left-1/2 h-px w-32 -translate-x-1/2"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                }}
              />

              <h2 className="mb-1 text-2xl font-bold tracking-tight">
                Create account
              </h2>
              <p className="mb-8 text-sm text-white/40">
                Verify your email to get started
              </p>

              <form onSubmit={onSubmit} className="space-y-5">
                <Field
                  label="Full Name"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Jane Doe"
                  required
                />

                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  required
                />

                <Field
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />

                <Field
                  label="College / Institution"
                  value={form.college}
                  onChange={set('college')}
                  placeholder="Optional"
                />

                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-lg border border-red-500/25 bg-red-500/[0.08] p-3 text-sm text-red-200"
                  >
                    <span className="mt-0.5 text-red-400">⚠</span>
                    <p>{error}</p>
                  </div>
                )}

                <div className="pt-2">
                  <SpecularButton type="submit" disabled={busy}>
                    {busy ? (
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending verification code…
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </SpecularButton>
                </div>
              </form>

              <p className="mt-6 text-center text-sm text-white/40">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="text-white underline underline-offset-4 hover:text-white/80"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <p className="mt-6 text-center font-mono text-[11px] tracking-wider text-white/25">
              Free · No credit card · Groq-powered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
        {required && <span className="ml-1 text-violet-400">*</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={type === 'password' ? 'new-password' : 'off'}
        className="cursor-target w-full rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder-white/25 transition focus:border-violet-500/50 focus:bg-white/[0.04] focus:outline-none"
      />
    </div>
  );
}