# [use-last-call]

A custom [React Hook] that executes a callback when a user is exiting your app- in both desktop and mobile browsers.

## Overview

_TL;DR: fires like a `visibilitychange` to `'hidden'`, but with global usage compatibility of **99%** (as opposed to the current **76%**)_

Web browsers can be _weird_ about communicating the unloading of pages to developers. [use-last-call] attempts to abstract away that _weirdness_ so a final invocation reliably occurs- whenever plausible. It listens, and responds, to the first in a series of browser events that indicate a user is transitioning away from a page _(e.g. window close, refresh, history navigation, location change, tab switch, etc..)_. Some fun edge cases (read: _weirdness_):

- A mobile user receives a phone call mid-form-fill
- Security updates opt for _"Restart Now"_ over _"Remind me Later"_
- Someone using [Safari] closes a tab . . . **(」° ロ °)」**

_Try these (and your users' favorite non-traditional exits) in [the demo app]_

## Install

```sh
npm i use-last-call
```

## Use

```tsx
useLastCall(fn: (event: Event) => void): void;
```

_Note: the callback `fn` is passed the actual `Event` that triggered execution_

### Example: send analytics

Send some `analyticsData` at the end of a session

```tsx
import { useLastCall } from "use-last-call";

function App() {
  useLastCall(() => navigator.sendBeacon("/log", analyticsData));
  ...
}
```

### Example: save state

Transparently save state without interrupting user

```tsx
import { useState } from "react";
import { useLastCall } from "use-last-call";

function App() {
  useLastCall(() => {
    sessionStorage.setItem("formValues", JSON.stringify(formValues));
  });

  const [formValues, setFormValues] = useState<{
    title: string;
    description: string;
    ...
  }>(() => {
    const item = sessionStorage.getItem("formValues");
    return item === null ? { title: "", description: "", ... } : JSON.parse(item);
  });

  return (
    <div>
      <input
        type="text"
        value={formValues.title}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      ...
    </div>
  );
}
```

## See also

- [Don't lose user and app state, use Page Visibility](https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/)
- [Page Lifecycle API](https://developers.google.com/web/updates/2018/07/page-lifecycle-api)
- [Page Visibility API](https://developer.mozilla.org/docs/Web/API/Page_Visibility_API)
- Monitored events: [`visibilitychange`], [`pagehide`], and [`beforeunload`]

[`beforeunload`]: https://developer.mozilla.org/docs/Web/API/Window/beforeunload_event
[`pagehide`]: https://developer.mozilla.org/docs/Web/API/Window/pagehide_event
[`visibilitychange`]: https://developer.mozilla.org/docs/Web/API/Document/visibilitychange_event
[react hook]: https://reactjs.org/docs/hooks-intro.html
[safari]: https://bugs.webkit.org/buglist.cgi?quicksearch=151610%20194897
[the demo app]: https://julesferreira.github.io/use-last-call
[use-last-call]: https://github.com/julesferreira/use-last-call
