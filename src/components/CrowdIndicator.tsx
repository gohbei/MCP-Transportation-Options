import React from 'react';
import { CrowdLevel } from '../types/transit';

interface CrowdIndicatorProps {
  level: CrowdLevel;
  showText?: boolean;
  className?: string;
}

export const CrowdIndicator: React.FC<CrowdIndicatorProps> = ({
  level,
  showText = false,
  className = '',
}) => {
  // 1: Low (Green), 2: Moderate (Amber), 3: Crowded (Red)
  const colors = {
    1: { active: '#34D399', text: 'Low Crowd', inactive: '#1F2937' },
    2: { active: '#F59E0B', text: 'Moderate', inactive: '#1F2937' },
    3: { active: '#EF4444', text: 'Crowded', inactive: '#1F2937' },
  };

  const current = colors[level] || colors[1];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#131b26] border border-[#26354a] text-xs ${className}`}
      title={`Occupancy: ${current.text}`}
    >
      <div className="flex items-end gap-[3px] h-3.5">
        <span
          className="w-[3px] rounded-xs transition-all duration-300"
          style={{
            height: '6px',
            backgroundColor: current.active,
          }}
        />
        <span
          className="w-[3px] rounded-xs transition-all duration-300"
          style={{
            height: '10px',
            backgroundColor: level >= 2 ? current.active : '#26354a',
          }}
        />
        <span
          className="w-[3px] rounded-xs transition-all duration-300"
          style={{
            height: '14px',
            backgroundColor: level >= 3 ? current.active : '#26354a',
          }}
        />
      </div>

      {showText && (
        <span
          className="font-inter font-medium text-[11px] leading-none"
          style={{ color: current.active }}
        >
          {current.text}
        </span>
      )}
    </div>
  );
};
