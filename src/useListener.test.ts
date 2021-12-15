import { renderHook } from "@testing-library/react-hooks";
import { mock } from "jest-mock-extended";
import { useListener } from "./useListener";

describe("useListener", () => {
  test("attaches", () => {
    const handler = jest.fn();
    renderHook(() => useListener(window, "beforeunload", handler));
    window.dispatchEvent(new Event("beforeunload"));
    expect(handler).toHaveBeenCalledTimes(1);
  });
  test("unstable handler", () => {
    const firstHandler = jest.fn();
    const secondHandler = jest.fn();
    const { rerender } = renderHook(
      ({ handler }) => useListener(window, "beforeunload", handler),
      { initialProps: { handler: firstHandler } }
    );
    rerender({ handler: secondHandler });
    window.dispatchEvent(new Event("beforeunload"));
    expect(firstHandler).not.toHaveBeenCalled();
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });
  test("unmount cleanup", () => {
    const handler = jest.fn();
    const { unmount } = renderHook(() =>
      useListener(window, "beforeunload", handler)
    );
    unmount();
    window.dispatchEvent(new Event("beforeunload"));
    expect(handler).toHaveBeenCalledTimes(0);
  });
  test("same handler", () => {
    const handler = jest.fn();
    renderHook(() => useListener(window, "beforeunload", handler));
    renderHook(() => useListener(window, "beforeunload", handler));
    window.dispatchEvent(new Event("beforeunload"));
    expect(handler).toHaveBeenCalledTimes(1);
  });
  test("unsupported event", () => {
    const handler = () => {};
    const mockWindow = mock<Window>({
      onbeforeunload: null,
      onpagehide: null,
    });
    // remove 'beforeunload' support
    delete mockWindow["onbeforeunload" as any];

    const { unmount } = renderHook(() => {
      useListener(mockWindow, "beforeunload", handler);
      useListener(mockWindow, "pagehide", handler);
    });

    expect(mockWindow.addEventListener).toHaveBeenCalledTimes(1);
    expect(mockWindow.addEventListener).toHaveBeenCalledWith(
      "pagehide",
      handler
    );

    unmount();

    expect(mockWindow.removeEventListener).toHaveBeenCalledTimes(1);
    expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
      "pagehide",
      handler
    );
  });
});
