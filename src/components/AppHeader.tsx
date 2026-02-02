'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ASSETS } from '@/constants/constants';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { logout } from '@/lib/actions';

export default function AppHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-24">
          <Image
            src={ASSETS.LOGO}
            alt="NB COMPANY Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </div>
        <div className="h-6 w-px bg-zinc-800" />
        <div>
          <h2 className="text-sm leading-tight font-bold text-white">Técnico</h2>
          <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
            Control
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-3" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group border-primary/30 relative flex h-10 items-center gap-2 overflow-hidden rounded-full border-2 p-0.5 transition-all outline-none active:scale-95"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-full">
            <Image
              src={ASSETS.AVATAR_PLACEHOLDER}
              alt="Avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <ChevronDown
            size={14}
            className={`mr-1 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl duration-200">
            <div className="border-b border-zinc-800 p-4">
              <p className="text-xs font-bold text-white">Administrador</p>
              <p className="text-[10px] text-zinc-500">nbadmin@nbcompany.com</p>
            </div>
            <div className="p-2">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800">
                <UserIcon size={16} />
                Mi Perfil
              </button>
              <div className="my-1 h-px bg-zinc-800" />
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut size={16} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
