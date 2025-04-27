import React from 'react';
import { memo, Fragment } from 'react';

import {
  Breadcrumb as BreadcrumbBase,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@shadcn/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@shadcn/components/ui/dropdown-menu';

import type { Breadcrumb } from '../../types';

const MAX_VISIBLE_BREADCRUMBS = 4;

export type BreadcrumbsProps = {
  items: Breadcrumb[];
};

const Breadcrumbs = memo(function Breadcrumbs({ items }: BreadcrumbsProps) {
  const totalItems = items.length;
  const hasOverflownBreadcrumbs = totalItems > MAX_VISIBLE_BREADCRUMBS;

  return (
    <BreadcrumbBase className="text-sm">
      <BreadcrumbList>
        {hasOverflownBreadcrumbs ? (
          <>
            {/* First crumb */}
            <BreadcrumbItem>
              <BreadcrumbLink href={items[0].href}>{items[0].label}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Ellipsis dropdown for middle crumbs */}
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">More...</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {items.slice(1, totalItems - 2).map((item, i) => (
                    <DropdownMenuItem key={i}>
                      <a href={item.href}>{item.label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Penultimate crumb */}
            <BreadcrumbItem>
              <BreadcrumbLink href={items[totalItems - 2].href}>
                {items[totalItems - 2].label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {/* Final “page” crumb */}
            <BreadcrumbItem>
              <BreadcrumbPage>{items[totalItems - 1].label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          // No overflow: just render them all
          items.map((item, idx) => (
            <Fragment key={idx}>
              <BreadcrumbItem>
                {idx === totalItems - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < totalItems - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))
        )}
      </BreadcrumbList>
    </BreadcrumbBase>
  );
});

export default Breadcrumbs;
