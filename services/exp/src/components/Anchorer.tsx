import { PageContainer } from '@ermnvldmr/kits';
import { cn, useSearchParams } from '@ermnvldmr/stl';
import { Button, Container, HStack, Header, Switch, Text, VStack } from '@ermnvldmr/ui';
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

const anchorerParamKeys = [
  'href',
  'text',
  'target',
  'rel',
  'hreflang',
  'type',
  'ping',
  'attributionsrc',
  'referrerpolicy',
  'download',
  'filename',
] as const;

/** URL search parameter keys synced with the Anchorer form. */
type AnchorerParamKey = (typeof anchorerParamKeys)[number];

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

/** Form settings for generating an anchor link, mirrored to URL search parameters. */
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
}

/** The submitted text and attributes of the generated anchor. */
interface GeneratedLink {
  text: string;
  attributes: AnchorHTMLAttributes<HTMLAnchorElement> & { attributionsrc?: string };
}

const defaultSettings: AnchorerSettings = {
  href: '',
  text: 'Open link',
  target: '_self',
  rel: 'noopener',
  hreflang: '',
  type: '',
  ping: '',
  attributionsrc: '',
  referrerpolicy: '',
  download: false,
  filename: '',
};

/** Parses URL search parameters into {@link AnchorerSettings} with defaults. */
function parseSettingsFromParams(
  entries: Partial<Record<AnchorerParamKey, string>>
): AnchorerSettings {
  return {
    href: entries.href ?? defaultSettings.href,
    text: entries.text ?? defaultSettings.text,
    target: entries.target ?? defaultSettings.target,
    rel: entries.rel ?? defaultSettings.rel,
    hreflang: entries.hreflang ?? defaultSettings.hreflang,
    type: entries.type ?? defaultSettings.type,
    ping: entries.ping ?? defaultSettings.ping,
    attributionsrc: entries.attributionsrc ?? defaultSettings.attributionsrc,
    referrerpolicy: entries.referrerpolicy ?? defaultSettings.referrerpolicy,
    download: entries.download === '1' || entries.download === 'true',
    filename: entries.filename ?? defaultSettings.filename,
  };
}

