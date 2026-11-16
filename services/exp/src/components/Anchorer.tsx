import { PageContainer } from '@ermnvldmr/kits';
import {
  cn,
  createFragmentStorage,
  StorageCapacityError,
  useSearchParams,
  useStorage,
} from '@ermnvldmr/stl';
import { Button, Code, Container, HStack, Header, Switch, Text, VStack } from '@ermnvldmr/ui';
import { Braces, Percent } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { AnchorHTMLAttributes } from 'react';

const fieldClass =
  'w-full rounded-md border border-outline bg-[color-mix(in_srgb,var(--rb-container-base),var(--rb-ring)_10%)] px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-[var(--rb-ring)]';

const optionalFields = [
  { name: 'target', placeholder: '_self, _blank, or a frame name', defaultValue: '_self' },
  { name: 'rel', placeholder: 'noopener noreferrer', defaultValue: 'noopener' },
  { name: 'hreflang', placeholder: 'en', defaultValue: '' },
  { name: 'type', placeholder: 'text/html', defaultValue: '' },
  { name: 'ping', placeholder: 'Space-separated URLs', defaultValue: '' },
  { name: 'attributionsrc', placeholder: 'Space-separated URLs', defaultValue: '' },
] as const;

const placeholderPattern = /\{([^{}]+)\}|%7B((?:(?!%7[BD])[^{}])+)%7D/gi;

const referrerPolicies: NonNullable<AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy']>[] = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
];

/** Form settings for generating an anchor link, mirrored to the URL fragment. */
interface AnchorerSettings {
  href: string;
  text: string;
  target: string;
  rel: string;
  hreflang: string;
  type: string;
  ping: string;
  attributionsrc: string;
  referrerpolicy: string;
  download: boolean;
  filename: string;
  interpolation: ReadonlyMap<string, string>;
}

/** The submitted text and attributes of the generated anchor. */
interface GeneratedLink {
  text: string;
  destination: string;
  attributes: AnchorHTMLAttributes<HTMLAnchorElement> & { attributionsrc?: string };
}

const defaultSettings: AnchorerSettings = {
  href: '',
  text: '',
  target: '_self',
  rel: 'noopener',
  hreflang: '',
  type: '',
  ping: '',
  attributionsrc: '',
  referrerpolicy: '',
  download: false,
  filename: '',
  interpolation: new Map(),
};

/** Encodes a destination while preserving its authority and existing percent escapes. */
function encodeDestination(destination: string): string {
  const href = destination.trim();
  const authority = /^(?:[a-z][a-z\d+.-]*:)?\/\/[^/?#]*/i.exec(href)?.[0] ?? '';
  return authority + encodeURI(href.slice(authority.length)).replace(/%25(?=[\da-f]{2})/gi, '%');
}

/** Resolves a placeholder name from either spelling in the destination. */
function getPlaceholderName(rawName: string | undefined, encodedName: string): string {
  if (rawName !== undefined) return rawName;

  try {
    return decodeURIComponent(encodedName);
  } catch {
    return encodedName;
  }
}

/** Reads the unique placeholder names present in the destination. */
function getPlaceholderNames(href: string): string[] {
  return [
    ...new Set(
      Array.from(href.matchAll(placeholderPattern), ([, rawName, encodedName]) =>
        getPlaceholderName(rawName, encodedName)
      )
    ),
  ];
}

/** Restores known settings from untrusted share data. */
function restoreSettings(value: unknown): AnchorerSettings {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaultSettings;

  const entries: Record<string, unknown> = Object.fromEntries(Object.entries(value));
  const readText = (key: Exclude<keyof AnchorerSettings, 'download' | 'interpolation'>) => {
    const field = entries[key];
    return typeof field === 'string' ? field : defaultSettings[key];
  };
  const interpolation = new Map<string, string>();
  if (entries.interpolation && typeof entries.interpolation === 'object') {
    for (const [name, field] of Object.entries(entries.interpolation)) {
      if (typeof field === 'string' && field) interpolation.set(name, field);
    }
  }

  return {
    href: readText('href'),
    text: readText('text'),
    target: readText('target'),
    rel: readText('rel'),
    hreflang: readText('hreflang'),
    type: readText('type'),
    ping: readText('ping'),
    attributionsrc: readText('attributionsrc'),
    referrerpolicy: readText('referrerpolicy'),
    download: entries.download === true,
    filename: readText('filename'),
    interpolation,
  };
}

/** Selects the values that differ from their defaults for a compact share URL. */
function getStoredSettings(settings: AnchorerSettings): Record<string, unknown> | undefined {
  const { interpolation, filename, ...fields } = settings;
  const defaults: Record<string, unknown> = { ...defaultSettings };
  const stored: Record<string, unknown> = Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => value !== defaults[key])
  );
  if (settings.download && filename) stored.filename = filename;

  const values = getPlaceholderNames(settings.href)
    .map((name) => [name, interpolation.get(name)] as const)
    .filter(([, value]) => value);
  if (values.length) stored.interpolation = Object.fromEntries(values);

  return Object.keys(stored).length ? stored : undefined;
}

