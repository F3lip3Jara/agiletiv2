import { Component, OnInit } from '@angular/core';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js';
import { registerables } from 'chart.js';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';
import { getParametrosRequest, getParametrosSuccess } from '../state/actions/parametros.actions';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { Actions , ofType} from '@ngrx/effects';
import { incrementarRequest } from '../../state/actions/estado.actions';
// Registrar los componentes necesarios de Chart.js
ChartJS.register(...registerables);

interface DashboardCard {
    titulo: string;
    valor: number | string;
    incremento: string;
    icono: string;
    color: string;
}

interface LogParametro {
    id: number;
    tipo: string;
    parametro: string;
    valor_anterior: string;
    valor_nuevo: string;
    usuario: string;
    fecha: string;
    empresa: string;
}

interface ParametroPopular {
    nombre: string;
    usos: number;
    tendencia: 'up' | 'down' | 'stable';
    descripcion: string;
}

interface Alerta {
    tipo: 'warning' | 'danger' | 'info';
    mensaje: string;
    fecha: string;
    resuelta: boolean;
}

@Component({
    selector: 'app-parametros',
    templateUrl: './parametros.component.html',
    styleUrl: './parametros.component.scss',
    providers: [MessageService]
})
export class ParametrosComponent implements OnInit {
    cards: DashboardCard[] = [];
    logs: LogParametro[] = [];
    parametrosPopulares: ParametroPopular[] = [];
    private graficoCambios: ChartJS | null = null;
    private graficoDistribucion: ChartJS | null = null;

    alertas: Alerta[] = [
        {
            tipo: 'warning',
            mensaje: 'Colores sin nombres descriptivos',
            fecha: '2024-03-15',
            resuelta: false
        },
        {
            tipo: 'danger',
            mensaje: 'Conflicto en códigos de moneda',
            fecha: '2024-03-14',
            resuelta: true
        }
    ];

    cambiosMensuales = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Modificaciones',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#42A5F5'
        }]
    };

    distribucionConfig = {
        labels: ['Estándar', 'Personalizado'],
        datasets: [
            {
                data: [70, 30],
                backgroundColor: ['#66BB6A', '#FFA726']
            }
        ]
    };

    constructor(private messageService: MessageService, private store: Store<AppState> , private actions$ : Actions) {}

    ngOnInit() {
      this.store.dispatch(incrementarRequest({request: 1}));  
        this.store.dispatch(getParametrosRequest());

        this.actions$.pipe(
            ofType(getParametrosSuccess)
          ).subscribe((data: any) => {
            
            this.cards = data.parametros.dashboardCards;
            console.log(this.cards);
            this.logs = data.parametros.logs;
            this.parametrosPopulares = data.parametros.parametrosPopulares;
            this.cambiosMensuales = {
                labels: [...data.parametros.cambiosMensuales.labels],
                datasets: data.parametros.cambiosMensuales.datasets.map((dataset: any) => ({
                    ...dataset,
                    data: [...dataset.data]
                }))
            };
            this.inicializarGraficos();
          }
        );
     
    }

    inicializarGraficos() {
        this.crearGraficoCambios();
        this.crearGraficoDistribucion();
    }

    crearGraficoCambios() {
        const ctx = document.getElementById('graficoCambios') as HTMLCanvasElement;
        if (this.graficoCambios) {
            this.graficoCambios.destroy();
        }
        const config: ChartConfiguration = {
            type: 'bar',
            data: {
                labels: [...this.cambiosMensuales.labels],
                datasets: this.cambiosMensuales.datasets.map(dataset => ({
                    ...dataset,
                    data: [...dataset.data]
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        };
        this.graficoCambios = new ChartJS(ctx, config);
    }

    crearGraficoDistribucion() {
        const ctx = document.getElementById('graficoDistribucion') as HTMLCanvasElement;
        if (this.graficoDistribucion) {
            this.graficoDistribucion.destroy();
        }
        const config: ChartConfiguration = {
            type: 'pie',
            data: {
                labels: [...this.distribucionConfig.labels],
                datasets: this.distribucionConfig.datasets.map(dataset => ({
                    ...dataset,
                    data: [...dataset.data]
                }))
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
        this.graficoDistribucion = new ChartJS(ctx, config);
    }

    exportExcelLogs(table: Table) {
        const datos = table.value.map(log => ({
            'Tipo': log.tipo,
            'Parámetro': log.parametro,
            'Valor Anterior': log.valor_anterior,
            'Valor Nuevo': log.valor_nuevo,
            'Usuario': log.usuario,
            'Fecha': log.fecha,
            'Empresa': log.empresa
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = { Sheets: { 'Logs': worksheet }, SheetNames: ['Logs'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
        
        FileSaver.saveAs(data, 'logs_parametros_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    toggleAlertaEstado(alerta: Alerta) {
        alerta.resuelta = !alerta.resuelta;
        this.messageService.add({
            severity: 'success',
            summary: 'Estado Actualizado',
            detail: `Alerta marcada como ${alerta.resuelta ? 'resuelta' : 'pendiente'}`,
            life: 3000
        });
    }
}
