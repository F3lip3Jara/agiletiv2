import { Component, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ChipsModule } from 'primeng/chips';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { OverlayPanelModule } from 'primeng/overlaypanel';

interface ColumnDefinition {
  campo: string;
  label: string;
  data_type: string;
}

interface FilterValue {
  column: string;
  values: string[];
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface SavedQuery {
  id: string;
  createdAt: string;
  name: string;
  componentSelector: string;
  filters: {
    filterValues: { [key: string]: any[] };
    dateRanges: { [key: string]: DateRange };
  };
  description: string;
}

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    ChipsModule,
    AccordionModule,
    CalendarModule,
    InputNumberModule,
    DividerModule,
    ScrollPanelModule,
    BadgeModule,
    TooltipModule,
    RippleModule,
    ConfirmPopupModule,
    ToastModule,
    OverlayPanelModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filterApplied = new EventEmitter<FilterValue[]>();
  @Input() COMPONENT_SELECTOR: string = '';
  @Input() data: any[] = [];

  filterValues: { [key: string]: any[] } = {};
  dateRanges: { [key: string]: DateRange } = {};
  activeFilters: number = 0;
  activeAccordionIndexes: number[] = []; // Iniciar con todos los acordeones cerrados
  savedQueries: SavedQuery[] = [];
  queryName: string = '';
  readonly STORAGE_KEY = 'filter_sidebar_saved_queries';
  daysDifference: number = 0;
  readonly MAX_RECORDS = 5000;
  columns: ColumnDefinition[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Ctrl + A
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault(); // Prevenir el comportamiento por defecto
      this.toggleVisibility();
    }
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.visibleChange.emit(this.visible);
    
