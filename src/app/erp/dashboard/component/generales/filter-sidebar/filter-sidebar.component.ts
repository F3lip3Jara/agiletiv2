import { Component, Input, OnInit, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';

interface ColumnDefinition {
  campo: string;
  label: string;
  data_type: string;
  sortable?: boolean;
  sortOrder?: 'asc' | 'desc' | null;
}

interface FilterValue {
  column: string;
  operator?: string;
  values: string[];
}

interface FilterRule {
  id: string;
  column: string;
  operator: string;
  values: any[];
  matchType: 'exact' | 'partial';
}

interface SortColumn {
  column: string;
  direction: 'asc' | 'desc';
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
    filterRules: FilterRule[];
    columnFilterRules: { [key: string]: FilterRule };
    sorting: SortColumn[];
    columnSortStates: { [key: string]: 'asc' | 'desc' | null };
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
    OverlayPanelModule,
    DropdownModule,
    CheckboxModule,
    InputSwitchModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSidebarComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() filterApplied = new EventEmitter<FilterValue[]>();
  @Output() sortApplied = new EventEmitter<SortColumn[]>();
  @Output() filterRulesApplied = new EventEmitter<FilterRule[]>();
  @Input() COMPONENT_SELECTOR: string = '';
  @Input() data: any[] = [];

  filterValues: { [key: string]: any[] } = {};
  dateRanges: { [key: string]: DateRange } = {};
  filterRules: FilterRule[] = [];
  sorting: SortColumn[] = [];
  columnFilterRules: { [key: string]: FilterRule } = {};
  columnSortStates: { [key: string]: 'asc' | 'desc' | null } = {};
  activeFilters: number = 0;
  activeAccordionIndexes: number[] = [0]; // Iniciar con el primer acordeón abierto
  savedQueries: SavedQuery[] = [];
  queryName: string = '';
  readonly STORAGE_KEY = 'filter_sidebar_saved_queries';
  daysDifference: number = 0;
  readonly MAX_RECORDS = 5000;
  columns: ColumnDefinition[] = [];
  
  // Operadores disponibles por tipo de dato
  textOperators = [
    { value: 'like', label: 'Contiene' },
   // { value: '!=', label: 'No contiene' },
    { value: '=', label: 'Es igual a' },
    { value: '!=', label: 'No es igual a' },
    //{ value: 'starts_with', label: 'Comienza con' },
   // { value: 'ends_with', label: 'Termina con' }
  ];
  
  numericOperators = [
    { value: '=', label: 'Es igual a (=)' },
    { value: '!=', label: 'No es igual a (≠)' },
    { value: '>', label: 'Mayor que (>)' },
    { value: '<', label: 'Menor que (<)' },
    { value: '>=', label: 'Mayor o igual que (≥)' },
    { value: '<=', label: 'Menor o igual que (≤)' }
  ];

  dateOperators = [
    { value: '=', label: 'La fecha es' },
    { value: '!=', label: 'La fecha no es' },
    { value: '<=', label: 'La fecha es anterior' },
    { value: '>=', label: 'La fecha es posterior' },
    { value: 'between', label: 'Entre fechas' }
  ];
  
  booleanOperators = [
    { value: '=', label: 'Es verdadero' },
    { value: '!=', label: 'Es falso' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    console.log(this.data);
  }

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
    
    // Si se está abriendo el sidebar, abrir el primer acordeón
    if (this.visible) {
      this.activeAccordionIndexes = [0];
    }
  }

  onSidebarHide() {
    this.visible = false;
    this.visibleChange.emit(false);
    // Mantener el estado del acordeón al cerrar
  }

  // Método optimizado para manejar cambios en el acordeón
  onAccordionChange(event: any) {
    // Validar que el evento tenga la estructura esperada
    if (event && typeof event.index !== 'undefined') {
      this.activeAccordionIndexes = Array.isArray(event.index) ? event.index : [event.index];
    }
  }

  // Método optimizado para expandir/contraer todos los acordeones
  toggleAllAccordions() {
    const totalTabs = 3; // Filtros Generales, Ordenamiento, Filtros Avanzados, Consultas Guardadas
    
    if (this.activeAccordionIndexes.length === 0) {
      // Expandir todos los acordeones
      this.activeAccordionIndexes = Array.from({ length: totalTabs }, (_, i) => i);
    } else {
      // Contraer todos los acordeones
      this.activeAccordionIndexes = [];
    }
  }

  // Método para obtener el estado del botón expandir/contraer
  getExpandCollapseIcon(): string {
    return this.activeAccordionIndexes.length === 0 ? 'pi pi-plus' : 'pi pi-minus';
  }

  // Método para obtener el tooltip del botón expandir/contraer
  getExpandCollapseTooltip(): string {
    return this.activeAccordionIndexes.length === 0 
      ? 'Expandir todos los filtros' 
      : 'Contraer todos los filtros';
  }

  // Método de tracking optimizado para bucles
  trackByColumn(index: number, column: ColumnDefinition): string {
    return column.campo;
  }

  trackByRule(index: number, rule: FilterRule): string {
    return rule.id;
  }

  trackBySort(index: number, sort: SortColumn): string {
    return sort.column;
  }

  ngOnInit() {
    this.initializeColumns();
    this.initializeDateRanges();
    this.loadSavedQueries();
    this.initializeAccordion();
  }

  private initializeColumns(): void {
    this.columns = this.data || [];

    this.columnSortStates = {};
    
    this.columns.forEach(col => {
      // Inicializar valores de filtro tradicionales
      this.filterValues[col.campo] = [];
      
      // Inicializar rangos de fecha si es necesario
      if (this.getInputType(col.data_type) === 'datetime') {
        this.dateRanges[col.campo] = { from: null, to: null };
      }
      
      // Inicializar reglas de filtrado por columna
      this.columnFilterRules[col.campo] = {
        id: `col_rule_${col.campo}`,
        column: col.campo,
        operator: this.getDefaultOperator(col.data_type),
        values: [],
        matchType: 'partial'
      };
      
      // Inicializar estado de ordenamiento
      this.columnSortStates[col.campo] = null;
    });
  }

  private initializeDateRanges(): void {
    // Establecer fechas por defecto
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    this.dateRanges['created_at'] = {
      from: sixtyDaysAgo,
      to: today
    };
    
    this.updateDaysDifference();
    this.onDateRangeChange('created_at', this.dateRanges['created_at']);
  }

  private initializeAccordion(): void {
    // Asegurar que el primer acordeón esté abierto por defecto
    this.activeAccordionIndexes = [0];
  }

  getInputType(dataType: string): string {
    switch (dataType) {
      case 'int':
      case 'bigint':
      case 'decimal':
      case 'float':
      case 'double':
        return 'number';
      case 'timestamp':
      case 'time':
      case 'date':
        return 'datetime';
      case 'boolean':
      case 'tinyint':
        return 'boolean';
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
    const traditionalFilters = Object.values(this.filterValues)
      .filter(values => values && values.length > 0).length;
    
    const columnRuleFilters = Object.values(this.columnFilterRules)
      .filter(rule => rule.values && rule.values.length > 0).length;
    
    const ruleFilters = this.filterRules.length;
    const sortFilters = this.sorting.length;
    
    this.activeFilters = traditionalFilters + columnRuleFilters + ruleFilters + sortFilters;
  }

  applyFilter() {
    // Usar el nuevo método que incluye todas las funcionalidades
    this.applyAllFilters();
  }

  clearFilter() {
    // Usar el nuevo método que limpia todos los filtros
    this.clearAllFilters();
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
      dateRanges: this.dateRanges,
      filterRules: this.filterRules,
      columnFilterRules: this.columnFilterRules,
      sorting: this.sorting,
      columnSortStates: this.columnSortStates
      },
      description: this.generateQueryDescription()
    };

    // Debug: Mostrar estructura de la consulta
    console.log('Guardando consulta:', {
      name: newQuery.name,
      filters: newQuery.filters,
      description: newQuery.description
    });

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
    // Limpiar todos los filtros actuales
    this.clearAllFilters();
    
    // Restaurar los filtros guardados con objetos mutables
    this.filterValues = { ...(query.filters.filterValues || {}) };
    this.dateRanges = { ...(query.filters.dateRanges || {}) };
    
    // Restaurar reglas de filtrado si existen
    if (query.filters.filterRules) {
      this.filterRules = query.filters.filterRules.map(rule => ({
        id: rule.id,
        column: rule.column,
        operator: rule.operator,
        values: [...(rule.values || [])],
        matchType: rule.matchType
      }));
    }
    
    // Restaurar reglas de columna si existen - crear objetos mutables
    if (query.filters.columnFilterRules) {
      this.columnFilterRules = {};
      Object.entries(query.filters.columnFilterRules).forEach(([key, rule]) => {
        this.columnFilterRules[key] = {
          id: rule.id,
          column: rule.column,
          operator: rule.operator,
          values: [...(rule.values || [])],
          matchType: rule.matchType
        };
      });
    }
    
    // Restaurar ordenamiento si existe - crear objetos mutables
    if (query.filters.sorting) {
      this.sorting = query.filters.sorting.map(sort => ({
        column: sort.column,
        direction: sort.direction
      }));
    }
    
    // Restaurar estados de ordenamiento si existen
    if (query.filters.columnSortStates) {
      this.columnSortStates = { ...(query.filters.columnSortStates) };
    }
    
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
    const descriptions: string[] = [];
    
    // Agregar filtros de columna con operadores
    Object.entries(this.columnFilterRules).forEach(([campo, rule]) => {
      if (rule.values && rule.values.length > 0) {
        const column = this.columns.find(col => col.campo === campo);
        const operatorLabel = this.getOperatorLabel(rule.operator, column?.data_type || 'varchar');
        descriptions.push(`${column?.label} ${operatorLabel} ${rule.values.join(', ')}`);
      }
    });
    
    // Agregar filtros tradicionales
    Object.entries(this.filterValues).forEach(([campo, values]) => {
      if (values && values.length > 0) {
        const column = this.columns.find(col => col.campo === campo);
        if (!this.columnFilterRules[campo] || !this.columnFilterRules[campo].values?.length) {
          descriptions.push(`${column?.label}: ${values.join(', ')}`);
        }
      }
    });
    
    // Agregar ordenamiento
    if (this.sorting.length > 0) {
      const sortDescriptions = this.sorting.map(sort => {
        const column = this.columns.find(col => col.campo === sort.column);
        const direction = sort.direction === 'asc' ? '↑' : '↓';
        return `${column?.label} ${direction}`;
      });
      descriptions.push(`Orden: ${sortDescriptions.join(', ')}`);
    }
    
    return descriptions.join(' | ') || 'Sin filtros aplicados';
  }

  private getOperatorLabel(operator: string, dataType: string): string {
    const inputType = this.getInputType(dataType);
    let operators: any[] = [];
    
    switch (inputType) {
      case 'number':
        operators = this.numericOperators;
        break;
      case 'datetime':
        operators = this.dateOperators;
        break;
      case 'boolean':
        operators = this.booleanOperators;
        break;
      default:
        operators = this.textOperators;
    }
    
    const operatorObj = operators.find(op => op.value === operator);
    return operatorObj ? operatorObj.label : operator;
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

  // Métodos para ordenamiento de columnas
  toggleColumnSort(column: ColumnDefinition) {
    const existingSort = this.sorting.find(s => s.column === column.campo);
    const currentState = this.columnSortStates[column.campo];
    
    if (existingSort) {
      if (existingSort.direction === 'asc') {
        // Crear nuevo array con dirección cambiada
        this.sorting = this.sorting.map(sort => 
          sort.column === column.campo 
            ? { column: column.campo, direction: 'desc' as 'desc' }
            : sort
        );
        this.columnSortStates[column.campo] = 'desc';
      } else if (existingSort.direction === 'desc') {
        // Remover el ordenamiento
        this.sorting = this.sorting.filter(s => s.column !== column.campo);
        this.columnSortStates[column.campo] = null;
        this.updateActiveFiltersCount();
        this.sortApplied.emit(this.sorting);
        return;
      }
    } else {
      // Crear nuevo array con el nuevo elemento
      this.sorting = [...this.sorting, { column: column.campo, direction: 'asc' }];
      this.columnSortStates[column.campo] = 'asc';
    }
    
    this.updateActiveFiltersCount();
    this.sortApplied.emit(this.sorting);
  }

  getSortIcon(column: ColumnDefinition): string {
    const sortState = this.columnSortStates[column.campo];
    if (!sortState) return 'pi pi-sort-alt';
    return sortState === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down';
  }

  getColumnLabel(columnName: string): string {
    const column = this.columns.find(c => c.campo === columnName);
    return column ? column.label : columnName;
  }

  removeSorting(columnName: string) {
   
    this.sorting = this.sorting.filter(s => s.column !== columnName);
    this.columnSortStates[columnName] = null;
    this.updateActiveFiltersCount();
    this.sortApplied.emit(this.sorting);
  }

  toggleSortDirection(columnName: string) {
    const column = this.columns.find(c => c.campo === columnName);
    if (column) {
      const existingSort = this.sorting.find(s => s.column === columnName);
      if (existingSort) {
        // Crear nuevo array con dirección cambiada
        const newDirection = existingSort.direction === 'asc' ? 'desc' : 'asc';
        this.sorting = this.sorting.map(sort => 
          sort.column === columnName 
            ? { column: columnName, direction: newDirection as 'asc' | 'desc' }
            : sort
        );
        this.columnSortStates[columnName] = newDirection;
        this.updateActiveFiltersCount();
        this.sortApplied.emit(this.sorting);
      }
    }
  }

  getOperatorsForRule(rule: FilterRule): any[] {
    const column = this.columns.find(c => c.campo === rule.column);
    return this.getOperatorsForDataType(column?.data_type || 'varchar');
  }

  isTextRule(rule: FilterRule): boolean {
    const column = this.columns.find(c => c.campo === rule.column);
    return this.getInputType(column?.data_type || 'varchar') === 'text';
  }

  // Métodos para manejar reglas unificadas por columna
  getColumnFilterRule(columnName: string): FilterRule {
    return this.columnFilterRules[columnName] || {
      id: `col_rule_${columnName}`,
      column: columnName,
      operator: 'contains',
      values: [],
      matchType: 'partial'
    };
  }

  updateColumnFilterRule(columnName: string, field: keyof FilterRule, value: any) {
    if (!this.columnFilterRules[columnName]) {
      this.columnFilterRules[columnName] = {
        id: `col_rule_${columnName}`,
        column: columnName,
        operator: 'contains',
        values: [],
        matchType: 'partial'
      };
    }
    
    // Crear nuevo objeto con el campo actualizado
    this.columnFilterRules[columnName] = {
      ...this.columnFilterRules[columnName],
      [field]: value
    };
    
    // Sincronizar con filterValues para compatibilidad
    if (field === 'values') {
      this.filterValues[columnName] = value || [];
    }
    
    this.updateActiveFiltersCount();
  }

  updateColumnFilterValues(columnName: string, values: any[]) {
    this.updateColumnFilterRule(columnName, 'values', values);
  }

  clearColumnFilter(columnName: string) {
    this.updateColumnFilterRule(columnName, 'values', []);
    
    // Limpiar también en filterValues y dateRanges para compatibilidad
    this.filterValues[columnName] = [];
    if (this.dateRanges[columnName]) {
      this.dateRanges[columnName] = { from: null, to: null };
    }
    this.updateActiveFiltersCount();
    this.applyAllFilters();
  }

  // Métodos para reglas de filtrado
  addFilterRule() {
    const newRule: FilterRule = {
      id: `rule_${Date.now()}`,
      column: this.columns[0]?.campo || '',
      operator: this.getDefaultOperator(this.columns[0]?.data_type || 'varchar'),
      values: [],
      matchType: 'partial'
    };
    this.filterRules.push(newRule);
    this.updateActiveFiltersCount();
  }

  removeFilterRule(ruleId: string) {
    this.filterRules = this.filterRules.filter(rule => rule.id !== ruleId);
    this.updateActiveFiltersCount();
  }

  updateFilterRule(ruleId: string, field: keyof FilterRule, value: any) {
    const rule = this.filterRules.find(r => r.id === ruleId);
    if (rule) {
      rule[field] = value;
      this.updateActiveFiltersCount();
    }
  }

  getOperatorsForDataType(dataType: string): any[] {
    const inputType = this.getInputType(dataType);
    switch (inputType) {
      case 'number':
        return this.numericOperators;
      case 'datetime':
        return this.dateOperators;
      case 'boolean':
        return this.booleanOperators;
      default:
        return this.textOperators;
    }
  }

  getDefaultOperator(dataType: string): string {
    const inputType = this.getInputType(dataType);
    switch (inputType) {
      case 'number':
        return '=';
      case 'datetime':
        return '=';
      case 'boolean':
        return '=';
      default:
        return 'like';
    }
  }

  getInputComponentForRule(rule: FilterRule): string {
    const column = this.columns.find(col => col.campo === rule.column);
    if (!column) return 'text';
    
    const inputType = this.getInputType(column.data_type);
    
    // Para operadores boolean, mostrar checkbox
    if (inputType === 'boolean' || rule.operator === 'equals' && column.data_type === 'boolean') {
      return 'boolean';
    }
    
    // Para fechas
    if (inputType === 'datetime' || rule.operator.includes('date')) {
      return 'date';
    }
    
    // Para números
    if (inputType === 'number' || rule.operator.includes('greater') || rule.operator.includes('less')) {
      return 'number';
    }
    
    return 'text';
  }

  applyFilterRules() {
    this.filterRulesApplied.emit(this.filterRules);
  }

  clearFilterRules() {
    this.filterRules = [];
  }

  // Método mejorado para aplicar filtros que incluye reglas
  applyAllFilters() {

   
    const filters: FilterValue[] = [];
    const processedColumns = new Set<string>();
    
    // Procesar reglas de columna unificadas (prioridad)
    Object.entries(this.columnFilterRules).forEach(([column, rule]) => {
      if (rule.values && rule.values.length > 0) {
        filters.push({
          column:column.trim(),
          operator: rule.operator,
          values: rule.values.map(v => v.toString())
       
        });
        processedColumns.add(column);
      }
    });
    
    // Procesar filtros tradicionales solo si no fueron procesados por columnFilterRules
    Object.entries(this.filterValues).forEach(([column, values]) => {
      if (!processedColumns.has(column) && values && (Array.isArray(values) ? values.length > 0 : values)) {
        const valuesArray = Array.isArray(values) ? values : [values];
        const columnDef = this.columns.find(c => c.campo === column);
        filters.push({
          column,
          operator: this.getDefaultOperator(columnDef?.data_type || 'varchar'),
          values: valuesArray.map(v => v.toString()),
          
        });
      }
    });
    
    // Convertir reglas de columna a reglas de filtrado para el backend
    const allFilterRules: FilterRule[] = [];
    Object.values(this.columnFilterRules).forEach(rule => {
      if (rule.values && rule.values.length > 0) {
        allFilterRules.push(rule);
      }
    });
    
    // Debug: Mostrar filtros que se están aplicando
   /*- console.log('Aplicando filtros:', {
      filters: filters,
      sorting: this.sorting,
      filterRules: allFilterRules
    });*/
    
    // Emitir solo los filtros unificados con operadores
    const filter : any = {
      filters: filters,
      sorting: this.sorting,
      filterRules: allFilterRules
    };

    this.filterApplied.emit(filter);   
    this.visibleChange.emit(false);
    
    // Mantener el estado del acordeón después de aplicar filtros
    setTimeout(() => {
      if (this.activeAccordionIndexes.length === 0) {
        this.activeAccordionIndexes = [0];
      }
    }, 100);
  }

  clearFiletersClick() {
    this.clearAllFilters();
    this.applyAllFilters();
  }

  // Método mejorado para limpiar todos los filtros
  clearAllFilters() {
    Object.keys(this.filterValues).forEach(key => {
      this.filterValues[key] = [];
      if (this.dateRanges[key]) {
        this.dateRanges[key] = { from: null, to: null };
      }
    });
    
    // Limpiar reglas de columna creando nuevos objetos
    Object.keys(this.columnFilterRules).forEach(key => {
      this.columnFilterRules[key] = {
        id: this.columnFilterRules[key].id,
        column: key,
        operator: this.getDefaultOperator(
          this.columns.find(col => col.campo === key)?.data_type || 'varchar'
        ),
        values: [],
        matchType: 'partial'
      };
    });
    
    this.filterRules = [];
    this.sorting = [];
    
    // Limpiar estados de ordenamiento de columnas
    Object.keys(this.columnSortStates).forEach(key => {
      this.columnSortStates[key] = null;
    });
    
    this.activeFilters = 0;
   
    
    // Establecer fechas por defecto
    const today = new Date();
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    this.dateRanges['created_at'] = {
      from: sixtyDaysAgo,
      to: today
    };

   
  }
}
