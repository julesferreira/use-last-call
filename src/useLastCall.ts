import { useRef, useEffect } from "react";

function useLastCall(fn: (e: Event) => void) {
  const locked = useRef(false);

  function lastCall(e: Event) {
    if (
      e.type === "visibilitychange" &&
      document.visibilityState === "visible"
    ) {
      locked.current = false;
      return;
    }
    if (locked.current) {
      return;
    }

    locked.current = true;
    fn(e);
  }

  useListener(window, "pagehide", lastCall);
  useListener(window, "beforeunload", lastCall);
  useListener(document, "visibilitychange", lastCall);
}

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

export { useLastCall };
