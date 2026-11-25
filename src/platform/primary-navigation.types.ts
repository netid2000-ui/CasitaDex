import type { ReactNode } from 'react';
export type PlatformNavigationItem = { label: string; selected: boolean; onPress: () => void; icon: ReactNode };
export type PlatformNavigationProps = {
  items: PlatformNavigationItem[];
  dark: boolean;
  surface: string;
  selected: string;
  ink: string;
  muted: string;
};
