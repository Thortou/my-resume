'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoScrollOptions {
  dependency?: unknown;
  smooth?: boolean;
  threshold?: number;
}

export function useAutoScroll<T extends HTMLElement>({
  dependency,
  smooth = true,
  threshold = 100,
}: UseAutoScrollOptions = {}) {
  const containerRef = useRef<T>(null);
  const shouldAutoScrollRef = useRef(true);

  // Check if we should auto-scroll based on scroll position
  const checkShouldAutoScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    return distanceFromBottom <= threshold;
  }, [threshold]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [smooth]);

  // Handle scroll event to update auto-scroll state
  const handleScroll = useCallback(() => {
    shouldAutoScrollRef.current = checkShouldAutoScroll();
  }, [checkShouldAutoScroll]);

  // Auto-scroll when dependency changes
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      scrollToBottom();
    }
  }, [dependency, scrollToBottom]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    scrollToBottom,
    isAtBottom: checkShouldAutoScroll,
  };
}
