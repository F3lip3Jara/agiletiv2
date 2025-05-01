import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import type { ChartConfiguration } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';
import { registerables } from 'chart.js';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(...registerables);

interface DashboardCard {
  titulo: string;
  valor: number | string;
  incremento: string;
  icono: string;
}

interface LogEntry {
  id: number;
  tipo: string;
  mensaje: string;
  usuario: string;
  fecha: string;
  ip: string;
}

interface RequestLog {
  id: number;
  metodo: string;
  ruta: string;
  estado: number;
  duracion: string;
  fecha: string;
}

interface EstadisticasUsuarios {
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  distribucionRoles: {
    rol: string;
    cantidad: number;
  }[];
}

interface EstadisticasActividad {
  sesionesUltimaSemana: number;
  tiempoPromedioSesion: string;
  usuariosMasActivos: {
    usuario: string;
    sesiones: number;
  }[];
}

interface EstadisticasSeguridad {
  intentosFallidos: number;
  ubicacionesAcceso: {
    ubicacion: string;
    cantidad: number;
  }[];
  erroresPlataforma: number;
}

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.scss'
})
export class SeguridadComponent implements OnInit {
  cards: DashboardCard[] = [
    {
      titulo: 'Total Usuarios',
      valor: 28441,
      incremento: '+520 nuevos registros',
      icono: 'pi pi-users'
    },
    {
      titulo: 'Sesiones Activas',
      valor: 152,
      incremento: '+24 desde última visita',
      icono: 'pi pi-shield'
    },
    {
      titulo: 'Intentos Fallidos',
      valor: 85,
      incremento: '-12% esta semana',
      icono: 'pi pi-exclamation-triangle'
    }
  ];

  logs: LogEntry[] = [
    {
      id: 1,
      tipo: 'error',
      mensaje: 'Intento de acceso fallido',
      usuario: 'juan.perez',
      fecha: '2024-03-10 10:15:00',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      tipo: 'info',
      mensaje: 'Cambio de rol exitoso',
      usuario: 'admin',
      fecha: '2024-03-10 10:14:00',
      ip: '192.168.1.101'
    }
  ];

  requests: RequestLog[] = [
    {
      id: 1,
      metodo: 'POST',
      ruta: '/api/auth/login',
      estado: 200,
      duracion: '150ms',
      fecha: '2024-03-10 10:15:00'
    },
    {
      id: 2,
      metodo: 'GET',
      ruta: '/api/users',
      estado: 200,
      duracion: '89ms',
      fecha: '2024-03-10 10:14:50'
    }
  ];

  estadisticasUsuarios: EstadisticasUsuarios = {
    totalUsuarios: 150,
    usuariosActivos: 120,
    usuariosInactivos: 30,
    distribucionRoles: [
      { rol: 'Admin', cantidad: 5 },
      { rol: 'Usuario', cantidad: 100 },
      { rol: 'Supervisor', cantidad: 45 }
    ]
  };

  estadisticasActividad: EstadisticasActividad = {
    sesionesUltimaSemana: 450,
    tiempoPromedioSesion: '45 minutos',
    usuariosMasActivos: [
      { usuario: 'juan.perez', sesiones: 25 },
      { usuario: 'maria.garcia', sesiones: 20 },
      { usuario: 'carlos.lopez', sesiones: 18 }
    ]
  };

  estadisticasSeguridad: EstadisticasSeguridad = {
    intentosFallidos: 23,
    ubicacionesAcceso: [
      { ubicacion: 'Ciudad de México', cantidad: 250 },
      { ubicacion: 'Guadalajara', cantidad: 150 },
      { ubicacion: 'Monterrey', cantidad: 100 }
    ],
    erroresPlataforma: 15
  };

  actividadMensual = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Accesos',
        data: [5000, 10000, 15000, 12000],
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Operaciones',
        data: [3000, 8000, 12000, 9000],
        backgroundColor: '#2196F3'
      },
      {
        label: 'Errores',
        data: [500, 1000, 800, 600],
        backgroundColor: '#FF5722'
      }
    ]
  };

  // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;
  data: any[] = [];

  ngOnInit() {
    this.inicializarGraficos();
  }

  inicializarGraficos() {
    this.crearGraficoRoles();
    this.crearGraficoUbicaciones();
    this.crearGraficoActividad();
  }

  crearGraficoRoles() {
    const ctx = document.getElementById('graficoRoles') as HTMLCanvasElement;
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.estadisticasUsuarios.distribucionRoles.map(r => r.rol),
        datasets: [{
          data: this.estadisticasUsuarios.distribucionRoles.map(r => r.cantidad),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    };
    new ChartJS(ctx, config);
  }

  crearGraficoUbicaciones() {
    const ctx = document.getElementById('graficoUbicaciones') as HTMLCanvasElement;
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.estadisticasSeguridad.ubicacionesAcceso.map(u => u.ubicacion),
        datasets: [{
          label: 'Accesos por ubicación',
          data: this.estadisticasSeguridad.ubicacionesAcceso.map(u => u.cantidad),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    new ChartJS(ctx, config);
  }

  crearGraficoActividad() {
    const ctx = document.getElementById('graficoActividad') as HTMLCanvasElement;
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: this.actividadMensual.datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            stacked: true
          },
          x: {
            stacked: true
          }
        }
      }
    };
    new ChartJS(ctx, config);
  }

  exportExcelLogs(table: Table) {
    const datos = table.value.map(log => ({
      'Tipo': log.tipo,
      'Mensaje': log.mensaje,
      'Usuario': log.usuario,
      'Fecha': log.fecha,
      'IP': log.ip
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = { Sheets: { 'Logs': worksheet }, SheetNames: ['Logs'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    
    FileSaver.saveAs(data, 'logs_sistema_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  exportExcelRequests(table: Table) {
    const datos = table.value.map(req => ({
      'Método': req.metodo,
      'Ruta': req.ruta,
      'Estado': req.estado,
      'Duración': req.duracion,
      'Fecha': req.fecha
    }));

    const worksheet = XLSX.utils.json_to_sheet(datos);
    const workbook = { Sheets: { 'Requests': worksheet }, SheetNames: ['Requests'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    
    FileSaver.saveAs(data, 'requests_sistema_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // Función para manejar cambios en el valor de búsqueda
  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      // Disparar el evento input para activar el filtro
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
}
