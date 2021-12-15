import { renderHook } from "@testing-library/react-hooks";
import { useLastCall } from "./useLastCall";

test("renders", () => {
  renderHook(() => useLastCall((_) => {}));
});
