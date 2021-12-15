import { useEffect } from "react";

function useListener(
  target: Document,
  event: "visibilitychange",
  handler: (e: DocumentEventMap[typeof event]) => void
): void;
function useListener(
  target: Window,
  event: "pagehide" | "beforeunload",
  handler: (e: WindowEventMap[typeof event]) => void
): void;
function useListener(
  target: Document | Window,
  event: string,
  handler: EventListener
) {
  useEffect(() => {
    if (!("on" + event in target)) {
      return;
    }

    target.addEventListener(event, handler);
    return () => target.removeEventListener(event, handler);
  }, [target, event, handler]);
}

export { useListener };
