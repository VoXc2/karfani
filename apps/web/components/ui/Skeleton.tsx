'use client';

import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-cream-dark via-cream to-cream-dark animate-shimmer rounded-md',
        className
      )}
      style={style}
    />
  );
}

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  lastLineWidth?: string;
}

export function SkeletonText({ lines = 3, lastLineWidth = '60%', className }: SkeletonTextProps) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

interface SkeletonRectProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function SkeletonRect({ width, height, className }: SkeletonRectProps) {
  return (
    <Skeleton
      className={className}
      style={{ width, height }}
    />
  );
}

interface SkeletonCircleProps {
  className?: string;
  size?: string | number;
}

export function SkeletonCircle({ size = 40, className }: SkeletonCircleProps) {
  const sizeValue = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-cream-dark via-cream to-cream-dark animate-shimmer rounded-full shrink-0',
        className
      )}
      style={{ width: sizeValue, height: sizeValue }}
    />
  );
}
