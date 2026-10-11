import useLenis from '../hooks/useLenis';

/**
 * App-level smooth scroll provider.
 * Wraps children in a Lenis-managed scroll container.
 * Only mount this on pages that benefit from momentum scroll
 * (landings, marketing pages) — not on dense dashboards.
 */
export default function SmoothScrollProvider({ children }) {
  useLenis();
  return <>{children}</>;
}