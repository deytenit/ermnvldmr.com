import React, { memo } from 'react';
import NavigationMenu from './components/NavigationMenu/NavigationMenu';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';

import type { NavItem, Breadcrumb } from './types';

export type PageHeadProps = {
  /** The main title displayed in the header */
  title: string;
  /** Array of breadcrumbs, displayed above the title */
  breadcrumbs?: Breadcrumb[];
  /** Navigation items displayed on the right */
  navItems?: NavItem[];
};

export const PageHead = memo(function PageHead({ title, breadcrumbs, navItems }: PageHeadProps) {
  return (
    <div className="frosted-glass flex items-center justify-between space-x-4 p-4">
      <div className="flex flex-1 flex-col gap-1">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
        <h1 className="text-foreground font-serif text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {navItems && navItems.length > 0 && <NavigationMenu items={navItems} />}
      </div>
    </div>
  );
});

export default PageHead;
