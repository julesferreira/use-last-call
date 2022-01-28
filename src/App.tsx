import { useEffect, useState } from "react";
import { useLastCall } from "./useLastCall";

function cancelUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

type EventList = [string, number][];
type PushEvent = (e: Event) => void;
function useEventLogger(): [EventList, PushEvent] {
  const [events, setEvents] = useState<EventList>(() => {
    try {
      const item = localStorage.getItem("useLastCall");
      if (item === null) {
        throw new Error("key not found");
      }
      return JSON.parse(item);
    } catch (_) {
      return [];
    }
  });

  const pushEvent: PushEvent = (e: Event) => {
    setEvents((prevEvents) => {
      return [[e.type, Date.now()], ...prevEvents].slice(0, 5) as EventList;
    });
  };

  useEffect(() => {
    localStorage.setItem("useLastCall", JSON.stringify(events));
  }, [events]);

  return [events, pushEvent];
}

function App() {
  useLastCall((e) => {
    pushEvent(e);
    setNow(Date.now());
  });
  const [events, pushEvent] = useEventLogger();

  const [now, setNow] = useState(Date.now());
  const [unloadCanceled, setUnloadCanceled] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  });

  useEffect(() => {
    if (unloadCanceled) {
      window.addEventListener("beforeunload", cancelUnload);
      return () => window.removeEventListener("beforeunload", cancelUnload);
    }
  }, [unloadCanceled]);

  return (
    <div>
      <p>`useLastCall` hook</p>
      <div>
        {events.map(([e, t]) => (
          <p key={e + t}>
            {e} {Math.floor((now - t) / 1000)}s ago
          </p>
        ))}
      </div>
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
