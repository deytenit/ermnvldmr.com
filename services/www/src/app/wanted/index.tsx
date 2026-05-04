import { localePath } from '@ermnvldmr/i18n';
import { BentoGrid, Header, Paragraph, VStack } from '@ermnvldmr/ui';
import { Ghost, Coffee, Plane, Check, Gift, Cuboid, BoxSelect, Cpu } from 'lucide-react';

import { t } from './index.i18n';
import { DefaultLayout } from '../../components/Layout/DefaultLayout';
import { createPage } from '../../lib/core/createPage';

/**
 * Wanted page component.
 * Serves as an Acquisition Map—a roadmap of things planned to buy.
 *
 * @example
 * ```tsx
 * createPage(WantedPage, { title: t('Wanted'), description: t('An Acquisition Map—a roadmap of things I plan to buy myself anyway. It serves as a personal log and a guide for friends without creating social pressure or obligation.') });
 * ```
 */
function WantedPage() {
  return (
    <DefaultLayout
      currentPath={localePath('/wanted')}
      description={t(
        'An Acquisition Map—a roadmap of things I plan to buy myself anyway. It serves as a personal log and a guide for friends without creating social pressure or obligation.'
      )}
      title={t('Wanted')}
    >
      <VStack gap={16}>
        <VStack gap={8}>
          <Header level={3}>{t('The Ground Rules')}</Header>
          <VStack gap={4}>
            <Paragraph size="m">
              <strong>{t('The Intent:')}</strong>{' '}
              {t(
                'These are items I plan to acquire myself. If you feel like contributing, I’ll be thrilled, but it is never expected.'
              )}
            </Paragraph>
            <Paragraph size="m">
              <strong>{t('The Standard:')}</strong>{' '}
              {t('Quality and authenticity are paramount. I prefer "nothing" over a knock-off.')}
            </Paragraph>
            <Paragraph size="m">
              <strong>{t('The Dialogue:')}</strong> {t('When in doubt, let’s talk first.')}
            </Paragraph>
          </VStack>
        </VStack>

        <BentoGrid>
          {/* Collectables - Figurines */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t(
              "Edition and authenticity matter immensely. Better be informed on the matter, if you don't want to miss."
            )}
            icon={<Ghost size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t('NENDOROID 1970 Jill Stingray (VA-11 Hall-A)'),
                  t('Mirror’s Edge Catalyst (Collector’s Edition)'),
                  t("Deus Ex: Mankind Divided (Collector's Edition)"),
                ],
              },
            ]}
            title={t('Figurines')}
          />

          {/* Collectables - LEGO */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t(
              'I focus on display pieces and engineering. Preferred: Architecture, Technic, Icons (NASA/Star Wars), Botanicals. Avoid: "Play-set" themes.'
            )}
            icon={<Cuboid size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t('Any Architectural Landmark'),
                  t('NASA/Space Exploration sets'),
                  t('High-fidelity Technic vehicles'),
                ],
              },
              {
                value: 'owned',
                label: t('Already Owned'),
                labelIcon: <Check size={18} />,
                items: [t('Japanese Red Maple Bonsai (10348)'), t('The Pig House (21170)')],
              },
            ]}
            title={t('LEGO Sets')}
          />

          {/* Collectables - Die-cast */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t(
              'I love LEGO and pre-assembled die-cast models. I will NEVER assemble plastic glue/paint kits. Please do not buy them.'
            )}
            icon={<Plane size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t('Space (LEGO Saturn V, SpaceX/NASA scale replicas)'),
                  t('Motorsport (Modern F1 team cars, GT3, Endurance Legends)'),
                  t('Aviation (SR-71 Blackbird, Concorde)'),
                  t('Architecture sets and Icons'),
                ],
              },
            ]}
            title={t('Die-cast Models')}
          />

          {/* Coffee stuff */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t(
              'My espresso machine uses a 51mm portafilter basket. Any espresso tools MUST be exactly 51mm.'
            )}
            icon={<Coffee size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t('AeroPress'),
                  t('Dedicated Cold Brewer (Hario/Toddy)'),
                  t('51mm WDT Tool'),
                  t('Freshly roasted specialty beans'),
                ],
              },
              {
                value: 'owned',
                label: t('Already Owned'),
                labelIcon: <Check size={18} />,
                items: [
                  t('Espresso Machine'),
                  t('Hario V60'),
                  t('Manual Hand Grinder'),
                  t('French Press'),
                ],
              },
            ]}
            title={t('Coffee stuff')}
          />

          {/* Hobby */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t('Tools for electronics and other hobbies.')}
            icon={<Cpu size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t(
                    'Alientek T90 Soldering Iron (Compact, smart iron for precise electronics work)'
                  ),
                ],
              },
            ]}
            title={t('Hobby')}
          />

          {/* Other stuff */}
          <BentoGrid.ListCard
            colSpan={2}
            defaultValue={['wanted']}
            description={t('Various other things I am looking for.')}
            icon={<BoxSelect size={24} />}
            sections={[
              {
                value: 'wanted',
                label: t('Seeking'),
                labelIcon: <Gift size={18} />,
                items: [
                  t('TimePiece® Calendar 3D (Architectural 3D tear-off calendar)'),
                  t('Seiko SSC813 Prospex (Primary goal)'),
                  t('Tag Heuer Carrera Chronograph (Long-term dream)'),
                  t('Cast Iron Cube 10x10x10cm (Purely for tactile density)'),
                ],
              },
            ]}
            title={t('Other stuff')}
          />
        </BentoGrid>
      </VStack>
    </DefaultLayout>
  );
}

createPage(WantedPage, {
  title: t('Wanted'),
  description: t(
    'An Acquisition Map—a roadmap of things I plan to buy myself anyway. It serves as a personal log and a guide for friends without creating social pressure or obligation.'
  ),
});
export default WantedPage;
