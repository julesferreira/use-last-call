import { useEffect, useState } from "react";
import { useLastCall } from "./useLastCall";
import gh from "./gh32.png";

function cancelUnload(e: BeforeUnloadEvent) {
  e.preventDefault();
  e.returnValue = "";
}

type EventList = [string, number][];
type PushEvent = (e: Event) => void;
function useEventLogger(): [EventList, PushEvent, () => void] {
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

  const clearEvents = () => {
    setEvents([]);
  };

  useEffect(() => {
    localStorage.setItem("useLastCall", JSON.stringify(events));
  }, [events]);

  return [events, pushEvent, clearEvents];
}

function App() {
  useLastCall((e) => {
    pushEvent(e);
    setNow(Date.now());
  });
  const [events, pushEvent, clearEvents] = useEventLogger();

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
    <div className="mx-auto mt-8 prose prose-invert lg:prose-lg">
      <h1 className="flex items-baseline justify-between">
        <span>
          <code>useLastCall</code> hook
        </span>
        <a
          href="https://github.com/julesferreira/use-last-call"
          title="View on GitHub"
        >
          <img
            alt="View on GitHub"
            className="opacity-80 hover:opacity-100"
            src={gh}
            style={{ margin: 0 }}
          />
        </a>
      </h1>
      <h4>
        A custom React Hook that executes a callback when a user is exiting your
        app- in both desktop and mobile browsers.
      </h4>
      <p>
        In this demo app, <code>useLastCall</code> watches you leave (with a
        tear in its eye) and saves the event that indicated your departure (to
        localStorage).
      </p>
      <p>Use the table below to see when and why the callback is invoked.</p>
      <table>
        <thead>
          <tr>
            <th>triggered by</th>
            <th>seconds ago</th>
          </tr>
        </thead>
        <tbody>
          {events.length < 1 && (
            <tr>
              <td colSpan={2}>
                Nothing yet . . .
                <blockquote style={{ marginBottom: 0 }}>
                  Get out of here! Go to the Writer’s Room. There is no
                  scholarship. Can’t you see we don’t want you any more? Why
                  don’t you go back where you came from?! Leave me alone!
                  <br />
                  <br />
                  Goodbye, my friend.
                </blockquote>
              </td>
            </tr>
          )}
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
      {events.length > 0 && (
        <div className="flex items-center justify-between">
          <label>
            <input
              type="checkbox"
              checked={unloadCanceled}
              onChange={() => setUnloadCanceled((prev) => !prev)}
            />{" "}
            simulate a third-party attempt to cancel unload
          </label>
          <button
            className="px-3 py-2 border border-white/20 hover:border-white/40 hover:text-white"
            type="reset"
            onClick={() => {
              setUnloadCanceled(false);
              clearEvents();
            }}
          >
            clear
          </button>
        </div>
      )}
      <div className="flex justify-around mt-4 border-t">
        <div>
          <h4>Ways to leave</h4>
          <ul>
            <li>refresh the page</li>
            <li>switch tabs</li>
            <li>
              navigate to{" "}
              <a href="https://github.com/julesferreira/use-last-call">
                the repo
              </a>
            </li>
            <li>move forward/back</li>
            <li>close the browser</li>
          </ul>
        </div>
        <div>
          <h4>
            <em>Stylish</em> ways to leave
          </h4>
          <ul>
            <li>get a call while viewing on mobile</li>
            <li>restart your machine</li>
            <li>
              close this tab in{" "}
              <a href="https://bugs.webkit.org/buglist.cgi?quicksearch=151610%20194897">
                Safari
              </a>{" "}
              . . . <em>(」° ロ °)」</em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
