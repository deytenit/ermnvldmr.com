import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BentoGrid } from './BentoGrid';
import { Star, Code, Layout, Send, Zap, Shield, Cpu, Gamepad2, Plane, BookOpen, Check, Gift } from 'lucide-react';

import { Header } from '../Header/Header';
import { Text } from '../Text/Text';

const meta: Meta<typeof BentoGrid> = {
  title: 'Components/BentoGrid',
  component: BentoGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BentoGrid>;

export const Showcase: Story = {
  render: () => (
    <div className="w-full max-w-6xl p-4">
      <BentoGrid>
        <BentoGrid.ImageCard
          colSpan={2}
          rowSpan={2}
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"
          alt="Developer workstation"
          overlayTitle="Featured Project"
          overlayDescription="A deep dive into modern web architecture and performance optimization."
        />
        <BentoGrid.InfoCard
          icon={<Zap size={24} className="text-rb-orange-500" />}
          title="Lightning Fast"
          description="Built on top of Rsbuild and Rspack for near-instant compilation and ultra-fast HMR."
        />
        <BentoGrid.CTACard
          variant="primary"
          title="Join the Community"
          description="Connect with other developers and share your projects."
          buttonText="Get Started"
          href="#"
        />
        <BentoGrid.InfoCard
          icon={<Shield size={24} className="text-rb-green-500" />}
          title="Type Safe"
          description="Strict TypeScript integration across the entire monorepo for maximum reliability."
          footer={<div className="text-xs opacity-50">Strict Mode Enabled</div>}
        />
        <BentoGrid.ImageCard
          colSpan={2}
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2069"
          alt="Code on screen"
          overlayTitle="Clean Code"
        />
        <BentoGrid.InfoCard
          icon={<Cpu size={24} className="text-rb-blue-500" />}
          title="Modular Architecture"
          description="Easily extend and customize the design system with our modular component library."
        />
        <BentoGrid.CTACard
          title="Documentation"
          description="Read the full documentation to learn more about the design system."
          buttonText="View Docs"
          href="#"
        />
        <BentoGrid.BaseCard colSpan={4} className="bg-rb-tertiary-base/10 border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rb-tertiary-base rounded-full text-rb-tertiary-text">
                <Send size={20} />
              </div>
              <div>
                <h4 className="font-bold text-rb-text">Subscribe to Newsletter</h4>
                <p className="text-sm text-rb-muted-text">Stay updated with the latest releases and technical articles.</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-rb-text text-rb-base rounded-md font-medium">Subscribe</button>
          </div>
        </BentoGrid.BaseCard>
      </BentoGrid>
    </div>
  ),
};

export const LayoutPatterns: Story = {
  render: () => (
    <div className="w-full max-w-6xl p-4 flex flex-col gap-12">
      <section>
        <h3 className="mb-4 text-xl font-bold">Standard 4-Column Grid</h3>
        <BentoGrid>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
        </BentoGrid>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">Mixed Spans (Hero Pattern)</h3>
        <BentoGrid>
          <BentoGrid.BaseCard colSpan={2} rowSpan={2} className="flex items-center justify-center bg-rb-primary-base/20 border-rb-primary-base">2x2 Hero</BentoGrid.BaseCard>
          <BentoGrid.BaseCard colSpan={2} className="flex items-center justify-center bg-rb-color-neutral-100">2x1 Wide</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
        </BentoGrid>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">Tall & Wide Pattern</h3>
        <BentoGrid>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard colSpan={2} className="flex items-center justify-center bg-rb-secondary-base/20 border-rb-secondary-base">2x1 Wide</BentoGrid.BaseCard>
          <BentoGrid.BaseCard rowSpan={2} className="flex items-center justify-center bg-rb-tertiary-base/20 border-rb-tertiary-base">1x2 Tall</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-rb-color-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard colSpan={2} className="flex items-center justify-center bg-rb-color-neutral-100">2x1</BentoGrid.BaseCard>
        </BentoGrid>
      </section>
    </div>
  ),
};

export const AllCardTypes: Story = {
  render: () => (
    <div className="w-full max-w-6xl p-4">
      <BentoGrid>
        <BentoGrid.InfoCard
          icon={<Layout size={24} />}
          title="Info Card"
          description="Used for features or information. Can have an icon and a footer."
          footer={<div className="text-xs font-mono">v1.0.0</div>}
        />
        <BentoGrid.ImageCard
          src="https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=2048"
          alt="Abstract image"
          overlayTitle="Image Card"
          overlayDescription="Perfect for visual showcases with text overlays."
        />
        <BentoGrid.CTACard
          title="CTA Card (Default)"
          description="Drives action with an outline button."
          buttonText="Learn More"
          href="#"
        />
        <BentoGrid.CTACard
          variant="primary"
          title="CTA Card (Primary)"
          description="High prominence with a solid background."
          buttonText="Sign Up Now"
          href="#"
        />
        <BentoGrid.ListCard
          colSpan={2}
          title="List Card"
          description="A specialized card for categorized lists, ideal for wishlists or feature matrices."
          icon={<div className="p-2 bg-rb-blue-100 text-rb-blue-700 rounded-lg"><Star size={20} /></div>}
          defaultValue={['features']}
          sections={[
            {
              value: 'features',
              label: 'Features',
              labelIcon: <Check size={18} />,
              labelClassName: 'text-rb-green-600',
              items: ['Responsive', 'Accessible', 'Themeable'],
            }
          ]}
        />
        <BentoGrid.BaseCard className="flex flex-col gap-4">
          <div className="p-2 bg-rb-color-yellow-100 text-rb-color-yellow-900 rounded-md w-fit">
            <Code size={20} />
          </div>
          <h4 className="font-bold">Base Card (Custom)</h4>
          <p className="text-sm">You can put any children here to create custom card types while maintaining the bento border and padding.</p>
        </BentoGrid.BaseCard>
      </BentoGrid>
    </div>
  ),
};

export const WishlistVariant: Story = {
  render: () => (
    <div className="w-full max-w-6xl p-4">
      <div className="mb-8">
        <Header level={2}>My Wishlist</Header>
        <Text size="l" className="text-rb-muted-text">Things I want and things I already have, organized by category.</Text>
      </div>
      
      <BentoGrid>
        <BentoGrid.ListCard
          colSpan={2}
          rowSpan={2}
          title="Gadgets & Tech"
          description="My essential list of gadgets and hardware I use for daily productivity and entertainment."
          icon={
            <div className="p-3 bg-rb-blue-100 text-rb-blue-700 rounded-xl">
              <Gamepad2 size={24} />
            </div>
          }
          defaultValue={['wanted']}
          sections={[
            {
              value: 'wanted',
              label: 'Wanted',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-rb-orange-600',
              items: [
                'Steam Deck OLED 1TB',
                'Sony A7C II with 35mm lens',
                'Keychron Mechanical Keyboard'
              ]
            },
            {
              value: 'owned',
              label: 'Already Owned',
              labelIcon: <Check size={18} />,
              labelClassName: 'text-rb-green-600',
              items: [
                'MacBook Pro M3 Max',
                'Sony WH-1000XM5 Headphones',
                'LG 27" 4K Monitor'
              ]
            }
          ]}
        />

        <BentoGrid.ListCard
          colSpan={2}
          title="Travel Destinations"
          description="Places I want to visit and explore around the world."
          icon={
            <div className="p-3 bg-rb-green-100 text-rb-green-700 rounded-xl">
              <Plane size={24} />
            </div>
          }
          type="single"
          sections={[
            {
              value: 'wanted',
              label: 'Bucket List',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-rb-orange-600',
              items: [
                'Kyoto, Japan (Cherry Blossom Season)',
                'Reykjavik, Iceland',
                'Swiss Alps'
              ]
            },
            {
              value: 'owned',
              label: 'Visited',
              labelIcon: <Check size={18} />,
              labelClassName: 'text-rb-green-600',
              items: [
                'Paris, France',
                'Rome, Italy',
                'London, UK'
              ]
            }
          ]}
        />

        <BentoGrid.ListCard
          colSpan={2}
          title="Books to Read"
          description="My reading backlog spanning technical books, sci-fi, and fantasy."
          icon={
            <div className="p-3 bg-rb-violet-100 text-rb-violet-700 rounded-xl">
              <BookOpen size={24} />
            </div>
          }
          type="single"
          sections={[
            {
              value: 'wanted',
              label: 'Reading List',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-rb-orange-600',
              items: [
                'Designing Data-Intensive Applications',
                'The Pragmatic Programmer',
                'Dune Messiah'
              ]
            }
          ]}
        />
      </BentoGrid>
    </div>
  ),
};
