import MaskedHeading from '../text/MaskedHeading';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'items-center text-center';
  return (
    <div className={`flex flex-col ${alignment} mb-12`}>
      {eyebrow && (
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-px bg-white/20" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">
            {eyebrow}
          </span>
          <div className="w-6 h-px bg-white/20" />
        </div>
      )}
      <div className="max-w-3xl">
        <MaskedHeading
          text={title}
          className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
        />
      </div>
      {subtitle && (
        <p className="text-white/50 mt-4 max-w-2xl text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}