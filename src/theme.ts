/**
 * Project Color Theme Palette
 * Call colors by index (1, 2, 3, 4) or name.
 */
export const THEME_COLORS = {
  1: '#FFFFFF',
  2: '#ECEDEF',
  3: '#121417',
  4: '#121417',
  MAIN: '#FFFFFF',
  SECONDARY: '#ECEDEF',
  THIRD: '#121417',
  FOURTH: '#121417',
} as const;

export type ThemeColorKey = 1 | 2 | 3 | 4 | 'MAIN' | 'SECONDARY' | 'THIRD' | 'FOURTH';

export const getColor = (key: ThemeColorKey): string => {
  return THEME_COLORS[key];
};
