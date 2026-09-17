import { useEffect, useRef, type RefObject } from 'react';

export function useBlur(ref: RefObject<HTMLElement | null>, onBlur: (event: FocusEvent) => void) {
  const onBlurRef = useRef(onBlur);
  onBlurRef.current = onBlur;

  useEffect(() => {
    const node = ref.current;
    if (node == null) {
      return;
    }

    function onLostFocus(event: FocusEvent) {
      onBlurRef.current(event);
    }

    node.addEventListener('blur', onLostFocus);
    return () => {
      node.removeEventListener('blur', onLostFocus);
    };
  }, [ref]);
}