    // Si se está abriendo el sidebar, resetear los acordeones a cerrados
    if (this.visible) {
      this.activeAccordionIndexes = [];
    }
  }

  onSidebarHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    // Resetear los acordeones a cerrados cuando se cierra el sidebar
    this.activeAccordionIndexes = [];
  }

  ngOnInit() {
   // console.log(this.data);
    this.columns = this.data;
    this.columns.forEach(col => {
      this.filterValues[col.campo] = [];
      if (this.getInputType(col.data_type) === 'datetime') {
        this.dateRanges[col.campo] = { from: null, to: null };
      }
    });

    // Establecer fechas por defecto
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    this.dateRanges['created_at'] = {
      from: sixtyDaysAgo,
      to: today
    };
    this.updateDaysDifference();
   // console.log(this.dateRanges['created_at'].to);
    this.onDateRangeChange('created_at', this.dateRanges['created_at']);
    this.loadSavedQueries();
  }

  getInputType(dataType: string): string {
    switch (dataType) {
      case 'int':
      case 'bigint':
        return 'number';
      case 'timestamp':
      case 'time':
        return 'datetime';
      default:
        return 'text';
    }
  }


  private processFilterValues(values: any[]): any[] {
    return values.flatMap(value => {
      if (typeof value === 'string') {
        return value.split(',')
          .map(v => v.trim())
          .filter(v => v.length > 0);
      }
      return [value];
    });
  }

  onFilterChange(campo: string, values: any[]) {
    this.filterValues[campo] = this.processFilterValues(values);
    this.updateActiveFiltersCount();
  }

  onDateRangeChange(campo: string, range: DateRange) {
   // console.log(range);
    // Validar que la fecha desde no sea mayor a la fecha hasta
    if (range.from && range.to && range.from > range.to) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La fecha inicial no puede ser mayor a la fecha final'
      });
      return;
    }

    this.dateRanges[campo] = range;
    if (range.from || range.to) {
      this.filterValues[campo] = [
        range.from ? range.from.toISOString() : '',
        range.to ? range.to.toISOString() : ''
      ].filter(date => date !== '');
    } else {
      this.filterValues[campo] = [];
    }
    this.updateActiveFiltersCount();
    this.updateDaysDifference();
  }

  updateActiveFiltersCount() {
    this.activeFilters = Object.values(this.filterValues)
      .filter(values => values && values.length > 0).length;
  }

  applyFilter() {
    const filters: FilterValue[] = [];
    
    Object.entries(this.filterValues).forEach(([column, values]) => {
      if (values && (Array.isArray(values) ? values.length > 0 : values)) {
        const valuesArray = Array.isArray(values) ? values : [values];
        filters.push({
          column,
          values: valuesArray.map(v => v.toString())
        });
      }
    });
    this.filterApplied.emit(filters);
    this.visibleChange.emit(false);

   
  }

  clearFilter() {
    Object.keys(this.filterValues).forEach(key => {
      this.filterValues[key] = [];
      if (this.dateRanges[key]) {
        this.dateRanges[key] = { from: null, to: null };
      }
    });
    this.activeFilters = 0;
    this.filterApplied.emit([]);
       // Establecer fechas por defecto
       const today = new Date();
       const sixtyDaysAgo = new Date();
       sixtyDaysAgo.setDate(today.getDate() - 60);
       
       this.dateRanges['created_at'] = {
         from: sixtyDaysAgo,
         to: today
       };
       
  }

  clearSingleFilter(campo: string) {
    this.filterValues[campo] = [];
    if (this.dateRanges[campo]) {
      this.dateRanges[campo] = { from: null, to: null };
    }
    this.updateActiveFiltersCount();
  }

  // Funciones para manejar consultas guardadas
  private loadSavedQueries(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const allQueries = JSON.parse(saved);
      // Filtrar solo las consultas del componente actual
      this.savedQueries = allQueries.filter((query: SavedQuery) => 
        query.componentSelector === this.COMPONENT_SELECTOR
      );
    }
  }

  showSaveQuery(event: Event, op: any): void {
    if (this.activeFilters === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'No hay filtros activos para guardar'
      });
      return;
    }
    this.queryName = '';
    op.toggle(event);
  }

  saveCurrentQuery(op: any): void {
    if (!this.queryName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, ingrese un nombre para la consulta'
      });
      return;
    }

    const newQuery: SavedQuery = {
      id: `query_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('es-ES'),
      name: this.queryName.trim(),
      componentSelector: this.COMPONENT_SELECTOR,
      filters: {
        filterValues: this.filterValues,
        dateRanges: this.dateRanges
      },
      description: this.generateQueryDescription()
    };

    // Cargar consultas existentes
    const existingQueries = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    existingQueries.push(newQuery);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingQueries));

    // Actualizar lista local
    this.savedQueries.unshift(newQuery);
    this.queryName = '';
    op.hide();

    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Consulta guardada correctamente'
    });
  }

  deleteQuery(event: Event, query: SavedQuery): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar esta consulta?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Eliminar de localStorage
        const existingQueries = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const updatedQueries = existingQueries.filter((q: SavedQuery) => q.id !== query.id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedQueries));

        // Actualizar lista local
        this.savedQueries = this.savedQueries.filter(q => q.id !== query.id);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Consulta eliminada correctamente'
        });
      }
    });
  }

  applyQuery(query: SavedQuery): void {
    // Restaurar los filtros guardados
    this.filterValues = JSON.parse(JSON.stringify(query.filters.filterValues));
   // console.log(this.filterValues);
    this.dateRanges = JSON.parse(JSON.stringify(query.filters.dateRanges));
    //console.log(query);
    // Convertir las fechas de string a Date
    Object.entries(this.dateRanges).forEach(([key, range]) => {
      if (range.from) range.from = new Date(range.from);
      if (range.to) range.to = new Date(range.to);
    });

    // Asegurar que todos los valores sean arrays
    Object.entries(this.filterValues).forEach(([key, value]) => {
      if (!Array.isArray(value)) {
        this.filterValues[key] = [value];
      }
    });
    
    this.updateActiveFiltersCount();
    this.updateDaysDifference();
    this.applyFilter();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: 'Filtros aplicados desde consulta guardada'
    });
  }

  private generateQueryDescription(): string {
    const activeFilters = Object.entries(this.filterValues)
      .filter(([_, values]) => values && values.length > 0)
      .map(([campo, values]) => {
        const column = this.columns.find(col => col.campo === campo);
        return `${column?.label}: ${values.join(', ')}`;
      });

    return activeFilters.join(' | ');
  }

  private updateDaysDifference() {
    const from = this.dateRanges['created_at'].from;
    const to = this.dateRanges['created_at'].to;
    
    if (from && to) {
      const diffTime = Math.abs(to.getTime() - from.getTime());
      this.daysDifference = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      this.daysDifference = 0;
    }
  }
}
