import { PageContainer } from '@ermnvldmr/kits';
import { cn, useSearchParams } from '@ermnvldmr/stl';
import { Button, Container, Header, HStack, Image, Text, VStack } from '@ermnvldmr/ui';
import { toDataURL, toString } from 'qrcode';
import { useEffect, useState } from 'react';

const baseSize = 256;
const scales = [1, 2, 3, 4];
const rasterFormats = ['png', 'jpeg', 'webp'] as const;
const fieldClass =
  'rounded-md border border-outline bg-[color-mix(in_srgb,var(--rb-container-base),var(--rb-ring)_10%)] px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-[var(--rb-ring)]';

/** Generates a QR code for a destination and exports it in the browser. */
export function QRiosity() {
  const [href, setHref] = useState('');
  const [scale, setScale] = useState(1);
  const [preview, setPreview] = useState({ destination: '', src: '' });
  const [downloadError, setDownloadError] = useState('');
  const destination = href.trim();
  const size = baseSize * scale;
  const currentPreview = preview.destination === destination ? preview : null;

  useSearchParams('href', (params) => setHref(params.href), { deleteOnAction: false });

  useEffect(() => {
    if (!destination) return;

    let active = true;
    void toString(destination, { type: 'svg' }).then(
      (svg) => {
        if (active) {
          setPreview({ destination, src: `data:image/svg+xml,${encodeURIComponent(svg)}` });
        }
      },
      () => {
        if (active) setPreview({ destination, src: '' });
      }
    );
    return () => {
      active = false;
    };
  }, [destination]);

  /** Downloads the current code with the selected raster dimensions. */
  async function download(format: 'svg' | (typeof rasterFormats)[number]): Promise<void> {
    if (!currentPreview?.src) return;

    setDownloadError('');
    try {
      // qrcode floors the result after converting the width to a module scale and back.
      const width = size + size * Number.EPSILON;
      const src =
        format === 'svg'
          ? currentPreview.src
          : await toDataURL(destination, { type: `image/${format}`, width });
      if (format !== 'svg' && !src.startsWith(`data:image/${format};`)) {
        setDownloadError(`${format.toUpperCase()} export is unavailable in this browser.`);
        return;
      }

      const link = document.createElement('a');
      link.href = src;
      link.download = `qriosity${format === 'svg' ? '' : `-${scale}x`}.${format}`;
      link.click();
    } catch {
      setDownloadError('Could not export the QR code. Try again.');
    }
  }

  return (
    <PageContainer paddingY="medium" width="slim">
      <VStack align="stretch" gap={5}>
        <VStack align="stretch" gap={2}>
          <Header level={1} size="m" type="headline">
            QRiosity
          </Header>
          <Text as="p" size="m" type="body">
            Create a scannable QR code.
          </Text>
        </VStack>
        <Container
          bg="transparent"
          className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
        >
          <Container as="section" border className="p-4 sm:p-6" rounded="lg">
            <VStack align="stretch" gap={2}>
              <Text as="label" bold htmlFor="qr-href" type="title">
                Destination (href) or any text
              </Text>
              <Text
                as="textarea"
                autoCapitalize="none"
                className={cn(fieldClass, 'w-full resize-y')}
                id="qr-href"
                inputMode="url"
                name="href"
                placeholder="https://example.com"
                rows={4}
                spellCheck={false}
                value={href}
                onChange={(event) => {
                  if (event.currentTarget instanceof HTMLTextAreaElement) {
                    setHref(event.currentTarget.value);
                    setDownloadError('');
                  }
                }}
              >
                {null}
              </Text>
              <Button
                className="self-end"
                color="tertiary"
                href={
                  destination
                    ? `/anchorer?${new URLSearchParams({ href: destination })}`
                    : '/anchorer'
                }
                size="s"
                variant="ghost"
              >
                Open in Anchorer
              </Button>
              <Container as="section" border className="mt-2" padding={3} rounded="md">
                <VStack align="stretch" gap={3}>
                  <Text as="h2" bold type="title">
                    Download
                  </Text>
                  <VStack align="stretch" as="section" gap={2}>
                    <Text as="h3" bold type="label">
                      Vector
                    </Text>
                    <Button
                      color="primary"
                      isDisabled={!currentPreview?.src}
                      size="l"
                      variant="solid"
                      onPress={() => void download('svg')}
                    >
                      SVG
                    </Button>
                  </VStack>
                  <VStack align="stretch" as="section" gap={2}>
                    <Text as="h3" bold type="label">
                      Raster
                    </Text>
                    <HStack align="center" gap={3} wrap="wrap">
                      <Text as="label" htmlFor="qr-scale" type="label">
                        Size
                      </Text>
                      <Text
                        as="select"
                        className={cn(fieldClass, 'min-w-0 flex-1')}
                        id="qr-scale"
                        disabled={!currentPreview?.src}
                        value={scale}
                        onChange={(event) => {
                          if (event.currentTarget instanceof HTMLSelectElement) {
                            setScale(Number(event.currentTarget.value));
                            setDownloadError('');
                          }
                        }}
                      >
                        {scales.map((factor) => (
                          <Text as="option" key={factor} value={factor}>
                            {factor}× ({baseSize * factor} px)
                          </Text>
                        ))}
                      </Text>
                    </HStack>
                    <HStack gap={2} wrap="wrap">
                      {rasterFormats.map((format) => (
                        <Button
                          key={format}
                          className="flex-1"
                          color="secondary"
                          isDisabled={!currentPreview?.src}
                          size="s"
                          variant="outline"
                          onPress={() => void download(format)}
                        >
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </HStack>
                  </VStack>
                  {downloadError && <Text role="alert">{downloadError}</Text>}
                </VStack>
              </Container>
            </VStack>
          </Container>
          <Container as="section" border className="p-4 sm:p-6" rounded="lg">
            <VStack align="stretch" className="h-full" gap={2}>
              <Text as="h2" bold type="title">
                QR code
              </Text>
              {currentPreview?.src ? (
                <Image
                  alt="QR code for the destination"
                  className="my-auto"
                  ratio={1}
                  src={currentPreview.src}
                  width="100%"
                />
              ) : (
                <Text aria-live="polite" as="p">
                  {!destination && 'Your QR code will appear here.'}
                  {destination && !currentPreview && 'Generating QR code…'}
                  {destination &&
                    currentPreview &&
                    'Could not generate a QR code. Try a shorter destination.'}
                </Text>
              )}
            </VStack>
          </Container>
        </Container>
      </VStack>
    </PageContainer>
  );
}
