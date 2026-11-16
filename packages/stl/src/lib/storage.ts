/** Manages a value stored under a named key. */
export interface StorageManager<T> {
  /** The key used by the storage backend. */
  readonly key: string;
  /** Gets the stored value or its default. */
  get: () => T;
  /** Stores a value or computes an update from the current stored value. */
  set: (value: T | ((prev: T) => T)) => void;
  /** Removes the stored value. */
  remove: () => void;
}

/** A storage manager that exposes snapshots, change notifications, and write results. */
export interface PersistentStorage<T> extends StorageManager<T> {
  /** Gets the current snapshot, preserving identity while the stored value is unchanged. */
  get: () => T;
  /** Gets the default snapshot used during SSR and hydration. */
  getServerSnapshot: () => T;
  /** Watches for changes and returns an unsubscribe function. */
  subscribe: (listener: () => void) => () => void;
  /** Stores a value or update. Throws {@link StorageCapacityError} above the backend limit. */
  set: (value: T | ((prev: T) => T)) => boolean;
  /** Removes the stored value and reports whether storage accepted the change. */
  remove: () => boolean;
}

/** Indicates that the encoded value exceeds the storage adapter's write limit. */
export class StorageCapacityError extends RangeError {
  /**
   * Reports the maximum encoded size in bytes.
   *
   * @example
   * throw new StorageCapacityError(8192);
   */
  constructor(readonly limitBytes: number) {
    super(`Storage value exceeds the ${limitBytes}-byte limit.`);
    this.name = 'StorageCapacityError';
  }
}

/**
 * Reuses a decoded snapshot until its serialized input changes.
 *
 * @example
 * const get = createStorageSnapshot(readSerialized, decodeSettings, defaultSettings);
 */
export function createStorageSnapshot<T>(
  read: () => string | null,
  decode: (raw: string) => T | undefined,
  defaultValue: T
): () => T {
  let previousRaw: string | null = null;
  let snapshot = defaultValue;

  return () => {
    const raw = read();
    if (raw !== previousRaw) {
      const value = raw === null ? undefined : decode(raw);
      if (value === undefined) {
        snapshot = defaultValue;
      } else {
        snapshot = value;
      }
      previousRaw = raw;
    }
    return snapshot;
  };
}

/**
 * Parses JSON written by a storage manager. The type describes the caller's stored value.
 *
 * @example
 * const value = parseStoredJson<string>('"light"');
 */
export function parseStoredJson<T>(raw: string): T {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return JSON.parse(raw) as T;
}
