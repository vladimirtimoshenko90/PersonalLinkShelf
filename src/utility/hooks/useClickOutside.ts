import { useEffect, useRef, type RefObject } from 'react';

export function useClickOutside(ref: RefObject<HTMLElement | null>, onOutside: () => void) {
  const onOutsideRef = useRef(onOutside);
  onOutsideRef.current = onOutside;

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current?.contains(event.target as Node)) {
        return;
      }
      onOutsideRef.current();
    }

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [ref]);
}
