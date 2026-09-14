import { useEffect, useRef, type RefObject } from 'react';

export function useKeyPress(
  target: RefObject<HTMLElement | null> | Document,
  key: 'Escape' | 'Enter',
  onPress: (event: KeyboardEvent) => void,
) {
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  useEffect(() => {
    const node = 'current' in target ? target.current : target;
    if (node == null) {
      return;
    }

    function onKeyDown(event: Event) {
      if (!(event instanceof KeyboardEvent) || event.key !== key) {
        return;
      }
      onPressRef.current(event);
    }

    node.addEventListener('keydown', onKeyDown);
    return () => {
      node.removeEventListener('keydown', onKeyDown);
    };
  }, [key, target]);
}
