import { useEffect, useRef } from 'react';

export const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      const elements = currentRef.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
    }

    return () => {
      if (currentRef) {
        const elements = currentRef.querySelectorAll('.reveal');
        elements.forEach(el => observer.unobserve(el));
      }
    };
  }, []);

  return ref;
};