'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function AppTour() {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('has_seen_tour_v1');

    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        doneBtnText: '¡Entendido!',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        steps: [
          {
            element: '#dashboard-stats',
            popover: {
              title: 'Resumen Financiero',
              description:
                'Aquí puedes ver el estado de todos tus cobros: al día, por vencer y vencidos. Toca cualquiera para filtrar la lista.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#dashboard-search',
            popover: {
              title: 'Buscador Rápido',
              description: 'Encuentra clientes por nombre o dirección instantáneamente.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#dashboard-list',
            popover: {
              title: 'Lista de Clientes',
              description:
                'Tus últimas instalaciones aparecen aquí. Toca una tarjeta para ver detalles, renovar o gestionar.',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#nav-action-btn',
            popover: {
              title: 'Nueva Instalación',
              description: 'Usa este botón central para registrar un nuevo cliente rápidamente.',
              side: 'top',
              align: 'center',
            },
          },
          {
            element: '#nav-item-mapa',
            popover: {
              title: 'Mapa en Vivo',
              description:
                'Visualiza todas tus instalaciones geolocalizadas para planificar tu ruta.',
              side: 'top',
              align: 'center',
            },
          },
          {
            element: '#nav-item-cobros',
            popover: {
              title: 'Gestión de Cobros',
              description: 'Accede al panel financiero completo con proyección de ganancias.',
              side: 'top',
              align: 'center',
            },
          },
        ],
        onDestroyStarted: () => {
          driverObj.destroy();
          localStorage.setItem('has_seen_tour_v1', 'true');
        },
      });

      // Small delay to ensure rendering
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, []);

  return null;
}
