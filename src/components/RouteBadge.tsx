import React from 'react';
import { TransitMode } from '../types/transit';

interface RouteBadgeProps {
  code: string;
  mode?: TransitMode;
  customColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const getModeColor = (mode?: TransitMode, code?: string): string => {
  if (code?.startsWith('M') || mode === 'metro') return '#0284C7'; // Metro Cyan/Blue
  if (code?.startsWith('T') || mode === 'tram') return '#059669'; // Tram Emerald
  if (code?.startsWith('B') || mode === 'bus') return '#E11D48'; // Bus Red
  if (code?.startsWith('X') || mode === 'express') return '#D97706'; // Express Amber
  if (code?.startsWith('N') || mode === 'night') return '#7C3AED'; // Night Owl Violet
  return '#00875A'; // Default Transit Emerald
};

export const RouteBadge: React.FC<RouteBadgeProps> = ({
  code,
  mode,
  customColor,
  size = 'md',
  className = '',
}) => {
  const bg = customColor || getModeColor(mode, code);

  let sizeStyles = 'h-[28px] px-[10px] text-[13px]';
  if (size === 'sm') {
    sizeStyles = 'h-[22px] px-[7px] text-[11px]';
  } else if (size === 'lg') {
    sizeStyles = 'h-[34px] px-[14px] text-[15px]';
  }

  return (
    <span
      style={{ backgroundColor: bg, color: '#FFFFFF' }}
      className={`inline-flex items-center justify-center font-hanken font-extrabold uppercase tracking-wider rounded-full shadow-sm shrink-0 select-none ${sizeStyles} ${className}`}
    >
      {code}
    </span>
  );
};
