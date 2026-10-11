import { Link } from 'react-router-dom';
import BlurText from '../text/BlurText';
import ShinyText from '../text/ShinyText';
import SpecularButton from '../ui-custom/SpecularButton';
import StarBorder from '../ui-custom/StarBorder';
import ErrorBoundary from '../ErrorBoundary';

export default function CTASection() {
  return (
    <section className="relative py-40 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.18) 0%, transparent 60%)',
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <ShinyText
          text="THE NEXT STEP IS YOURS"
          speed={4}
          className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono mb-8 block"
        />

        <BlurText
          text="Ready to see it work?"
          delay={80}
          animateBy="words"
          direction="top"
          className="text-5xl md:text-8xl font-bold tracking-tighter leading-[1.02] mb-8 justify-center"
        />

        <p className="text-white/50 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          Register, paste a real clinical note, and watch MediCode turn it into
          structured data in three seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link to="/register">
            <SpecularButton>Start Free</SpecularButton>
          </Link>
          <Link to="/login">
            <ErrorBoundary silent>
              <StarBorder color="#ffffff" speed="4s" className="rounded-xl">
                <span className="px-6 py-3 text-sm text-white/80 block">
                  Sign in
                </span>
              </StarBorder>
            </ErrorBoundary>
          </Link>
        </div>

        <p className="text-xs text-white/25 mt-10 font-mono tracking-wider">
          No credit card · 3-second setup · Groq free tier
        </p>
      </div>
    </section>
  );
}