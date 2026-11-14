import { PageContainer } from '@ermnvldmr/kits';
import { Button, Container, Header, Switch, Text, VStack } from '@ermnvldmr/ui';
import { useState } from 'react';

import type { AnchorHTMLAttributes, FormEvent } from 'react';

const fieldClass =
  'w-full rounded-md border border-outline bg-[color-mix(in_srgb,var(--rb-container-base),var(--rb-ring)_10%)] px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-[var(--rb-ring)]';

const optionalFields = [
  { name: 'target', placeholder: '_self, _blank, or a frame name', defaultValue: '_self' },
  { name: 'rel', placeholder: 'noopener noreferrer', defaultValue: 'noopener' },
  { name: 'hreflang', placeholder: 'en' },
  { name: 'type', placeholder: 'text/html' },
  { name: 'ping', placeholder: 'Space-separated URLs' },
  { name: 'attributionsrc', placeholder: 'Space-separated URLs' },
];

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

/** The submitted text and attributes of the generated anchor. */
interface GeneratedLink {
  text: string;
  attributes: AnchorHTMLAttributes<HTMLAnchorElement> & { attributionsrc?: string };
}

/** Reads an optional text input from the submitted form. */
function readField(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Generates a native link so the browser can handle navigation and external protocols.
 */
export function Anchorer() {
  const [link, setLink] = useState<GeneratedLink | null>(null);
  const [error, setError] = useState('');
  const [download, setDownload] = useState(false);

  /** Snapshots the form so edits do not change the link until the next submit. */
  function generate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const href = readField(form, 'href');
    const referrerPolicy = readField(form, 'referrerpolicy');
    const isNavigable =
      URL.canParse(href, window.location.href) &&
      !['javascript:', 'vbscript:'].includes(new URL(href, window.location.href).protocol);

    if (!href || !isNavigable) {
      setLink(null);
      setError('Enter a valid URL with a navigable scheme.');
      return;
    }

    const attributes = {
      href,
      target: readField(form, 'target') || undefined,
      rel: readField(form, 'rel') || undefined,
      hrefLang: readField(form, 'hreflang') || undefined,
      type: readField(form, 'type') || undefined,
      ping: readField(form, 'ping') || undefined,
      download: download ? readField(form, 'filename') : undefined,
      attributionsrc: readField(form, 'attributionsrc') || undefined,
      referrerPolicy: referrerPolicies.find((policy) => policy === referrerPolicy),
    };

    setError('');
    setLink({ text: readField(form, 'text') || href, attributes });
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
            <form onSubmit={generate}>
              <VStack align="stretch" gap={4}>
                <label className="grid gap-1">
                  <Text type="label">Destination (href)</Text>
                  <input
                    required
                    autoCapitalize="none"
                    className={fieldClass}
                    name="href"
                    spellCheck={false}
                  />
                </label>
                <label className="grid gap-1">
                  <Text type="label">Link text</Text>
                  <input className={fieldClass} defaultValue="Open link" name="text" />
                </label>
                <details>
                  <summary className="cursor-pointer rounded-md border border-outline px-3 py-2">
                    <Text type="label">Anchor attributes</Text>
                  </summary>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {optionalFields.map(({ name, placeholder, defaultValue }) => (
                      <label key={name} className="grid gap-1">
                        <Text type="label">{name}</Text>
                        <input
                          className={fieldClass}
                          defaultValue={defaultValue}
                          name={name}
                          placeholder={placeholder}
                        />
                      </label>
                    ))}
                    <label className="grid gap-1">
                      <Text type="label">referrerpolicy</Text>
                      <select className={fieldClass} name="referrerpolicy">
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
                        isSelected={download}
                        onChange={setDownload}
                      >
                        <Text color="default" type="label">
                          Set download attribute
                        </Text>
                      </Switch>
                      {download && (
                        <label className="grid gap-1">
                          <Text type="label">Download filename</Text>
                          <input className={fieldClass} name="filename" placeholder="Optional" />
                        </label>
                      )}
                    </div>
                  </div>
                </details>
                <div className="self-start">
                  <Button type="submit">Generate link</Button>
                </div>
              </VStack>
            </form>
          </Container>
          <Container border className="p-4 sm:p-6" rounded="lg">
            <VStack align="stretch" gap={3}>
              <Text as="h2" bold type="title">
                Generated link
              </Text>
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
