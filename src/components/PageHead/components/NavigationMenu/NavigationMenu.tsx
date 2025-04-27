import React, { memo } from 'react';

import {
  NavigationMenu as NavigationMenuBase,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@shadcn/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shadcn/components/ui/dropdown-menu';
import { HiOutlineMenu } from 'react-icons/hi';

import type { NavItem } from '../../types';

export type NavigationMenuProps = {
  items: NavItem[];
};

const NavigationMenu = memo(function NavigationMenu({ items }: NavigationMenuProps) {
  return (
    <>
      <div className="hidden items-center md:block">
        <NavigationMenuBase>
          <NavigationMenuList>
            {items.map((item, idx) => (
              <NavigationMenuItem key={idx}>
                <a href={item.href}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.label}
                  </NavigationMenuLink>
                </a>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenuBase>
      </div>

      <div className="flex items-center md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Open menu">
              <HiOutlineMenu className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {items.map((item, i) => (
              <DropdownMenuItem key={i}>
                <a href={item.href}>{item.label}</a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
});

export default NavigationMenu;
