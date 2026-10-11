import { useMemo } from 'react';

const RISK_COLORS = {
  low: '#22c55e',
  moderate: '#f59e0b',
  high: '#f97316',
  severe: '#ef4444',
};

export default function InteractionGraph({ drugs, interactions }) {
  const positions = useMemo(() => {
    const map = {};
    const n = drugs.length;
    drugs.forEach((drug, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      map[drug] = {
        x: 250 + Math.cos(angle) * 140,
        y: 180 + Math.sin(angle) * 140,
      };
    });
    return map;
  }, [drugs]);

  if (!drugs?.length) return null;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox="0 0 500 360" className="w-full h-auto">
        {/* Edges */}
        {interactions?.map((int, i) => {
          const [a, b] = int.pair || [];
          const pa = positions[a];
          const pb = positions[b];
          if (!pa || !pb) return null;
          const color = RISK_COLORS[int.riskLevel] || '#64748b';

          return (
            <g key={i}>
              <line
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={color}
                strokeWidth="3"
                strokeOpacity="0.6"
                strokeLinecap="round"
              />
              <circle cx={(pa.x + pb.x) / 2} cy={(pa.y + pb.y) / 2} r="10" fill={color} fillOpacity="0.15" />
              <text
                x={(pa.x + pb.x) / 2}
                y={(pa.y + pb.y) / 2 + 3}
                textAnchor="middle"
                fontSize="9"
                fill={color}
                fontWeight="bold"
              >
                !
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {drugs.map((drug, i) => {
          const p = positions[drug];
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="38" fill="#0a0a0f" stroke="#8b5cf6" strokeWidth="2" strokeOpacity="0.4" />
              <circle cx={p.x} cy={p.y} r="34" fill="#8b5cf6" fillOpacity="0.08" />
              <text
                x={p.x}
                y={p.y + 3}
                textAnchor="middle"
                fontSize="10"
                fill="#f5f5f7"
                fontWeight="600"
              >
                {drug.slice(0, 10)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-[10px] font-mono">
        {Object.entries(RISK_COLORS).map(([level, color]) => (
          <span key={level} className="flex items-center gap-1.5 text-white/50 capitalize">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}