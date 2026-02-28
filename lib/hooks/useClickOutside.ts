import { RefObject, useEffect, useRef } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: PointerEvent) => void,
  options?: { disabled?: boolean },
): void {
  const handlerRef = useRef(handler);

  // Always keep latest handler without re-subscribing
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (options?.disabled) return;

    const listener = (event: PointerEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;

      handlerRef.current(event);
    };

    document.addEventListener("pointerdown", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [ref, options?.disabled]);
}
