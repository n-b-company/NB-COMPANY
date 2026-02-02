import { Home, Users, Plus, ReceiptText, User } from 'lucide-react';
import { StatusVariant } from '@/types';

export const ASSETS = {
  LOGO: '/nb-company.png',
  LOGO_DARK: '/nb-company-negro.png',
  AVATAR_PLACEHOLDER: 'https://avatar.vercel.sh/nbcompany',
};

export const STATUS_MAP: Record<string, StatusVariant> = {
  ACTIVE: 'success',
  WARNING: 'warning',
  OVERDUE: 'danger',
  INACTIVE: 'inactive',
};

export const STATUS_TEXT_MAP: Record<string, string> = {
  ACTIVE: 'AL DÍA',
  WARNING: 'PROX. VENCIMIENTO',
  OVERDUE: 'VENCIDO',
  INACTIVE: 'INACTIVO',
};

export const STAT_VARIANTS = {
  success: {
    border: 'hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/10 text-emerald-500',
    text: 'text-white',
  },
  warning: {
    border: 'hover:border-amber-500/50',
    iconBg: 'bg-amber-500/10 text-amber-500',
    text: 'text-amber-500',
  },
  danger: {
    border: 'hover:border-red-500/50',
    iconBg: 'bg-red-500/10 text-red-500',
    text: 'text-red-500',
  },
};

export const STATUS_STYLES: Record<StatusVariant, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500',
  warning: 'border-amber-500/20 bg-amber-500/10 text-amber-500',
  danger: 'border-red-500/20 bg-red-500/10 text-red-500',
  inactive: 'border-zinc-700 bg-zinc-800 text-zinc-500',
};

export const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Alta', href: '/nueva-instalacion', icon: Plus, isAction: true },
  { label: 'Cobro', href: '/cobros', icon: ReceiptText },
  { label: 'Perfil', href: '/perfil', icon: User },
];
