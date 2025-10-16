/**
 * Performance optimization utilities
 * Provides helpers for detecting user preferences and optimizing animations
 */

/**
 * Check if user prefers reduced motion (accessibility)
 * @returns true if user has reduced motion preference enabled
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user's motion preference
 * @param normalDuration - Normal animation duration in seconds
 * @param reducedDuration - Reduced animation duration in seconds (default: 0)
 * @returns Appropriate duration based on user preference
 */
export const getAnimationDuration = (
  normalDuration: number,
  reducedDuration: number = 0
): number => {
  return prefersReducedMotion() ? reducedDuration : normalDuration;
};

/**
 * Get particle count based on performance mode
 * Reduces particle count for better performance on lower-end devices
 * @param normalCount - Normal particle count
 * @param performanceMode - Performance mode ('auto' | 'high' | 'low')
 * @returns Appropriate particle count
 */
export const getParticleCount = (
  normalCount: number,
  performanceMode: 'auto' | 'high' | 'low' = 'auto'
): number => {
  if (performanceMode === 'low') {
    return Math.max(1, Math.floor(normalCount * 0.5));
  }

  if (performanceMode === 'high') {
    return normalCount;
  }

  // Auto mode: detect device performance
  // Use navigator.hardwareConcurrency as a proxy for device capability
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) {
    const cores = navigator.hardwareConcurrency;

    // Low-end devices (1-2 cores): reduce to 50%
    if (cores <= 2) {
      return Math.max(1, Math.floor(normalCount * 0.5));
    }

    // Mid-range devices (3-4 cores): reduce to 75%
    if (cores <= 4) {
      return Math.max(1, Math.floor(normalCount * 0.75));
    }
  }

  // High-end devices or fallback: use normal count
  return normalCount;
};

/**
 * Create Framer Motion animation config with performance optimizations
 * @param config - Base animation configuration
 * @returns Optimized animation configuration
 */
export const optimizeAnimation = (config: {
  duration?: number;
  delay?: number;
  repeat?: number;
  ease?: string;
}) => {
  const { duration = 1, delay = 0, repeat = 0, ease = 'easeInOut' } = config;

  if (prefersReducedMotion()) {
    return {
      duration: 0,
      delay: 0,
      repeat: 0,
      ease: 'linear',
    };
  }

  return {
    duration,
    delay,
    repeat,
    ease,
  };
};

/**
 * Performance monitoring - measure component render time
 * @param componentName - Name of the component being measured
 * @param callback - Function to execute and measure
 */
export const measurePerformance = <T>(
  componentName: string,
  callback: () => T
): T => {
  if (typeof performance === 'undefined') {
    return callback();
  }

  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();

  const duration = endTime - startTime;

  // Log slow operations (> 16ms = below 60fps)
  if (duration > 16) {
    console.warn(
      `[Performance] ${componentName} took ${duration.toFixed(2)}ms (> 16ms threshold)`
    );
  }

  return result;
};

/**
 * Debounce function for limiting rapid-fire animations
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
};

/**
 * Request idle callback polyfill for non-urgent tasks
 * @param callback - Function to execute during idle time
 * @param options - Options for idle callback
 */
export const requestIdleCallback = (
  callback: () => void,
  options?: { timeout?: number }
) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  }

  // Fallback to setTimeout
  return setTimeout(callback, options?.timeout ?? 1);
};

/**
 * Cancel idle callback
 * @param id - ID returned from requestIdleCallback
 */
export const cancelIdleCallback = (id: number) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id);
  }

  clearTimeout(id);
};

/**
 * Detect if device is low-end based on various factors
 * @returns true if device is likely low-end
 */
export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;

  const factors: boolean[] = [
    // Low CPU cores
    navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 2 : false,

    // Low memory (< 4GB)
    (navigator as any).deviceMemory ? (navigator as any).deviceMemory < 4 : false,

    // Slow connection
    (navigator as any).connection?.effectiveType
      ? ['slow-2g', '2g', '3g'].includes((navigator as any).connection.effectiveType)
      : false,
  ];

  // If at least 2 factors are true, consider it low-end
  return factors.filter(Boolean).length >= 2;
};
