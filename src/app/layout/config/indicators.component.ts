import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WeatherService, WeatherData } from './weather.service';

@Component({
    selector: 'app-indicators',
    templateUrl: './indicators.component.html',
    styleUrls: ['./indicators.component.scss']
})
export class IndicatorsComponent {
    @Input() indicadoresEconomicos: any = { dolares: [] };
    @Input() weatherData: WeatherData | null = null;
    @Input() weatherError: boolean = false;
    @Input() isRefreshing: boolean = false;
    
    @Output() refreshIndicators = new EventEmitter<void>();

    constructor(private weatherService: WeatherService) {}

    // Método para formatear moneda chilena
    formatCurrency(value: number): string {
        if (!value && value !== 0) return '0';
        
        const numStr = value.toString();
        const parts = numStr.split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        if (parts.length > 1) {
            return `${integerPart},${parts[1]}`;
        }
        
        return integerPart;
    }

    // Método para calcular el porcentaje de cambio
    getChangePercentage(indicador: any): string {
        if (!indicador.valorAnterior || indicador.valorAnterior === 0) return '0,00';
        
        const current = parseFloat(indicador.valor);
        const previous = parseFloat(indicador.valorAnterior);
        const change = ((current - previous) / previous) * 100;
        
        return change.toFixed(2).replace('.', ',');
    }

    // Método para asignar clases CSS según el tipo de indicador
    getIndicatorClass(label: string): string {
        const labelLower = label.toLowerCase();
        
        if (labelLower.includes('usd') || labelLower.includes('dólar')) {
            return 'indicator-usd';
        } else if (labelLower.includes('uf')) {
            return 'indicator-uf';
        } else if (labelLower.includes('euro')) {
            return 'indicator-euro';
        } else if (labelLower.includes('ipc')) {
            return 'indicator-ipc';
        }
        
        return '';
    }

    // Método para obtener el icono del clima basado en el código de OpenWeatherMap
    getWeatherIcon(iconCode: string): string {
        const iconMap: { [key: string]: string } = {
            '01d': 'pi pi-sun text-yellow-400',
            '01n': 'pi pi-moon text-blue-400',
            '02d': 'pi pi-cloud text-blue-400',
            '02n': 'pi pi-cloud text-blue-400',
            '03d': 'pi pi-cloud text-gray-400',
            '03n': 'pi pi-cloud text-gray-400',
            '04d': 'pi pi-cloud text-gray-500',
            '04n': 'pi pi-cloud text-gray-500',
            '09d': 'pi pi-cloud-rain text-blue-500',
            '09n': 'pi pi-cloud-rain text-blue-500',
            '10d': 'pi pi-cloud-rain text-blue-500',
            '10n': 'pi pi-cloud-rain text-blue-500',
            '11d': 'pi pi-bolt text-yellow-500',
            '11n': 'pi pi-bolt text-yellow-500',
            '13d': 'pi pi-snowflake text-blue-300',
            '13n': 'pi pi-snowflake text-blue-300',
            '50d': 'pi pi-cloud text-gray-400',
            '50n': 'pi pi-cloud text-gray-400'
        };

        return iconMap[iconCode] || 'pi pi-cloud text-blue-400';
    }

    // Método para optimizar el rendimiento del *ngFor
    trackByIndicator(index: number, indicador: any): string {
        return indicador.label || index;
    }

    // Método para refrescar indicadores
    onRefreshIndicators() {
        this.refreshIndicators.emit();
    }
} 