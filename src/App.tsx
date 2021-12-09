import { useLastCall } from "./useLastCall";

function App() {
  useLastCall((e) => localStorage.setItem("useLastCall", e.type));
  return (
    <div>
      <p>`useLastCall` hook</p>
    </div>
  );
}

export default App;
