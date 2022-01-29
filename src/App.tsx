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
    <div className="mt-8 prose prose-invert mx-auto lg:prose-lg">
      <h1>
        <code>useLastCall</code> hook
      </h1>
      <table>
        <thead>
          <tr>
            <th>triggered by</th>
            <th>seconds ago</th>
          </tr>
        </thead>
        <tbody>
          {events.map(([e, t]) => (
            <tr key={e + t}>
              <td>
                <code>{e}</code>
              </td>
              <td>{Math.floor((now - t) / 1000)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>
        <label>
          <input
            type="checkbox"
            checked={unloadCanceled}
            onChange={() => setUnloadCanceled((prev) => !prev)}
          />
          &nbsp; attempt to cancel unload
        </label>
      </h4>
    </div>
  );
}

export default App;