/** Builds a relative URL reflecting the given settings while preserving unrelated search params. */
function buildSettingsPath(settings: AnchorerSettings): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const searchParams = new URLSearchParams(window.location.search);
  for (const key of anchorerParamKeys) {
    searchParams.delete(key);
  }

  if (settings.href) {
    searchParams.set('href', settings.href);
  }
  if (settings.text !== defaultSettings.text) {
    searchParams.set('text', settings.text);
  }
  if (settings.target !== defaultSettings.target) {
    searchParams.set('target', settings.target);
  }
  if (settings.rel !== defaultSettings.rel) {
    searchParams.set('rel', settings.rel);
  }
  if (settings.hreflang) {
    searchParams.set('hreflang', settings.hreflang);
  }
  if (settings.type) {
    searchParams.set('type', settings.type);
  }
  if (settings.ping) {
    searchParams.set('ping', settings.ping);
  }
  if (settings.attributionsrc) {
    searchParams.set('attributionsrc', settings.attributionsrc);
  }
  if (settings.referrerpolicy) {
    searchParams.set('referrerpolicy', settings.referrerpolicy);
  }
  if (settings.download) {
    searchParams.set('download', '1');
    if (settings.filename) {
      searchParams.set('filename', settings.filename);
    }
  }

  const query = searchParams.toString();
  return `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
}

/** Returns whether any optional anchor attribute differs from its default. */
function hasCustomOptionalSettings(settings: AnchorerSettings): boolean {
  return (
    settings.target !== defaultSettings.target ||
    settings.rel !== defaultSettings.rel ||
    Boolean(settings.hreflang) ||
    Boolean(settings.type) ||
    Boolean(settings.ping) ||
    Boolean(settings.attributionsrc) ||
    Boolean(settings.referrerpolicy) ||
    settings.download ||
    Boolean(settings.filename)
  );
}

/** Derives the preview link or validation message from current settings. */
function resolveGeneratedLink(settings: AnchorerSettings): {
  link: GeneratedLink | null;
  error: string;
} {
  const href = settings.href.trim();
  if (!href) {
    return { link: null, error: '' };
  }

  const referrerPolicy = settings.referrerpolicy.trim();
  const baseUrl = typeof window === 'undefined' ? 'https://localhost' : window.location.href;
  const isNavigable =
    URL.canParse(href, baseUrl) &&
    !['javascript:', 'vbscript:'].includes(new URL(href, baseUrl).protocol);

  if (!isNavigable) {
    return { link: null, error: 'Enter a valid URL with a navigable scheme.' };
  }

  return {
    error: '',
    link: {
      text: settings.text.trim() || href,
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
  const [settings, setSettings] = useState<AnchorerSettings>(defaultSettings);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const prevSignatureRef = useRef<string | null>(null);

  useSearchParams(
    anchorerParamKeys,
    (entries) => {
      const next = parseSettingsFromParams(entries);
      setSettings(next);
      if (hasCustomOptionalSettings(next)) {
        setDetailsOpen(true);
      }
    },
    { deleteOnAction: false, strictMatch: false }
  );

  const { link, error } = resolveGeneratedLink(settings);
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
    setCopied(false);
    setSettings((prev) => {
      const next = updater(prev);
      const nextPath = buildSettingsPath(next);
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextPath && nextPath !== currentPath) {
        window.history.replaceState(window.history.state, '', nextPath);
      }
      return next;
    });
  }

  /** Updates a single string field in settings. */
  function updateField(
    key: Exclude<keyof AnchorerSettings, 'download'>,
    value: string
  ): void {
    updateSettings((prev) => ({ ...prev, [key]: value }));
  }

  /** Copies the current settings URL to the clipboard. */
  function copySettingsUrl(): void {
    const nextPath = buildSettingsPath(settings);
    const shareUrl = `${window.location.origin}${nextPath}`;
    window.history.replaceState(window.history.state, '', nextPath);
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
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Container border className="p-4 sm:p-6" rounded="lg">
            <form onSubmit={(event) => event.preventDefault()}>
              <VStack align="stretch" gap={4}>
                <label className="grid gap-1">
                  <Text type="label">Destination (href)</Text>
                  <input
                    required
                    autoCapitalize="none"
                    className={fieldClass}
                    name="href"
                    spellCheck={false}
                    value={settings.href}
                    onChange={(event) => updateField('href', event.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <Text type="label">Link text</Text>
                  <input
                    className={fieldClass}
                    name="text"
                    value={settings.text}
                    onChange={(event) => updateField('text', event.target.value)}
                  />
                </label>
                <details
                  open={detailsOpen}
                  onToggle={(event) => setDetailsOpen(event.currentTarget.open)}
                >
                  <summary className="cursor-pointer rounded-md border border-outline px-3 py-2">
                    <Text type="label">Anchor attributes</Text>
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                    <label className="grid gap-1">
                      <Text type="label">referrerpolicy</Text>
                      <select
                        className={fieldClass}
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
                    </label>
                    <div className="grid gap-3 sm:col-span-2">
                      <Switch
                        aria-label="Set download attribute"
                        isSelected={settings.download}
                        onChange={(next) => {
                          updateSettings((prev) => ({ ...prev, download: next }));
                        }}
                      >
                        <Text color="default" type="label">
                          Set download attribute
                        </Text>
                      </Switch>
                      {settings.download && (
                        <label className="grid gap-1">
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
                  </div>
                </details>
                <div className="self-start">
                  <Button
                    color="secondary"
                    type="button"
                    variant="ghost"
                    onPress={copySettingsUrl}
                  >
                    {copied ? 'Copied URL' : 'Copy settings URL'}
                  </Button>
                </div>
              </VStack>
            </form>
          </Container>
          <Container
            border
            className={cn(
              'p-4 transition-shadow duration-300 sm:p-6',
              justUpdated && 'ring-2 ring-[var(--rb-ring)]'
            )}
            rounded="lg"
          >
            <VStack align="stretch" gap={3}>
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
            </VStack>
          </Container>
        </div>
      </VStack>
    </PageContainer>
  );
}