const settingsStorage = createFragmentStorage<unknown>('anchorer', undefined, {
  omitSearchParams: Object.keys(defaultSettings),
});

/** A local edit and the persisted snapshot it was made against. */
interface SettingsDraft {
  settings: AnchorerSettings;
  snapshot: unknown;
}

/** Derives the preview link or validation message from current settings. */
function resolveGeneratedLink(settings: AnchorerSettings): {
  link: GeneratedLink | null;
  error: string;
} {
  const href = settings.href
    .replace(
      placeholderPattern,
      (placeholder, rawName: string | undefined, encodedName: string) => {
        const name = getPlaceholderName(rawName, encodedName);
        const value = settings.interpolation.get(name);
        if (value === undefined) return placeholder;

        return encodeURIComponent(value.replace(/[\uD800-\uDFFF]/gu, '\uFFFD'));
      }
    )
    .trim();
  if (!href) {
    return { link: null, error: '' };
  }

  const referrerPolicy = settings.referrerpolicy.trim();
  const baseUrl = typeof window === 'undefined' ? 'https://localhost' : window.location.href;
  let url: URL | undefined;
  try {
    url = new URL(href, baseUrl);
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
  }

  if (!url || ['javascript:', 'vbscript:'].includes(url.protocol)) {
    return { link: null, error: 'Enter a valid URL with a navigable scheme.' };
  }

  return {
    error: '',
    link: {
      text: settings.text.trim() || url.href,
      destination: url.href,
      attributes: {
        href,
        target: settings.target.trim() || undefined,
        rel: settings.rel.trim() || undefined,
        hrefLang: settings.hreflang.trim() || undefined,
        type: settings.type.trim() || undefined,
        ping: settings.ping.trim() || undefined,
        download: settings.download ? settings.filename.trim() : undefined,
        attributionsrc: settings.attributionsrc.trim() || undefined,
        referrerPolicy: referrerPolicies.find((policy) => policy === referrerPolicy),
      },
    },
  };
}

/**
 * Generates a native link so the browser can handle navigation and external protocols.
 */
