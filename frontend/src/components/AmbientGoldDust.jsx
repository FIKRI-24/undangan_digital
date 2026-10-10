import React from 'react';

/**
 * AmbientGoldDust Component
 * Renders lightweight, pure CSS ambient gold dust / shimmer particles
 * to create a magical, luxury atmosphere on Cover and Hero sections.
 * 
 * GPU accelerated, 60fps, pointer-events: none, aria-hidden: true.
 */
const PARTICLES = [
  { top: '12%', left: '15%', size: 4, duration: '8s', delay: '0s' },
  { top: '22%', left: '82%', size: 3, duration: '11s', delay: '1.2s' },
  { top: '35%', left: '10%', size: 5, duration: '9s', delay: '2.5s' },
  { top: '48%', left: '88%', size: 4, duration: '12s', delay: '0.8s' },
  { top: '60%', left: '18%', size: 3, duration: '10s', delay: '3.1s' },
  { top: '68%', left: '80%', size: 5, duration: '7s', delay: '1.8s' },
  { top: '78%', left: '25%', size: 4, duration: '13s', delay: '2.2s' },
  { top: '85%', left: '72%', size: 3, duration: '9s', delay: '4.0s' },
  { top: '28%', left: '48%', size: 4, duration: '10s', delay: '3.5s' },
  { top: '74%', left: '50%', size: 5, duration: '8s', delay: '1.5s' },
];

export default function AmbientGoldDust({ count = 10, className = '' }) {
  const particles = PARTICLES.slice(0, count);

  return (
    <div className={`ambient-dust-container ${className}`} aria-hidden="true">
      {particles.map((p, idx) => (
        <span
          key={idx}
          className="ambient-dust-particle"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--drift-duration': p.duration,
            '--drift-delay': p.delay,
          }}
        />
      ))}
    </div>
  );
}
