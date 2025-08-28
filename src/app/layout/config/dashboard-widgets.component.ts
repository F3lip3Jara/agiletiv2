import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WeatherService, WeatherData } from './weather.service';

interface DashboardWidget {
  id: string;
  type: 'clock' | 'weather' | 'calendar' | 'indicators';
  title: string;
  data: any;
  position: 'top-left' | 'top-right' | 'bottom';
}

@Component({
  selector: 'app-dashboard-widgets',
  templateUrl: './dashboard-widgets.component.html',
  styleUrls: ['./dashboard-widgets.component.scss']
})
export class DashboardWidgetsComponent implements OnInit {
  @Input() indicadoresEconomicos: any = { dolares: [] };
  @Input() weatherData: WeatherData | null = null;
  @Input() weatherError: boolean = false;
  @Input() isRefreshing: boolean = false;
  @Output() refreshIndicators = new EventEmitter<void>();

  currentTime = new Date();
  currentDate = new Date();
  selectedDate = new Date();
  


  // Widgets configurables
  widgets: DashboardWidget[] = [
    {
      id: 'clock',
      type: 'clock',
      title: 'Reloj',
      data: { time: this.currentTime, date: this.currentDate },
      position: 'top-left'
    },
    {
      id: 'weather',
      type: 'weather',
      title: 'Clima',
      data: { weather: this.weatherData },
      position: 'top-right'
    },
    {
      id: 'calendar',
      type: 'calendar',
      title: 'Calendario',
      data: { selectedDate: this.selectedDate },
      position: 'bottom'
    },
    {
      id: 'indicators',
      type: 'indicators',
      title: 'Indicadores',
      data: { indicators: this.indicadoresEconomicos },
      position: 'bottom'
    }
  ];

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    this.currentTime = new Date();
    this.currentDate = new Date();
    
    // Actualizar widget de reloj
    const clockWidget = this.widgets.find(w => w.id === 'clock');
    if (clockWidget) {
      clockWidget.data = { time: this.currentTime, date: this.currentDate };
    }
  }

  getCurrentTimeString(): string {
    return this.currentTime.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  getCurrentDayString(): string {
    const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    return days[this.currentTime.getDay()];
  }

  getCurrentMonthString(): string {
    return this.currentTime.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  }

  getCurrentMonthShort(): string {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return months[this.currentTime.getMonth()];
  }

  getCurrentMonthLong(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[this.currentTime.getMonth()];
  }

  getCurrentDayNumber(): number {
    return this.currentTime.getDate();
  }

  getWeatherIcon(icon: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'pi pi-sun',
      '01n': 'pi pi-moon',
      '02d': 'pi pi-cloud-sun',
      '02n': 'pi pi-cloud-moon',
      '03d': 'pi pi-cloud',
      '03n': 'pi pi-cloud',
      '04d': 'pi pi-clouds',
      '04n': 'pi pi-clouds',
      '09d': 'pi pi-cloud-rain',
      '09n': 'pi pi-cloud-rain',
      '10d': 'pi pi-cloud-rain',
      '10n': 'pi pi-cloud-rain',
      '11d': 'pi pi-bolt',
      '11n': 'pi pi-bolt',
      '13d': 'pi pi-snowflake',
      '13n': 'pi pi-snowflake',
      '50d': 'pi pi-fog',
      '50n': 'pi pi-fog'
    };
    return iconMap[icon] || 'pi pi-cloud';
  }

  onRefreshIndicators() {
    this.refreshIndicators.emit();
  }

  getIndicatorClass(label: string): string {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('dólar') || labelLower.includes('usd')) return 'indicator-usd';
    if (labelLower.includes('uf')) return 'indicator-uf';
    if (labelLower.includes('euro')) return 'indicator-euro';
    if (labelLower.includes('ipc')) return 'indicator-ipc';
    return 'indicator-default';
  }

  getIndicatorSubtitle(label: string): string {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('dólar') || labelLower.includes('usd')) return 'Dólar Estadounidense';
    if (labelLower.includes('uf')) return 'Unidad de Fomento';
    if (labelLower.includes('euro')) return 'Euro Europeo';
    if (labelLower.includes('ipc')) return 'Índice de Precios al Consumidor';
    return 'Indicador Económico';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatSimpleCurrency(value: number): string {
    return '$' + value.toLocaleString('es-CL');
  }

  getChangePercentage(indicador: any): string {
    if (indicador.cambio) {
      const change = indicador.cambio > 0 ? '+' : '';
      return `${change}${indicador.cambio.toFixed(2)}`;
    }
    return '0.00';
  }

  getVariationPercentage(indicador: any): number {
    if (indicador.valorAnterior && indicador.valorAnterior > 0) {
      return ((indicador.valor - indicador.valorAnterior) / indicador.valorAnterior) * 100;
    }
    return indicador.cambio || 0;
  }

  trackByIndicator(index: number, item: any): any {
    return item.label || index;
  }

  getCalendarDays(): number[] {
    const days = [];
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Obtener el primer día del mes
    const firstDay = new Date(year, month, 1);
    // Obtener el último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Ajustar para que lunes sea 0
    const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Agregar días del mes anterior para completar la primera semana
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(0); // 0 indica día del mes anterior
    }
    
    // Agregar todos los días del mes actual
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    // Completar hasta 35 días (5 semanas)
    const remainingDays = 35 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(0); // 0 indica día del mes siguiente
    }
    
    return days;
  }
} 