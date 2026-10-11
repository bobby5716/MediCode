import TargetCursor from '../animations/TargetCursor';
import ErrorBoundary from '../ErrorBoundary';

export default function CursorLayer() {
  return (
    <ErrorBoundary silent>
      <TargetCursor
        targetSelector=".cursor-target, a, button"
        spinDuration={2.5}
        hideDefaultCursor={true}
        hoverDuration={0.2}
        parallaxOn={true}
        cursorColor="#ffffff"
      />
    </ErrorBoundary>
  );
}