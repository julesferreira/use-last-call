import { useEffect, useState } from "react";
import { useLastCall } from "./useLastCall";

function cancelUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

function App() {
  useLastCall((e) => {
    localStorage.setItem("useLastCall", e.type);
    setCount(0);
  });

  const [unloadCanceled, setUnloadCanceled] = useState(true);
  useEffect(() => {
    if (unloadCanceled) {
      window.addEventListener("beforeunload", cancelUnload);
      return () => window.removeEventListener("beforeunload", cancelUnload);
    }
  }, [unloadCanceled]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  });

  return (
    <div>
      <p>`useLastCall` hook</p>
      <p>
        <strong>{count}</strong> <em>counts</em> since <code>useLastCall</code>
      </p>
      <label>
        <input
          type="checkbox"
          checked={unloadCanceled}
          onChange={() => setUnloadCanceled((prev) => !prev)}
        />
        attempt to cancel unload
      </label>
    </div>
  );
}

export default App;
