import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import type { ChartConfiguration } from 'chart.js';
import { Chart as ChartJS } from 'chart.js';
import { registerables } from 'chart.js';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { getSeguridadRequest, getSeguridadSuccess } from '../state/actions/seguridad.actions';
import { AppState } from '../../app.state';
import { incrementarRequest } from '../../state/actions/estado.actions';
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
  incrementoUsuarios: {
    porcentaje: number;
    valor: number;
  };
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
  incrementoSesiones: {
    porcentaje: number;
    valor: number;
  };
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
  incrementoIntentosFallidos: {
    porcentaje: number;
    valor: number;
  };
}

interface ActividadMensual {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrl: './seguridad.component.scss'
})
export class SeguridadComponent implements OnInit {
  
  cards: DashboardCard[] = [];
  logs: LogEntry[] = [];
  requests: RequestLog[] = [];
  estadisticasUsuarios: EstadisticasUsuarios;
  estadisticasActividad: EstadisticasActividad;
  estadisticasSeguridad: EstadisticasSeguridad;
  actividadMensual: ActividadMensual;

  // Propiedades para el diálogo de búsqueda
  showSearchDialog: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  dt!: Table;
  data: any[] = [];

  constructor(
    private store: Store<AppState>,
    private actions$: Actions
  ) {}

  ngOnInit() {
    this.store.dispatch(incrementarRequest({request: 1}));
    this.store.dispatch(getSeguridadRequest());

    this.actions$.pipe(
      ofType(getSeguridadSuccess)
    ).subscribe((data: any) => {
    //  console.log(data.seguridad);
      this.estadisticasUsuarios = data.seguridad.estadisticasUsuarios;
      this.estadisticasActividad = data.seguridad.estadisticasActividad;
      this.estadisticasSeguridad = data.seguridad.estadisticasSeguridad;
      this.logs = data.seguridad.logs;
      this.requests = data.seguridad.requests;
      this.actividadMensual = data.seguridad.actividadMensual;

      this.cards = [
        {
          titulo: 'Total Usuarios',
          valor: this.estadisticasUsuarios.totalUsuarios,
          incremento: `+${this.estadisticasUsuarios.incrementoUsuarios.porcentaje}% desde último mes`,
          icono: 'pi pi-users'
        },
        {
          titulo: 'Sesiones Activas',
          valor: this.estadisticasActividad.sesionesUltimaSemana,
          incremento: `+${this.estadisticasActividad.incrementoSesiones.porcentaje}% desde último mes`,
          icono: 'pi pi-shield'
        },
        {
          titulo: 'Intentos Fallidos',
          valor: this.estadisticasSeguridad.intentosFallidos,
          incremento: `+${this.estadisticasSeguridad.incrementoIntentosFallidos.porcentaje}% desde último mes`,
          icono: 'pi pi-exclamation-triangle'
        }
      ];

      // Inicializar gráficos después de tener los datos
      setTimeout(() => {
        this.inicializarGraficos();
      }, 0);
    });
  }

  inicializarGraficos() {
    if (this.estadisticasUsuarios?.distribucionRoles) {
      this.crearGraficoRoles();
    }
    if (this.estadisticasSeguridad?.ubicacionesAcceso) {
      this.crearGraficoUbicaciones();
    }
    if (this.actividadMensual) {
      this.crearGraficoActividad();
    }
  }

  crearGraficoRoles() {
    const ctx = document.getElementById('graficoRoles') as HTMLCanvasElement;
    if (!ctx) return;

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
    if (!ctx) return;

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
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.actividadMensual.labels,
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

  onSearchValueChange(value: string) {
    if (this.searchInput && this.searchInput.nativeElement) {
      const inputElement = this.searchInput.nativeElement as HTMLInputElement;
      inputElement.value = value;
      const event = new Event('input', { bubbles: true });
      inputElement.dispatchEvent(event);
    }
  }
}
