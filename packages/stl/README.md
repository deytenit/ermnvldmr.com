# STL persistence

`createLocalStorage` and `createFragmentStorage` both implement
`PersistentStorage<T>`. Pass either manager to `useStorage` and keep its identity
stable by creating it at module scope or memoizing it when its configuration changes.
Treat returned values as immutable snapshots and make changes through the setter.

```tsx
import { createFragmentStorage, createLocalStorage, useStorage } from '@ermnvldmr/stl';
import type { PersistentStorage } from '@ermnvldmr/stl';

const local = createLocalStorage('example/filter', '');
const fragment = createFragmentStorage('filter', '');
const storage: PersistentStorage<string> = fragment; // Use local for browser-only persistence.

function Filter() {
  const [value, setValue] = useStorage(storage);
  return <input value={value} onChange={(event) => setValue(event.target.value)} />;
}
```

The hook renders the adapter's default during SSR and hydration, then reads
the browser snapshot. Use `get`, `set`, `remove`, and `subscribe` outside React.
Writes return whether the backend accepted the update. Successful writes notify
other subscribers in the same document. Browser storage and navigation events
also refresh subscribers.

Fragment storage allows 8 KiB for the complete fragment, including the namespace,
Base64url-encoded JSON, and any preserved suffix. Local storage allows 256 KiB
of UTF-8 JSON per key, subject to the browser's total storage quota. An oversized
`set()` throws `StorageCapacityError` before
changing the saved value or notifying subscribers. Oversized fragment payloads
fall back to the default on read, and `buildUrl()` returns `undefined` for them.

Both adapters accept JSON-compatible values. The fragment adapter owns one
leading namespace such as `#filter?~ImhlbGxvIg` and handles serialization
internally. It also reads earlier percent-encoded JSON payloads.
It preserves the page path, query, and any ordinary fragment, which follows
the settings when present. Use `omitSearchParams` when moving known keys out of
the URL query. Missing or malformed payloads fall back to the default. Use
`remove()` to delete the payload.
Fragment writes replace the current history entry unless you pass
`{ history: 'push' }` to `set` or `remove`. Use `buildUrl` to generate a share
URL without changing the location, including after a rejected history write.
Omit the value to build a URL with the payload removed.
Copied links include the stored values, so use fragment storage for state that
people intend to share.
