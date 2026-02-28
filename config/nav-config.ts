export interface NavItem {
  name: string;
  href: string;
  label: string;
  isExternal?: boolean;
  externalText?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'About', href: '#about', label: 'About me' },
  { name: 'Projects', href: '#projects', label: 'View projects' },
  { name: 'Experience', href: '#experience', label: 'View experience' },
  { name: 'Contact', href: '#contact', label: 'Contact me' },
];
