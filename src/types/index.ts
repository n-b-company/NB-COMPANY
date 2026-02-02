import React from 'react';
import { LucideIcon } from 'lucide-react';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'inactive';

export interface Client {
  id: string;
  name: string;
  address: string;
  status: string;
  imageUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatsGridProps {
  active: number;
  warning: number;
  overdue: number;
  activeStatus?: string | null;
  onStatusChange?: (status: string | null) => void;
}

export interface StatItemProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant: 'success' | 'warning' | 'danger';
}

export interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'default' | 'glass';
}

export interface EntityCardProps {
  icon?: LucideIcon;
  imageUrl?: string;
  title: string;
  subtitle?: string;
  statusText?: string;
  statusVariant?: StatusVariant;
  amount?: string;
  metadata?: { icon: LucideIcon; text: string }[];
  actionHref?: string;
  headerLabel?: string;
  className?: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterGroupProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export interface InfoItem {
  label: string;
  value?: string;
  subValue?: string;
  icon: LucideIcon;
  special?: boolean;
}

export interface InfoGridProps {
  items: InfoItem[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ImageCaptureProps {
  label: string;
  onImageCapture: (base64: string | null) => void;
  error?: string;
  value?: string;
  required?: boolean;
}

export interface LocationCaptureProps {
  label: string;
  onLocationCapture: (coords: { lat: number; lng: number } | null) => void;
  error?: string;
  value?: { lat: number; lng: number } | null;
  required?: boolean;
}

export interface DatePickerProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  id?: string;
  required?: boolean;
}

export interface TicketData {
  id: string;
  empresa: string;
  fecha: string;
  monto: string;
  status: 'Aprobado' | 'Pendiente' | 'Rechazado';
  proximoVencimiento: string;
}

export interface TicketCardProps {
  data: TicketData;
}

export interface AccountSummaryProps {
  vencimiento: string;
  saldoPendiente: string;
  ultimoPago: string;
  notas: string;
}

export interface ClientActionsProps {
  onWhatsApp: () => void;
  onRenew: () => void;
  onDeactivate: () => void;
}

export interface ClientHeaderProps {
  name: string;
  id: string;
  statusText: string;
  onBack: () => void;
}

export interface ClientImageProps {
  src: string;
  alt: string;
}

export interface ClientTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
