import { getTypographyClassNames } from './getTypographyClassNames';

describe('lib/typography/getTypographyClassNames', () => {
  describe('type + size → @theme token class', () => {
    it('returns text-rb-body-m by default', () => {
      expect(getTypographyClassNames()).toContain('text-rb-body-m');
    });

    it('returns correct class for each type/size combination', () => {
      expect(getTypographyClassNames({ type: 'display', size: 'l' })).toContain('text-rb-display-l');
      expect(getTypographyClassNames({ type: 'headline', size: 'm' })).toContain('text-rb-headline-m');
      expect(getTypographyClassNames({ type: 'title', size: 's' })).toContain('text-rb-title-s');
      expect(getTypographyClassNames({ type: 'body', size: 'l' })).toContain('text-rb-body-l');
      expect(getTypographyClassNames({ type: 'label', size: 'm' })).toContain('text-rb-label-m');
    });
  });

  describe('font family', () => {
    it('applies font-serif for display and headline', () => {
      expect(getTypographyClassNames({ type: 'display' })).toContain('font-serif');
      expect(getTypographyClassNames({ type: 'headline' })).toContain('font-serif');
    });

    it('applies font-sans for title, body, and label', () => {
      expect(getTypographyClassNames({ type: 'title' })).toContain('font-sans');
      expect(getTypographyClassNames({ type: 'body' })).toContain('font-sans');
      expect(getTypographyClassNames({ type: 'label' })).toContain('font-sans');
    });
  });

  describe('font weight', () => {
    it('adds font-medium for label type', () => {
      expect(getTypographyClassNames({ type: 'label' })).toContain('font-medium');
    });

    it('does not add font-medium for non-label types', () => {
      expect(getTypographyClassNames({ type: 'body' })).not.toContain('font-medium');
      expect(getTypographyClassNames({ type: 'title' })).not.toContain('font-medium');
    });

    it('adds font-bold when bold is true', () => {
      expect(getTypographyClassNames({ bold: true })).toContain('font-bold');
    });

    it('does not add font-bold by default', () => {
      expect(getTypographyClassNames()).not.toContain('font-bold');
    });
  });

  describe('color', () => {
    it('applies default color class', () => {
      expect(getTypographyClassNames()).toContain('text-[var(--rb-text)]');
    });

    it('applies each color variant', () => {
      expect(getTypographyClassNames({ color: 'muted' })).toContain('text-[var(--rb-muted-text)]');
      expect(getTypographyClassNames({ color: 'primary' })).toContain('text-[var(--rb-primary-text)]');
      expect(getTypographyClassNames({ color: 'error' })).toContain('text-[var(--rb-error-text)]');
      expect(getTypographyClassNames({ color: 'inherit' })).toContain('text-inherit');
    });
  });

  describe('decorations', () => {
    it('applies italic', () => {
      expect(getTypographyClassNames({ italic: true })).toContain('italic');
    });

    it('applies underline', () => {
      expect(getTypographyClassNames({ underline: true })).toContain('underline');
    });

    it('applies line-through for strike', () => {
      expect(getTypographyClassNames({ strike: true })).toContain('line-through');
    });

    it('does not apply decorations by default', () => {
      const result = getTypographyClassNames();
      expect(result).not.toContain('italic');
      expect(result).not.toContain('underline');
      expect(result).not.toContain('line-through');
    });
  });

  describe('alignment', () => {
    it('applies text-center', () => {
      expect(getTypographyClassNames({ align: 'center' })).toContain('text-center');
    });

    it('applies each alignment', () => {
      expect(getTypographyClassNames({ align: 'left' })).toContain('text-left');
      expect(getTypographyClassNames({ align: 'right' })).toContain('text-right');
      expect(getTypographyClassNames({ align: 'justify' })).toContain('text-justify');
    });

    it('does not apply alignment by default', () => {
      const result = getTypographyClassNames();
      expect(result).not.toMatch(/text-(left|center|right|justify)/);
    });
  });

  describe('wrap', () => {
    it('applies whitespace-nowrap', () => {
      expect(getTypographyClassNames({ wrap: 'nowrap' })).toContain('whitespace-nowrap');
    });

    it('applies text-balance', () => {
      expect(getTypographyClassNames({ wrap: 'balance' })).toContain('text-balance');
    });

    it('applies text-pretty', () => {
      expect(getTypographyClassNames({ wrap: 'pretty' })).toContain('text-pretty');
    });
  });

  describe('overflow / maxLines', () => {
    it('applies truncate for overflow ellipsis', () => {
      expect(getTypographyClassNames({ overflow: 'ellipsis' })).toContain('truncate');
    });

    it('applies overflow-clip for overflow clip', () => {
      expect(getTypographyClassNames({ overflow: 'clip' })).toContain('overflow-clip');
    });

    it('applies line-clamp for maxLines', () => {
      expect(getTypographyClassNames({ maxLines: 3 })).toContain('line-clamp-3');
    });

    it('maxLines takes precedence over overflow', () => {
      const result = getTypographyClassNames({ maxLines: 2, overflow: 'ellipsis' });
      expect(result).toContain('line-clamp-2');
      expect(result).not.toContain('truncate');
    });
  });
});
