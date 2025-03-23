import { Component, OnInit } from '@angular/core';
import { Chart as ChartJS } from 'chart.js';
import { registerables } from 'chart.js';
import * as FileSaver from 'file-saver';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { MessageService } from 'primeng/api';

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
    cards: DashboardCard[] = [
        {
            titulo: 'Total Parámetros',
            valor: 156,
            incremento: '+12 este mes',
            icono: 'pi pi-cog',
            color: 'blue'
        },
        {
            titulo: 'Modificaciones',
            valor: 847,
            incremento: '+24 última semana',
            icono: 'pi pi-sync',
            color: 'orange'
        },
        {
            titulo: 'Personalizaciones',
            valor: 35,
            incremento: '+3 nuevas',
            icono: 'pi pi-pencil',
            color: 'green'
        },
        {
            titulo: 'Empresas Activas',
            valor: 12,
            incremento: '+1 este mes',
            icono: 'pi pi-building',
            color: 'purple'
        }
    ];

    logs: LogParametro[] = [
        {
            id: 1,
            tipo: 'modificacion',
            parametro: 'Color Primario',
            valor_anterior: '#FF0000',
            valor_nuevo: '#0000FF',
            usuario: 'admin',
            fecha: '2024-03-15 10:30',
            empresa: 'Empresa A'
        },
        {
            id: 2,
            tipo: 'creacion',
            parametro: 'Nuevo Color',
            valor_anterior: '-',
            valor_nuevo: '#00FF00',
            usuario: 'usuario1',
            fecha: '2024-03-15 09:45',
            empresa: 'Empresa B'
        }
    ];

    parametrosPopulares: ParametroPopular[] = [
        {
            nombre: 'Colores',
            usos: 245,
            tendencia: 'up',
            descripcion: 'Alta demanda en personalización de temas'
        },
        {
            nombre: 'Monedas',
            usos: 180,
            tendencia: 'stable',
            descripcion: 'Uso consistente en transacciones'
        },
        {
            nombre: 'Unidades',
            usos: 156,
            tendencia: 'down',
            descripcion: 'Disminución en nuevas configuraciones'
        }
    ];

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
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Modificaciones',
                data: [65, 59, 80, 81, 56, 55],
                backgroundColor: '#42A5F5'
            }
        ]
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

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        this.inicializarGraficos();
    }

    inicializarGraficos() {
        this.crearGraficoCambios();
        this.crearGraficoDistribucion();
    }

    crearGraficoCambios() {
        const ctx = document.getElementById('graficoCambios') as HTMLCanvasElement;
        new ChartJS(ctx, {
            type: 'bar',
            data: this.cambiosMensuales,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    crearGraficoDistribucion() {
        const ctx = document.getElementById('graficoDistribucion') as HTMLCanvasElement;
        new ChartJS(ctx, {
            type: 'pie',
            data: this.distribucionConfig,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
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
