import { useRef, useEffect } from "react";

function useListener<K extends keyof DocumentEventMap>(
  target: Document,
  event: K,
  handler: (event: DocumentEventMap[K]) => void
): void;
function useListener<K extends keyof WindowEventMap>(
  target: Window,
  event: K,
  handler: (event: WindowEventMap[K]) => void
): void;
function useListener<K extends keyof (DocumentEventMap & WindowEventMap)>(
  target: Document | Window,
  event: K,
  handler: (event: (DocumentEventMap & WindowEventMap)[K]) => void
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (ev: any) => handlerRef.current(ev);
    target.addEventListener(event, listener);
    return () => target.removeEventListener(event, listener);
  }, [event, target]);
}

export { useListener };
