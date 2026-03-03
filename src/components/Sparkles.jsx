import React, { useEffect, useState } from 'react';

export default function Sparkles({ count = 12 }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const pos = Array.from({ length: count }).map(() => ({
      left: Math.random() * 100, // percent
      top: Math.random() * 60, // percent (keep within upper area)
      delay: Math.random() * 2,
      size: 6 + Math.random() * 10,
    }));
    setPositions(pos);
  }, [count]);

  return (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {positions.map((p, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #fff, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.15) 60%, transparent 100%)',
            boxShadow: '0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(125, 58, 255, 0.15)',
            transform: 'translate(-50%, -50%) scale(0.9)',
            opacity: 0,
            animation: `twinkle 2.5s ${p.delay}s infinite ease-in-out`,
          }}
        />
      ))}

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          40% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          70% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
        }
      `}</style>
    </div>
  );
}
