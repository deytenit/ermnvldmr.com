import { cn } from './cn';

/**
 * Test suite for the cn utility function
 */
describe('shared/helpers/cn/cn', () => {
  it('combines simple class names', () => {
    expect(cn('p-4', 'bg-red-500')).toBe('p-4 bg-red-500');
    expect(cn('flex', 'items-center', 'justify-between')).toBe('flex items-center justify-between');
  });

  it('resolves conflicting Tailwind classes using tailwind-merge', () => {
    expect(cn('p-4 bg-red-500', 'bg-blue-500')).toBe('p-4 bg-blue-500');
    expect(cn('text-sm font-normal', 'font-bold')).toBe('text-sm font-bold');
    expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
  });

  it('handles conditional classes using clsx', () => {
    expect(cn('p-4', true && 'bg-red-500')).toBe('p-4 bg-red-500');
    expect(cn('p-4', false && 'bg-red-500')).toBe('p-4');
    
    // Test null and undefined conditions
    const nullCondition: boolean | null = null;
    const undefinedCondition: boolean | undefined = undefined;
    expect(cn('p-4', nullCondition && 'bg-red-500')).toBe('p-4');
    expect(cn('p-4', undefinedCondition && 'bg-red-500')).toBe('p-4');
  });

  it('handles object-based conditional classes', () => {
    expect(cn('p-4', { 'bg-red-500': true, 'text-white': false })).toBe('p-4 bg-red-500');
    expect(cn('p-4', { 'bg-red-500': false, 'text-white': true })).toBe('p-4 text-white');
  });

  it('handles array inputs', () => {
    expect(cn(['flex', 'items-center'], 'justify-between')).toBe('flex items-center justify-between');
    expect(cn(['p-4', null, 'bg-red-500'])).toBe('p-4 bg-red-500');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('', null, undefined, false)).toBe('');
  });

  it('combines complex scenarios', () => {
    const isActive = true;
    const primaryVariant: 'primary' | 'secondary' = 'primary';
    const secondaryVariant: 'primary' | 'secondary' = 'secondary';
    
    // Test primary variant
    expect(
      cn(
        'base-class',
        isActive && 'active-class',
        {
          'primary-class': primaryVariant === 'primary',
          'secondary-class': false,
        },
        ['flex', 'items-center'],
        'bg-red-500 bg-blue-500' // Should resolve to bg-blue-500
      )
    ).toBe('base-class active-class primary-class flex items-center bg-blue-500');

    // Test secondary variant
    expect(
      cn(
        'base-class',
        isActive && 'active-class',
        {
          'primary-class': false,
          'secondary-class': secondaryVariant === 'secondary',
        },
        ['flex', 'items-center']
      )
    ).toBe('base-class active-class secondary-class flex items-center');
  });

  it('properly handles spacing and responsive classes', () => {
    expect(
      cn('p-2 p-4', 'sm:p-6', 'md:p-8')
    ).toBe('p-4 sm:p-6 md:p-8');
    
    expect(
      cn('m-2', 'mx-4', 'ml-6')
    ).toBe('m-2 mx-4 ml-6');
  });
});
