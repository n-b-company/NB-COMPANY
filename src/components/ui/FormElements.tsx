'use client';

import React from 'react';
import { FormSectionProps, InputProps, SelectProps, TextareaProps } from '@/types';

export const FormSection = ({ title, icon: Icon, children }: FormSectionProps) => {
  return (
    <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
      <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Icon size={18} className="text-primary" />
        <h3 className="text-xs font-bold tracking-wider text-white uppercase">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4">{children}</div>
    </section>
  );
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, icon: Icon, required, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className={`mb-2 block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}
          >
            {label}
            {!required && required !== undefined && (
              <span className="ml-1 text-[10px] font-normal text-zinc-500">(Opcional)</span>
            )}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Icon size={18} />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            className={`focus:ring-primary focus:border-primary block w-full rounded-lg border bg-zinc-900 p-2.5 text-white placeholder-zinc-600 transition-colors outline-none ${
              error ? 'border-red-500/50' : 'border-zinc-800'
            } ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, options, error, required, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={`mb-2 block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}
        >
          {label}
          {!required && required !== undefined && (
            <span className="ml-1 text-[10px] font-normal text-zinc-500">(Opcional)</span>
          )}
        </label>
        <select
          id={id}
          ref={ref}
          className={`focus:ring-primary focus:border-primary block w-full rounded-lg border bg-zinc-900 p-2.5 text-white placeholder-zinc-600 transition-colors outline-none ${
            error ? 'border-red-500/50' : 'border-zinc-800'
          }`}
          {...props}
        >
          <option value="">Seleccione una opción</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, error, icon: Icon, required, ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={id}
          className={`mb-2 block text-sm font-medium ${error ? 'text-red-400' : 'text-zinc-400'}`}
        >
          {label}
          {!required && required !== undefined && (
            <span className="ml-1 text-[10px] font-normal text-zinc-500">(Opcional)</span>
          )}
        </label>
        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-3 text-zinc-500">
              <Icon size={18} />
            </div>
          )}
          <textarea
            id={id}
            ref={ref}
            className={`focus:ring-primary focus:border-primary block w-full resize-none rounded-lg border bg-zinc-900 p-2.5 text-white placeholder-zinc-600 transition-colors outline-none ${
              error ? 'border-red-500/50' : 'border-zinc-800'
            } ${Icon ? 'pl-10' : ''}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
