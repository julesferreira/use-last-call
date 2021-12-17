import { renderHook } from "@testing-library/react-hooks";
import { useLastCall } from "./useLastCall";

describe("useLastCall", () => {
  test("renders", () => {
    renderHook(() => useLastCall((_) => {}));
  });
  describe("fires callback", () => {
    test.each([
      { target: window, event: "beforeunload" },
      { target: window, event: "pagehide" },
      { target: document, event: "visibilitychange" },
    ])("$event", ({ target, event }) => {
      const originalVisibilityState = document.visibilityState;
      setVisibilityState(document, "hidden");

      const cb = jest.fn((e: Event) => e.type);
      renderHook(() => useLastCall(cb));
      target.dispatchEvent(new Event(event));

      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(event);

      setVisibilityState(document, originalVisibilityState);
    });
  });
  test("locks against duplicate last calls", () => {
    const cb = jest.fn((e: Event) => e.type);
    renderHook(() => useLastCall(cb));
    window.dispatchEvent(new Event("beforeunload"));
    window.dispatchEvent(new Event("pagehide"));
    window.dispatchEvent(new Event("beforeunload"));

    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveReturnedWith("beforeunload");
  });
  test("unlocks after return to tab", () => {
    const originalVisibilityState = document.visibilityState;
    const cb = jest.fn((e: Event) => e.type);
    renderHook(() => useLastCall(cb));

    // switch to different tab
    setVisibilityState(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("beforeunload"));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveReturnedWith("visibilitychange");

    cb.mockClear();

    // return to tab
    setVisibilityState(document, "visible");
    document.dispatchEvent(new Event("visibilitychange"));

    // close tab
    window.dispatchEvent(new Event("beforeunload"));
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveReturnedWith("beforeunload");

    setVisibilityState(document, originalVisibilityState);
  });
});

function setVisibilityState(doc: Document, state: VisibilityState) {
  Object.defineProperty(doc, "visibilityState", {
    configurable: true,
    get: () => state,
  });
}
