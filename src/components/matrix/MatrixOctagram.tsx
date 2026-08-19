'use client';

import React from 'react';
import { MatrixData, MatrixNode } from '@/lib/types';
import { motion } from 'framer-motion';

interface MatrixOctagramProps {
  data: MatrixData;
  selectedNodeKey: string;
  onSelectNode: (node: MatrixNode) => void;
}

export default function MatrixOctagram({ data, selectedNodeKey, onSelectNode }: MatrixOctagramProps) {
  const m = data.matrix;

  const nodes = [
    { ...m.top, cx: 300, cy: 60, fill: '#DFB15B', labelPos: 'top' },
    { ...m.bottom, cx: 300, cy: 540, fill: '#FF4B4B', labelPos: 'bottom' },
    { ...m.left, cx: 60, cy: 300, fill: '#DFB15B', labelPos: 'left' },
    { ...m.right, cx: 540, cy: 300, fill: '#DFB15B', labelPos: 'right' },
    { ...m.center, cx: 300, cy: 300, fill: '#DFB15B', labelPos: 'center', r: 24 },
    { ...m.fatherTop, cx: 130, cy: 130, fill: '#38EF7D', labelPos: 'top-left' },
    { ...m.motherTop, cx: 470, cy: 130, fill: '#38EF7D', labelPos: 'top-right' },
    { ...m.motherBottom, cx: 470, cy: 470, fill: '#FF4B4B', labelPos: 'bottom-right' },
    { ...m.fatherBottom, cx: 130, cy: 470, fill: '#FF4B4B', labelPos: 'bottom-left' },
    { ...m.money, cx: 420, cy: 300, fill: '#38EF7D', labelPos: 'inner-right' },
    { ...m.love, cx: 300, cy: 420, fill: '#DFB15B', labelPos: 'inner-bottom' },
  ];

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-2">
      <svg
        viewBox="0 0 600 600"
        className="w-full max-w-[520px] h-auto drop-shadow-[0_0_35px_rgba(223,177,91,0.18)]"
      >
        <defs>
          <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="grad-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DFB15B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#070A0F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Center Glow Aura */}
        <circle cx="300" cy="300" r="180" fill="url(#grad-center)" />

        {/* Outer Sacred Circles */}
        <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(223, 177, 91, 0.15)" strokeWidth="1" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(223, 177, 91, 0.35)" strokeWidth="1" strokeDasharray="6 6" className="animate-spin-slow origin-center" />
        <circle cx="300" cy="300" r="170" fill="none" stroke="rgba(223, 177, 91, 0.1)" strokeWidth="1" />

        {/* Square 1 (Personal Square: Straight) */}
        <polygon
          points="300,60 540,300 300,540 60,300"
          fill="rgba(223, 177, 91, 0.02)"
          stroke="#DFB15B"
          strokeWidth="2"
          strokeOpacity="0.85"
        />

        {/* Square 2 (Ancestral Rhombus: Rotated 45 deg) */}
        <polygon
          points="130,130 470,130 470,470 130,470"
          fill="rgba(56, 239, 125, 0.015)"
          stroke="#38EF7D"
          strokeWidth="1.5"
          strokeOpacity="0.65"
          strokeDasharray="4 4"
        />

        {/* Connecting Diagonals & Lines */}
        <line x1="300" y1="60" x2="300" y2="540" stroke="rgba(223, 177, 91, 0.25)" strokeWidth="1" />
        <line x1="60" y1="300" x2="540" y2="300" stroke="rgba(223, 177, 91, 0.25)" strokeWidth="1" />
        <line x1="130" y1="130" x2="470" y2="470" stroke="rgba(56, 239, 125, 0.2)" strokeWidth="1" />
        <line x1="470" y1="130" x2="130" y2="470" stroke="rgba(56, 239, 125, 0.2)" strokeWidth="1" />

        {/* Money & Love Channel Lines */}
        <line x1="300" y1="300" x2="420" y2="300" stroke="#38EF7D" strokeWidth="2.5" strokeOpacity="0.8" />
        <line x1="300" y1="300" x2="300" y2="420" stroke="#DFB15B" strokeWidth="2.5" strokeOpacity="0.8" />

        {/* Clickable Matrix Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeKey === node.key;
          const radius = node.r || (isSelected ? 20 : 17);

          return (
            <g
              key={node.key}
              className="cursor-pointer transition-all duration-300 group"
              onClick={() => onSelectNode(node as MatrixNode)}
            >
              {/* Outer Glow on Selection / Hover */}
              {(isSelected || node.key === 'center') && (
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={radius + 8}
                  fill="none"
                  stroke={node.fill}
                  strokeWidth="2"
                  strokeOpacity={isSelected ? 0.9 : 0.4}
                  className="animate-pulse"
                />
              )}

              {/* Node Background */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={radius}
                fill="#070A0F"
                stroke={isSelected ? '#FBE6B5' : node.fill}
                strokeWidth={isSelected ? 3 : 2}
                className="group-hover:stroke-gold group-hover:scale-110 transition-transform origin-center"
              />

              {/* Arcana Value Number */}
              <text
                x={node.cx}
                y={node.cy + 5}
                textAnchor="middle"
                fontSize={radius > 20 ? '16' : '13'}
                fontWeight="700"
                fontFamily="var(--font-cinzel)"
                fill={isSelected ? '#FBE6B5' : '#FFFFFF'}
                className="pointer-events-none"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
