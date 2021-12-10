import { useEffect, useState } from "react";
import { useLastCall } from "./useLastCall";

function App() {
  useLastCall((e) => {
    localStorage.setItem("useLastCall", e.type);
    setCount(0);
  });

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
    </div>
  );
}

export default App;
