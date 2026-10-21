import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable ScrollReveal component using IntersectionObserver.
 * Smoothly reveals content with a silky fade-in and subtle upward float as you scroll.
 * Respects `prefers-reduced-motion`.
 */
export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 550, // ms duration for smooth Apple/Linear feel
  direction = 'up', // 'up' | 'none'
  threshold = 0.08,
  distance = 24, // px translate distance
  once = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const transformStyle = direction === 'up'
    ? (isVisible ? 'translateY(0)' : `translateY(${distance}px)`)
    : 'none';

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: transformStyle,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
