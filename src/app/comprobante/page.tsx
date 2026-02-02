'use client';

import React from 'react';
import { Share2, Download, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TicketCard from '@/components/ui/TicketCard';
import AppHeader from '@/components/AppHeader';
import { TicketData } from '@/types';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

import { Suspense } from 'react';

function ComprobanteContent() {
  const searchParams = useSearchParams();

  const ticketData: TicketData = {
    id: searchParams.get('id') || 'NB-000000',
    empresa: searchParams.get('empresa') || 'NB COMPANY S.A.',
    fecha:
      searchParams.get('fecha') ||
      new Intl.DateTimeFormat('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    monto: searchParams.get('monto') || 'ARS $ 0,00',
    status: 'Aprobado',
    proximoVencimiento: searchParams.get('vencimiento') || '-- --- ----',
  };

  const clientPhone = searchParams.get('telefono') || '';

  const handleShare = () => {
    const message =
      `*COMPROBANTE DE PAGO - NB COMPANY*\n\n` +
      `*Comercio:* ${ticketData.empresa}\n` +
      `*ID:* ${ticketData.id}\n` +
      `*Fecha:* ${ticketData.fecha}\n` +
      `*Monto:* ${ticketData.monto}\n` +
      `*Estado:* ${ticketData.status}\n` +
      `*Próximo Vencimiento:* ${ticketData.proximoVencimiento}\n\n` +
      `_Gracias por confiar en NB COMPANY_`;

    const cleanPhone = clientPhone.replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
  };

  const handleDownloadPDF = async () => {
    const ticketElement = document.getElementById('ticket-download-area');
    if (!ticketElement) return;

    toast.loading('Generando PDF...');

    try {
      // Use toPng for better quality and support
      const dataUrl = await toPng(ticketElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#09090b',
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [ticketElement.offsetWidth * 1.5, ticketElement.offsetHeight * 1.5],
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (ticketElement.offsetHeight * imgWidth) / ticketElement.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Comprobante_${ticketData.empresa.replace(/\s+/g, '_')}_${ticketData.id}.pdf`);

      toast.dismiss();
      toast.success('PDF descargado');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Error al generar PDF');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100">
      {/* Unified Header */}
      <AppHeader />

      <main className="flex flex-1 flex-col items-center justify-start overflow-y-auto px-4 pt-12 pb-10">
        <div className="w-full max-w-[450px]">
          {/* Reusable Ticket Component */}
          <div id="ticket-download-area">
            <TicketCard data={ticketData} />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleShare}
              className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] text-lg font-black text-zinc-950 shadow-lg shadow-[#25D366]/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Share2 size={22} strokeWidth={3} />
              Compartir por WhatsApp
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95"
              >
                <Download size={20} />
                <span className="text-sm">Descargar PDF</span>
              </button>
              <Link
                href="/dashboard"
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-transparent font-bold text-zinc-500 transition-all hover:bg-zinc-900 hover:text-zinc-300"
              >
                <X size={20} />
                <span className="text-sm">Cerrar</span>
              </Link>
            </div>
          </div>

          {/* Legal Footer */}
          <footer className="mt-12 pb-8 text-center">
            <p className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase">
              Documento oficial emitido por el
              <br />
              Sistema Central de Facturación NB
              <br />© 2024 NB COMPANY S.A.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function ComprobantePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-950">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
        </div>
      }
    >
      <ComprobanteContent />
    </Suspense>
  );
}
