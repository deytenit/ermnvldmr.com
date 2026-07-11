import { Star, Code, Layout, Send, Zap, Shield, Cpu, Gamepad2, Plane, BookOpen, Check, Gift } from 'lucide-react';
import React from 'react';

import { BentoGrid } from './BentoGrid';
import { Header } from '../Header/Header';
import { Text } from '../Text/Text';

import type { Meta, StoryObj } from '@storybook/react';

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
          alt="Developer workstation"
          colSpan={2}
          overlayDescription="A deep dive into modern web architecture and performance optimization."
          overlayTitle="Featured Project"
          rowSpan={2}
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072"
        />
        <BentoGrid.InfoCard
          description="Built on top of Rsbuild and Rspack for near-instant compilation and ultra-fast HMR."
          icon={<Zap className="text-orange-500" size={24} />}
          title="Lightning Fast"
        />
        <BentoGrid.CTACard
          buttonText="Get Started"
          description="Connect with other developers and share your projects."
          href="#"
          title="Join the Community"
          variant="primary"
        />
        <BentoGrid.InfoCard
          description="Strict TypeScript integration across the entire monorepo for maximum reliability."
          footer={<div className="text-xs opacity-50">Strict Mode Enabled</div>}
          icon={<Shield className="text-green-500" size={24} />}
          title="Type Safe"
        />
        <BentoGrid.ImageCard
          alt="Code on screen"
          colSpan={2}
          overlayTitle="Clean Code"
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2069"
        />
        <BentoGrid.InfoCard
          description="Easily extend and customize the design system with our modular component library."
          icon={<Cpu className="text-blue-500" size={24} />}
          title="Modular Architecture"
        />
        <BentoGrid.CTACard
          buttonText="View Docs"
          description="Read the full documentation to learn more about the design system."
          href="#"
          title="Documentation"
        />
        <BentoGrid.BaseCard className="bg-tertiary/10 border-dashed" colSpan={4}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-tertiary rounded-full text-tertiary-text">
                <Send size={20} />
              </div>
              <div>
                <h4 className="font-bold text-text">Subscribe to Newsletter</h4>
                <p className="text-sm text-muted-text">Stay updated with the latest releases and technical articles.</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-text text-[var(--rb-base)] rounded-md font-medium">Subscribe</button>
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
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="h-32 flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
        </BentoGrid>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">Mixed Spans (Hero Pattern)</h3>
        <BentoGrid>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-primary/20 border-primary" colSpan={2} rowSpan={2}>2x2 Hero</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100" colSpan={2}>2x1 Wide</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
        </BentoGrid>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">Tall & Wide Pattern</h3>
        <BentoGrid>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-secondary/20 border-secondary" colSpan={2}>2x1 Wide</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-tertiary/20 border-tertiary" rowSpan={2}>1x2 Tall</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100">1x1</BentoGrid.BaseCard>
          <BentoGrid.BaseCard className="flex items-center justify-center bg-neutral-100" colSpan={2}>2x1</BentoGrid.BaseCard>
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
          description="Used for features or information. Can have an icon and a footer."
          footer={<div className="text-xs font-mono">v1.0.0</div>}
          icon={<Layout size={24} />}
          title="Info Card"
        />
        <BentoGrid.ImageCard
          alt="Abstract image"
          overlayDescription="Perfect for visual showcases with text overlays."
          overlayTitle="Image Card"
          src="https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&q=80&w=2048"
        />
        <BentoGrid.CTACard
          buttonText="Learn More"
          description="Drives action with an outline button."
          href="#"
          title="CTA Card (Default)"
        />
        <BentoGrid.CTACard
          buttonText="Sign Up Now"
          description="High prominence with a solid background."
          href="#"
          title="CTA Card (Primary)"
          variant="primary"
        />
        <BentoGrid.ListCard
          colSpan={2}
          defaultValue={['features']}
          description="A specialized card for categorized lists, ideal for wishlists or feature matrices."
          icon={<div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Star size={20} /></div>}
          sections={[
            {
              value: 'features',
              label: 'Features',
              labelIcon: <Check size={18} />,
              labelClassName: 'text-green-600',
              items: ['Responsive', 'Accessible', 'Themeable'],
            }
          ]}
          title="List Card"
        />
        <BentoGrid.BaseCard className="flex flex-col gap-4">
          <div className="p-2 bg-yellow-100 text-yellow-900 rounded-md w-fit">
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
        <Text className="text-muted-text" size="l">Things I want and things I already have, organized by category.</Text>
      </div>
      
      <BentoGrid>
        <BentoGrid.ListCard
          colSpan={2}
          defaultValue={['wanted']}
          description="My essential list of gadgets and hardware I use for daily productivity and entertainment."
          icon={
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Gamepad2 size={24} />
            </div>
          }
          rowSpan={2}
          sections={[
            {
              value: 'wanted',
              label: 'Wanted',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-orange-600',
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
              labelClassName: 'text-green-600',
              items: [
                'MacBook Pro M3 Max',
                'Sony WH-1000XM5 Headphones',
                'LG 27" 4K Monitor'
              ]
            }
          ]}
          title="Gadgets & Tech"
        />

        <BentoGrid.ListCard
          colSpan={2}
          description="Places I want to visit and explore around the world."
          icon={
            <div className="p-3 bg-green-100 text-green-700 rounded-xl">
              <Plane size={24} />
            </div>
          }
          sections={[
            {
              value: 'wanted',
              label: 'Bucket List',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-orange-600',
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
              labelClassName: 'text-green-600',
              items: [
                'Paris, France',
                'Rome, Italy',
                'London, UK'
              ]
            }
          ]}
          title="Travel Destinations"
          type="single"
        />

        <BentoGrid.ListCard
          colSpan={2}
          description="My reading backlog spanning technical books, sci-fi, and fantasy."
          icon={
            <div className="p-3 bg-violet-100 text-violet-700 rounded-xl">
              <BookOpen size={24} />
            </div>
          }
          sections={[
            {
              value: 'wanted',
              label: 'Reading List',
              labelIcon: <Gift size={18} />,
              labelClassName: 'text-orange-600',
              items: [
                'Designing Data-Intensive Applications',
                'The Pragmatic Programmer',
                'Dune Messiah'
              ]
            }
          ]}
          title="Books to Read"
          type="single"
        />
      </BentoGrid>
    </div>
  ),
};
