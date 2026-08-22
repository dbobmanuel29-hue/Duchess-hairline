import type { ReactNode } from 'react';
import { useInView } from '../hooks/useInView';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in seconds, useful inside grids. */
  delay?: number;
}

/** Fade-and-lift wrapper. Respects prefers-reduced-motion via CSS. */
export default function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'in-view' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