export function Anchorer() {
  const [persistedSettings, saveSettings] = useStorage(settingsStorage);
  const [draft, setDraft] = useState<SettingsDraft | null>(null);
  const settings =
    draft && draft.snapshot === persistedSettings
      ? draft.settings
      : restoreSettings(persistedSettings);
  const [destinationError, setDestinationError] = useState('');
  const [ignoreBaseUrl, setIgnoreBaseUrl] = useState(false);
  const [shareTooLarge, setShareTooLarge] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const prevSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (draft && draft.snapshot === persistedSettings) return;

    setDraft(null);
    setDestinationError('');
    setShareTooLarge(false);
    setCopied(false);
  }, [draft, persistedSettings]);

  const { link, error } = resolveGeneratedLink(settings);
  const placeholderNames = getPlaceholderNames(settings.href);
  const linkSignature = link ? JSON.stringify(link) : error;

  useEffect(() => {
    if (prevSignatureRef.current === null) {
      prevSignatureRef.current = linkSignature;
      return;
    }

    if (prevSignatureRef.current === linkSignature) {
      return;
    }

    prevSignatureRef.current = linkSignature;
    if (!linkSignature) {
      setJustUpdated(false);
      return;
    }

    setJustUpdated(true);
    const timer = window.setTimeout(() => {
      setJustUpdated(false);
    }, 1200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [linkSignature]);

  /** Updates settings state and mirrors changes into the browser URL. */
  function updateSettings(updater: (prev: AnchorerSettings) => AnchorerSettings): void {
    const next = updater(settings);
    setCopied(false);
    const stored = getStoredSettings(next);
    let accepted = false;
    try {
      accepted = stored ? saveSettings(stored) : settingsStorage.remove();
      setShareTooLarge(false);
    } catch (error) {
      if (!(error instanceof StorageCapacityError)) throw error;
      setShareTooLarge(true);
    }
    setDraft({ settings: next, snapshot: accepted ? settingsStorage.get() : persistedSettings });
  }

  /** Updates a single string field in settings. */
  function updateField(
    key: Exclude<keyof AnchorerSettings, 'download' | 'interpolation'>,
    value: string
  ): void {
    if (key === 'href') setDestinationError('');
    updateSettings((prev) => ({ ...prev, [key]: value }));
  }

  useSearchParams('href', ({ href }) => updateField('href', href), { deleteOnAction: false });

  /** Applies one layer of URL encoding or decoding to the destination. */
  function transformDestination(transform: (value: string) => string): void {
    let destination: string;
    try {
      destination = transform(settings.href);
    } catch (error) {
      if (!(error instanceof URIError)) throw error;
      setDestinationError('The destination contains invalid URL encoding or characters.');
      return;
    }
    updateField('href', destination);
  }

  /** Fills every interpolation field with a random string of four to eight digits. */
  function generateInterpolation(): void {
    const interpolation = new Map(settings.interpolation);
    for (const name of placeholderNames) {
      const length = 4 + Math.floor(Math.random() * 5);
      const digits = Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
      interpolation.set(name, digits);
    }
    updateSettings((prev) => ({ ...prev, interpolation }));
  }

  /** Copies the current settings URL to the clipboard. */
  function copySettingsUrl(): void {
    const shareUrl = settingsStorage.buildUrl(getStoredSettings(settings));
    if (shareUrl === undefined) return;
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
    });
  }

  return (
    <PageContainer paddingY="medium" width="slim">
      <VStack align="stretch" gap={5}>
        <VStack align="stretch" gap={2}>
          <Header level={1} size="m" type="headline">
            Anchorer
          </Header>
          <Text as="p" size="m" type="body">
            Turn a URL into a clickable link, including deep links that open an installed app.
          </Text>
        </VStack>
        <form
          className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          onSubmit={(event) => event.preventDefault()}
        >
          <Container as="section" border className="p-4 sm:p-6" rounded="lg">
            <VStack align="stretch" gap={2}>
              <div className="grid gap-1">
                <Text as="h2" bold type="title">
                  <label htmlFor="destination">Destination (href)</label>
                </Text>
                <textarea
                  required
                  id="destination"
                  aria-describedby={destinationError ? 'destination-error' : undefined}
                  autoCapitalize="none"
                  className={cn(fieldClass, 'resize-y')}
                  name="href"
                  rows={4}
                  spellCheck={false}
                  value={settings.href}
                  onChange={(event) => updateField('href', event.target.value)}
                />
              </div>
              <HStack align="center" gap={2} wrap="wrap">
                <Button
                  color="primary"
                  renderStartIcon={(className) => <Percent aria-hidden className={className} />}
                  rounded="md"
                  size="s"
                  type="button"
                  variant="solid"
                  onPress={() =>
                    transformDestination(ignoreBaseUrl ? encodeURIComponent : encodeDestination)
                  }
                >
                  Encode
                </Button>
                <Button
                  color="secondary"
                  renderStartIcon={(className) => <Braces aria-hidden className={className} />}
                  rounded="md"
                  size="s"
                  type="button"
                  variant="solid"
                  onPress={() =>
                    transformDestination(ignoreBaseUrl ? decodeURIComponent : decodeURI)
                  }
                >
                  Decode
                </Button>
                <Switch
                  className="ml-auto flex-row-reverse gap-1.5"
                  isSelected={ignoreBaseUrl}
                  size="m"
                  onChange={setIgnoreBaseUrl}
                >
                  <Text size="l" type="label">
                    Ignore Base URL
                  </Text>
                </Switch>
              </HStack>
              {destinationError && (
                <p id="destination-error" role="alert">
                  {destinationError}
                </p>
              )}
            </VStack>
          </Container>
          <Container
            border
            className={cn(
              'flex flex-col p-4 transition-shadow duration-300 sm:p-6',
              justUpdated && 'ring-2 ring-[var(--rb-ring)]'
            )}
            rounded="lg"
          >
            <VStack align="stretch" className="grow" gap={3}>
              <HStack align="center" gap={2} justify="between">
                <Text as="h2" bold type="title">
                  Generated link
                </Text>
                {justUpdated && (
                  <Text className="text-[var(--rb-ring)]" size="s" type="label">
                    Updated
                  </Text>
                )}
              </HStack>
              <div aria-live="polite">
                {!error && !link && <Text as="p">Your link will appear here.</Text>}
                {error && <Text as="p">{error}</Text>}
                {link && (
                  <a
                    {...link.attributes}
                    className="break-all text-[var(--rb-ring)] underline underline-offset-4"
                  >
                    {link.text}
                  </a>
                )}
              </div>
              {shareTooLarge && (
                <Text as="p" role="status">
                  Settings exceed the 8 KiB share limit. Shorten the destination or other fields to
                  share them.
                </Text>
              )}
              <HStack className="mt-auto pt-2" gap={4} wrap="wrap">
                <Button
                  color="secondary"
                  isDisabled={shareTooLarge}
                  size="s"
                  type="button"
                  variant="outline"
                  onPress={copySettingsUrl}
                >
                  {copied ? 'Copied URL' : 'Copy settings URL'}
                </Button>
                {link && (
                  <Button
                    color="tertiary"
                    href={`/qriosity?${new URLSearchParams({ href: link.destination })}`}
                    size="s"
                    variant="ghost"
                  >
                    Generate QR code
                  </Button>
                )}
              </HStack>
            </VStack>
          </Container>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-2">
            <Container as="section" border className="@container p-4 sm:p-6" rounded="lg">
              <VStack align="stretch" gap={4}>
                <Text as="h2" bold className="flex min-h-8 items-center" type="title">
                  Parameters
                </Text>
                <label className="grid gap-1">
                  <Text type="label">Link text</Text>
                  <input
                    className={fieldClass}
                    name="text"
                    placeholder="Uses the generated URL"
                    value={settings.text}
                    onChange={(event) => updateField('text', event.target.value)}
                  />
                </label>
                <div className="grid gap-4 @sm:grid-cols-2">
                  {optionalFields.map(({ name, placeholder }) => (
                    <label key={name} className="grid gap-1">
                      <Text type="label">{name}</Text>
                      <input
                        className={fieldClass}
                        name={name}
                        placeholder={placeholder}
                        value={settings[name]}
                        onChange={(event) => updateField(name, event.target.value)}
                      />
                    </label>
                  ))}
                  <div className="grid grid-cols-1 items-center gap-x-4 gap-y-1 @sm:col-span-2 @sm:grid-cols-2">
                    <Text as="label" htmlFor="referrer-policy" type="label">
                      referrerpolicy
                    </Text>
                    <select
                      id="referrer-policy"
                      className={cn(fieldClass, '@sm:col-start-1 @sm:row-start-2')}
                      name="referrerpolicy"
                      value={settings.referrerpolicy}
                      onChange={(event) => updateField('referrerpolicy', event.target.value)}
                    >
                      <option value="">Browser default</option>
                      {referrerPolicies.map((policy) => (
                        <option key={policy} value={policy}>
                          {policy}
                        </option>
                      ))}
                    </select>
                    <Text
                      as="label"
                      className="mt-3 @sm:col-start-2 @sm:row-start-1 @sm:mt-0"
                      htmlFor="download-attribute"
                      id="download-attribute-label"
                      type="label"
                    >
                      download
                    </Text>
                    <Switch
                      aria-labelledby="download-attribute-label"
                      className="@sm:col-start-2 @sm:row-start-2"
                      id="download-attribute"
                      isSelected={settings.download}
                      onChange={(next) => {
                        updateSettings((prev) => ({ ...prev, download: next }));
                      }}
                    />
                  </div>
                  {settings.download && (
                    <label className="grid gap-1 @sm:col-span-2">
                      <Text type="label">Download filename</Text>
                      <input
                        className={fieldClass}
                        name="filename"
                        placeholder="Optional"
                        value={settings.filename}
                        onChange={(event) => updateField('filename', event.target.value)}
                      />
                    </label>
                  )}
                </div>
              </VStack>
            </Container>
            <Container as="section" border className="@container p-4 sm:p-6" rounded="lg">
              <VStack align="stretch" gap={4}>
                <HStack align="center" className="min-h-8" gap={2} justify="between">
                  <Text as="h2" bold type="title">
                    Interpolation
                  </Text>
                  {placeholderNames.length > 0 && (
                    <Button size="s" type="button" variant="ghost" onPress={generateInterpolation}>
                      Generate
                    </Button>
                  )}
                </HStack>
                {placeholderNames.length > 0 ? (
                  <div className="grid grid-cols-1 items-end gap-3 @xs:grid-cols-2">
                    {placeholderNames.map((name) => (
                      <label key={name} className="grid min-w-0 gap-1">
                        <Text className="break-all" type="label">
                          {name}
                        </Text>
                        <input
                          className={fieldClass}
                          value={settings.interpolation.get(name) ?? ''}
                          onChange={(event) => {
                            const interpolation = new Map(settings.interpolation);
                            const value = event.target.value;
                            if (value) {
                              interpolation.set(name, value);
                            } else {
                              interpolation.delete(name);
                            }
                            updateSettings((prev) => ({ ...prev, interpolation }));
                          }}
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <Text as="p">
                    Add a <Code>{'{placeholder}'}</Code> to the destination to set its value here.
                  </Text>
                )}
              </VStack>
            </Container>
          </div>
        </form>
      </VStack>
    </PageContainer>
  );
}
