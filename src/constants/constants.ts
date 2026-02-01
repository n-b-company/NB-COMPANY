import { Home, Users, Plus, ReceiptText, Map } from 'lucide-react';

export const ASSETS = {
  LOGO: '/nb-company.png',
  LOGO_DARK: '/nb-company-negro.png',
  AVATAR_PLACEHOLDER: 'https://avatar.vercel.sh/nbcompany',
};

export const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Alta', href: '/nueva-instalacion', icon: Plus, isAction: true },
  { label: 'Cobro', href: '/cobros', icon: ReceiptText },
  { label: 'Mapa', href: '/mapa', icon: Map },
];
