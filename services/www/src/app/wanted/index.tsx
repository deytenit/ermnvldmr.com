import { localePath } from '@ermnvldmr/i18n';
import { BentoGrid, InfoCard } from '@ermnvldmr/kits';
import { createPage } from '@ermnvldmr/ssg';
import { Breadcrumbs, Header, Paragraph, VStack } from '@ermnvldmr/ui';
import { BoxSelect, Check, Coffee, Cpu, Cuboid, Gift, Ghost, Plane } from 'lucide-react';
import React from 'react';

import { t } from './index.i18n';
import { DefaultLayout } from '../../components/Layout/DefaultLayout';

/**
 * Wanted page component.
 * Serves as a personal log of things to acquire.
 *
 * @example
 * ```tsx
 * createPage(WantedPage, { title: t('Wanted'), description: t('A quiet log of things I am planning to pick up eventually. It serves mostly as a personal reference, but also as a zero-pressure guide for friends.') });
 * ```
 */
function WantedPage(): React.JSX.Element {
  const breadcrumbs = (
    <Breadcrumbs>
      <Breadcrumbs.Item href={localePath('/')}>{t('Home')}</Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item isCurrent>{t('Wanted')}</Breadcrumbs.Item>
    </Breadcrumbs>
  );

  return (
    <DefaultLayout
      breadcrumbs={breadcrumbs}
      currentPath={localePath('/wanted')}
      description={t(
        'A quiet log of things I am planning to pick up eventually. It serves mostly as a personal reference, but also as a zero-pressure guide for friends.'
      )}
      title={t('Wanted')}
    >
      <VStack gap={8}>
        <VStack gap={4}>
          <Header level={3}>{t('How this works')}</Header>
          <VStack gap={4}>
            <Paragraph size="m">
              {t(
                'Think of this as a living list of things I plan to acquire over time. If you ever feel inspired to contribute, I would be genuinely thrilled, but please know it is never expected.'
              )}
            </Paragraph>
            <Paragraph size="m">
              {t(
                'When it comes to the items themselves, authenticity and quality matter a lot to me. I would always prefer to have nothing at all rather than a replica or a knock-off.'
              )}
            </Paragraph>
            <Paragraph size="m">
              {t(
                'And of course, if you are ever unsure about a specific edition or detail, we can always just talk about it.'
              )}
            </Paragraph>
          </VStack>
        </VStack>

        <BentoGrid>
          {/* Collectibles - Figurines */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<Ghost size={24} />}>{t('Figurines')}</InfoCard.Header>
            <InfoCard.Body>
              {t(
                'The specifics of the edition and its authenticity are quite important here. It is usually best to know the exact details to get it right.'
              )}
            </InfoCard.Body>
            <InfoCard.List
              defaultValue={['wanted']}
              sections={[
                {
                  value: 'wanted',
                  label: t('Looking for'),
                  labelIcon: <Gift size={18} />,
                  items: [
                    t('NENDOROID 1970 Jill Stingray (VA-11 Hall-A)'),
                    t('Mirror’s Edge Catalyst (Collector’s Edition)'),
                    t("Deus Ex: Mankind Divided (Collector's Edition)"),
                  ],
                },
                {
                  value: 'owned',
                  label: t('Already Owned'),
                  labelIcon: <Check size={18} />,
                  items: [
                    t('Genshin Impact Pop! Aether (#160)'),
                    t('Taito - Lycoris Recoil Desktop Cute Figure - Takina Inoue (Roomwear Ver.)'),
                    t(
                      'Taito - Lycoris Recoil Aqua Desktop Cute Figure - Chisato Nishikigi (Roomwear Ver.)'
                    ),
                  ],
                },
              ]}
            />
          </InfoCard>

          {/* Collectibles - LEGO */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<Cuboid size={24} />}>{t('LEGO Sets')}</InfoCard.Header>
            <InfoCard.Body>
              {t(
                'I appreciate sets that focus on engineering and make for good display pieces, like Architecture, Technic, or the Botanical collection. I generally lean away from traditional play-sets.'
              )}
            </InfoCard.Body>
            <InfoCard.List
              defaultValue={['wanted']}
              sections={[
                {
                  value: 'wanted',
                  label: t('Looking for'),
                  labelIcon: <Gift size={18} />,
                  items: [
                    t('Architectural landmarks or skylines'),
                    t('NASA and space exploration sets (like the #92176 Ideas NASA Apollo Saturn V)'),
                    t('High-fidelity Technic vehicles'),
                  ],
                },
                {
                  value: 'owned',
                  label: t('Already Owned'),
                  labelIcon: <Check size={18} />,
                  items: [
                    t('Japanese Red Maple Bonsai (10348)'),
                    t('The Pig House (21170)'),
                    t('NASA Artemis Space Launch System (10341)'),
                    t('Himeji Castle (21060)'),
                  ],
                },
              ]}
            />
          </InfoCard>

          {/* Collectibles - Die-cast */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<Plane size={24} />}>{t('Die-cast Models')}</InfoCard.Header>
            <InfoCard.Body>
              {t(
                'I enjoy high-quality pre-assembled die-cast models. I am not much into plastic kits that require glue or paint to assemble.'
              )}
            </InfoCard.Body>
            <InfoCard.List
              defaultValue={['wanted']}
              sections={[
                {
                  value: 'wanted',
                  label: t('Looking for'),
                  labelIcon: <Gift size={18} />,
                  items: [
                    t('Spacecraft scale replicas (SpaceX, NASA)'),
                    t('Motorsport cars (Modern F1, GT3, Endurance Legends)'),
                    t('Aviation models (SR-71 Blackbird, Concorde)'),
                  ],
                },
                {
                  value: 'owned',
                  label: t('Already Owned'),
                  labelIcon: <Check size={18} />,
                  items: [t('Bburago – McLaren F1 MCL39 2025 #4 Norris')],
                },
              ]}
            />
          </InfoCard>

          {/* Coffee stuff */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<Coffee size={24} />}>{t('Coffee gear')}</InfoCard.Header>
            <InfoCard.Body>
              {t(
                'My current espresso setup uses a 51mm portafilter, so any accessories for it need to match that size perfectly.'
              )}
            </InfoCard.Body>
            <InfoCard.List
              defaultValue={['wanted']}
              sections={[
                {
                  value: 'wanted',
                  label: t('Looking for'),
                  labelIcon: <Gift size={18} />,
                  items: [
                    t('AeroPress'),
                    t('Dedicated cold brewer (Hario or Toddy)'),
                    t('51mm WDT Tool'),
                    t('Freshly roasted specialty coffee beans'),
                  ],
                },
                {
                  value: 'owned',
                  label: t('Already Owned'),
                  labelIcon: <Check size={18} />,
                  items: [
                    t("De'longhi Dedica Arte EC885"),
                    t('Kingrinder K6'),
                    t('Timemore Black Mirror Basic 2'),
                    t('Hario V60'),
                    t('French Press'),
                  ],
                },
              ]}
            />
          </InfoCard>

          {/* Hobby */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<Cpu size={24} />}>{t('Hobby')}</InfoCard.Header>
            <InfoCard.Body>
              {t('Various tools and equipment for electronics and other side projects.')}
            </InfoCard.Body>
            <InfoCard.List
              defaultValue={['owned']}
              sections={[
                {
                  value: 'owned',
                  label: t('Already Owned'),
                  labelIcon: <Check size={18} />,
                  items: [t('Alientek T90B Soldering Iron')],
                },
              ]}
            />
          </InfoCard>

          {/* Other stuff */}
          <InfoCard bg="transparent" colSpan={2}>
            <InfoCard.Header icon={<BoxSelect size={24} />}>{t('Other items')}</InfoCard.Header>
            <InfoCard.Body>{t('A few standalone pieces that caught my eye.')}</InfoCard.Body>
            <InfoCard.List
              defaultValue={['wanted']}
              sections={[
                {
                  value: 'wanted',
                  label: t('Looking for'),
                  labelIcon: <Gift size={18} />,
                  items: [
                    t('TimePiece® 3D tear-off calendar'),
                    t('Seiko SSC813 Prospex watch'),
                    t('Tag Heuer Carrera watch'),
                    t('Cast Iron Cube 10x10x10cm (just for the tactile density)'),
                    t('Good kitchen utensils (knives, pans, and other cooking gear)'),
                  ],
                },
              ]}
            />
          </InfoCard>
        </BentoGrid>
      </VStack>
    </DefaultLayout>
  );
}

createPage(WantedPage, {
  title: t('Wanted'),
  description: t(
    'A quiet log of things I am planning to pick up eventually. It serves mostly as a personal reference, but also as a zero-pressure guide for friends.'
  ),
});
export default WantedPage;
