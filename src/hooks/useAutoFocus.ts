import { useEffect, type RefObject } from 'react';

export function useAutoFocus(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);
}
