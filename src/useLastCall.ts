import { useRef, useEffect, useCallback } from "react";
import { useListener } from "./useListener";

function useLastCall(fn: (e: Event) => void) {
  const fnRef = useRef(fn);
  const locked = useRef(false);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const lastCall = useCallback((e: Event) => {
    if (locked.current) {
      return;
    }

    locked.current = true;
    fnRef.current(e);
  }, []);

  const handleVisibilityChange = useCallback(
    (e: Event) => {
      if (document.visibilityState === "visible") {
        locked.current = false;
      } else if (document.visibilityState === "hidden") {
        lastCall(e);
      }
    },
    [lastCall]
  );

  useListener(window, "pagehide", lastCall);
  useListener(window, "beforeunload", lastCall);
  useListener(document, "visibilitychange", handleVisibilityChange);
}

export { useLastCall };
