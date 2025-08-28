import { Component, Input, signal } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { MenuService } from '../app.menu.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/erp/service/users.service';
import { Message } from 'primeng/api';
import { Store } from '@ngrx/store';
import { selectMensaje } from 'src/app/erp/dashboard/component/state/selectors/mensaje.selectors';
import { selectIndicador } from 'src/app/erp/dashboard/component/state/selectors/indicador.selectors';
import { getIndicadorRequest } from 'src/app/erp/dashboard/component/state/actions/indicador.actions';
import { incrementarRequest } from 'src/app/erp/dashboard/component/state/actions/estado.actions';
import { WeatherService, WeatherData } from './weather.service';
import { IndicatorsComponent } from './indicators.component';
@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    styleUrls: ['./app.config.component.scss'],
   
})
export class AppConfigComponent {
    img       : string = '';
    label     : string = '';
    nombreUsr : string = '';
    nombreEmp : string = '';
    empresa   : string = '';
    rol       : string = '';
    themei    : boolean = true;
    mensajes  : any[]   = [];
    token     : string = '';
    parametros: any[]   = [];
    indicadores: any[] = [];
    val       : boolean = false;
    val2      : boolean = false;
    val3      : boolean = false;
    darkMode  : boolean = false;
    notifications: boolean = true;
    surface: number = 1;
    surfaces: number[] = [1, 2, 3, 4];
    isMobile:boolean = window.innerWidth <= 768;
    isRefreshing: boolean = false;
    weatherData: WeatherData | null = null;
    weatherError: boolean = false;
      

    @Input() minimal: boolean = false;
    scales: number[]          = [12, 13, 14, 15, 16];
    messages: Message[]       = [];

    menuOptions = [
        { label: 'Fijo', value: 'static', icon: 'pi pi-lock' },
        { label: 'Dinámico', value: 'overlay', icon: 'pi pi-sync' }
    ];

    menuTipoOptions = [
        { label: 'Clásico', value: 'clasico', icon: 'pi pi-lock' },
        { label: 'Moderno', value: 'moderno', icon: 'pi pi-sync' }
    ];

    indicadoresEconomicos = {
        dolares: []
    };

    themes = [
        {
            name: 'bootstrap4',
            variants: [
                { label: 'Light Blue', value: 'bootstrap4-light-blue', isDark: false },
                { label: 'Light Purple', value: 'bootstrap4-light-purple', isDark: false },
                { label: 'Dark Blue', value: 'bootstrap4-dark-blue', isDark: true },
                { label: 'Dark Purple', value: 'bootstrap4-dark-purple', isDark: true }
            ]
        },
        {
            name: 'material',
            variants: [
                { label: 'Light Indigo', value: 'md-light-indigo', isDark: false },
                { label: 'Light Deep Purple', value: 'md-light-deeppurple', isDark: false },
                { label: 'Dark Indigo', value: 'md-dark-indigo', isDark: true },
                { label: 'Dark Deep Purple', value: 'md-dark-deeppurple', isDark: true }
            ]
        },
        {
            name: 'lara',
            variants: [
                { label: 'Light Blue', value: 'lara-light-blue', isDark: false },
                { label: 'Light Indigo', value: 'lara-light-indigo', isDark: false },
                { label: 'Light Purple', value: 'lara-light-purple', isDark: false },
                { label: 'Light Teal', value: 'lara-light-teal', isDark: false },
                { label: 'Dark Blue', value: 'lara-dark-blue', isDark: true },
                { label: 'Dark Indigo', value: 'lara-dark-indigo', isDark: true },
                { label: 'Dark Purple', value: 'lara-dark-purple', isDark: true },
                { label: 'Dark Teal', value: 'lara-dark-teal', isDark: true }
            ]
        },
        {
            name: 'saga',
            variants: [
                { label: 'Blue', value: 'saga-blue', isDark: false },
                { label: 'Green', value: 'saga-green', isDark: false },
                { label: 'Orange', value: 'saga-orange', isDark: false },
                { label: 'Purple', value: 'saga-purple', isDark: false }
            ]
        }
    ];

    selectedThemeFamily: string = 'lara';
    selectedThemeVariant: any ;
       

    get currentThemeVariants() {
        return this.themes.find(t => t.name === this.selectedThemeFamily)?.variants || [];
    }

    private readonly STORAGE_KEY_PREFIX = 'app_config_';
    private readonly INDICATORS_STORAGE_KEY = 'indicadores_economicos';

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        private router: Router, 
        private UserService: UsersService,
       // private rest: RestService,
        private store: Store,
        private weatherService: WeatherService
    ) {}

    ngOnInit() {
        const storedConfig = localStorage.getItem(this.getStorageKey());
        
        if(storedConfig){
            const parsedConfig = JSON.parse(storedConfig);
            this.selectedThemeVariant = parsedConfig.themeVariant;
        }else{
            this.selectedThemeVariant = this.themes.find(t => t.name === 'lara')?.variants[0];
        }
        
        const user = this.UserService.getUser();
        this.avatarConfig(user);
        this.token = this.UserService.getToken();
        // Cargar configuración guardada
        this.loadSavedConfig();
        
        // Cargar indicadores económicos
        this.loadIndicatorsFromStorage();
        
        // Cargar datos del clima
        this.loadWeatherData();
        
        this.store.select(selectIndicador).subscribe((indicador : any) => {  
            if(indicador.length > 0 ){
                this.indicadoresEconomicos.dolares = indicador.map((indicador: any) => {
                    const tendencia = indicador.valor_actual.valor > indicador.valor_anterior.valor ? 'up' : 'down';
                    return {
                        label: indicador.codigo,
                        valor: indicador.valor_actual.valor,
                        icono: 'pi pi-dollar',
                        tendencia: tendencia,
                        fecha: indicador.valor_actual.fecha,
                        valorAnterior: indicador.valor_anterior.valor,
                        fechaAnterior: indicador.valor_anterior.fecha
                    };
                });
                
                // Guardar en localStorage
                this.saveIndicatorsToStorage(this.indicadoresEconomicos.dolares);
            } else {
                // Solo hacer request si no hay datos en localStorage para hoy
                if (!this.hasIndicatorsForToday()) {
                    this.store.dispatch(incrementarRequest({ request: 1 }));
                    this.store.dispatch(getIndicadorRequest());
                }
            }
        });
    
   
        // Inicializar estados de los switches
        this.val  = this.menuMode === 'overlay';
        this.val2 = this.inputStyle === 'filled';
        this.val3 = this.menuTipo === 'moderno';

      
        this.layoutService.configUpdate$.subscribe((valor: any) => {
            const storedConf = localStorage.getItem(this.getStorageKey());
            if(storedConf){
                const parsedConfig = JSON.parse(storedConf);
               this.selectedThemeVariant = parsedConfig.themeVariant;
            }else{
                this.selectedThemeVariant = this.themes.find(t => t.name === 'lara')?.variants[0];
            }
        });

        //Escucho cambios de usuario 
        this.UserService.disparador.subscribe((user: any) => {
            this.avatarConfig(user);
        }); 
        
    }

    private getStorageKey(): string {
        return this.STORAGE_KEY_PREFIX + this.nombreUsr;
    }

    private loadSavedConfig() {
        try {
            const savedConfig = localStorage.getItem(this.getStorageKey());
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                // Restaurar tema
                if (config.themeFamily && config.themeVariant) {
                    this.selectedThemeFamily = config.themeFamily;
                    this.selectedThemeVariant = config.themeVariant;
                    this.applyTheme();
                }

                // Restaurar otras configuraciones
                if (config.scale !== undefined) this.scale = config.scale;
                if (config.surface !== undefined) this.surface = config.surface;

                if (config.ripple !== undefined) this.ripple = config.ripple;
                if (config.inputStyle !== undefined) {
                    this.inputStyle = config.inputStyle;
                    this.val2 = config.inputStyle === 'filled';
                }
                if (config.menuMode !== undefined) {
                    this.menuMode = config.menuMode;
                    this.val = config.menuMode === 'overlay';
                }
                if (config.menuTipo !== undefined) {
                    this.menuTipo = config.menuTipo;
                    this.val3 = config.menuTipo === 'moderno';
                }
             
            }
        } catch (error) {
            console.error('Error al cargar la configuración:', error);
        }
    }

    private saveConfig() {
        try {
         
            const config = {    
                themeFamily : this.selectedThemeFamily,
                themeVariant: this.selectedThemeVariant,
                scale       : this.scale,
                ripple      : this.ripple,
                inputStyle  : this.inputStyle,
                menuMode    : this.menuMode,
                surface     : this.surface,
                menuTipo    : this.menuTipo
            };
            
            this.layoutService.config.update((config) => ({
                ...config,
                surface: this.surface,
            }));
            localStorage.setItem(this.getStorageKey(), JSON.stringify(config));
        } catch (error) {
            console.error('Error al guardar la configuración:', error);
        }
    }

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
        this.saveConfig();
    }

    get surface2(): number {
        return this.layoutService.config().surface;
    }
    set surface2(_val: number) {        
        this.layoutService.config.update((config) => ({
            ...config,
            surface: _val,
        }));
        this.saveConfig();
    }



    get menuMode(): string {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
        this.saveConfig();
    }


    get menuTipo(): string {
        return this.layoutService.config().menuTipo;
    }
    set menuTipo(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuTipo: _val,
        }));
        this.saveConfig();
       // console.log('menuTipo', this.menuTipo);
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config().inputStyle = _val;
        this.saveConfig();
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
        this.saveConfig();
    }

    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }
    get theme(): string {
        return this.layoutService.config().theme;
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }
    get colorScheme(): string {
        return this.layoutService.config().colorScheme;
    }

    changeThemeFamily(family: string) {
        this.selectedThemeFamily = family;
        this.selectedThemeVariant = this.themes.find(t => t.name === family)?.variants[0];
        this.applyTheme();
        this.saveConfig();
    }

    changeThemeVariant(variant: any) {
        this.selectedThemeVariant = variant;
        this.applyTheme();
        this.saveConfig();
    }

    applyTheme() {
        if (this.selectedThemeVariant) {
            this.theme = this.selectedThemeVariant.value;
            this.colorScheme = this.selectedThemeVariant.isDark ? 'dark' : 'light';
            this.themei = !this.selectedThemeVariant.isDark;           
            //this.layoutService.disparador.emit(this.themei);
        }
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
        
    }

    decrementSurface() {
        this.surface--;
        this.surface2 = this.surface;
    }

    incrementSurface() {
        this.surface++;
        this.surface2 = this.surface;
    }

    showMenuModeButton = signal(!this.router.url.includes('auth'));

    avatarConfig(user: any){
       
            this.nombreUsr = user.usuario || '';
            this.rol = user.rol || '';
            this.img = user.img || '';
            this.nombreEmp = (user.empNom || '') + ' ' + (user.empApe || '');
            this.empresa = user.empresa || '';
            
            if (!this.img || this.img.length === 0) {
                this.label = this.nombreUsr ? this.nombreUsr.substring(0,1) : '';
            }
        

    }



    // Método para refrescar indicadores
    refreshIndicators() {
        this.isRefreshing = true;
        
        // Limpiar localStorage para forzar nueva carga
        this.clearIndicatorsStorage();
        
        // Hacer request para obtener datos frescos
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(getIndicadorRequest());
        
        // Simular tiempo de carga
        setTimeout(() => {
            this.isRefreshing = false;
        }, 2000);
    }

    // Método para agregar evento al calendario (maqueta)
    addEvent() {
        // Aquí se implementaría la lógica para agregar eventos
        console.log('Agregar evento al calendario');
        // Se podría abrir un modal o navegar a una página de eventos
    }

    // Método para ver calendario completo (maqueta)
    viewFullCalendar() {
        // Aquí se implementaría la lógica para ver el calendario completo
       // console.log('Ver calendario completo');
        // Se podría navegar a una página dedicada al calendario
    }

    // Métodos para manejar localStorage de indicadores económicos
    private loadIndicatorsFromStorage() {
        try {
            const storedData = localStorage.getItem(this.INDICATORS_STORAGE_KEY);
            if (storedData) {
                const data = JSON.parse(storedData);
                const today = new Date().toDateString();
                
                // Verificar si los datos son de hoy
                if (data.fecha === today && data.indicadores && data.indicadores.length > 0) {
                    this.indicadoresEconomicos.dolares = data.indicadores;
               //     console.log('Indicadores cargados desde localStorage');
                    return;
                }
            }
        } catch (error) {
            console.error('Error al cargar indicadores desde localStorage:', error);
        }
        
        // Si no hay datos válidos en localStorage, hacer request
        this.store.dispatch(incrementarRequest({ request: 1 }));
        this.store.dispatch(getIndicadorRequest());
    }

    private saveIndicatorsToStorage(indicadores: any[]) {
        try {
            const data = {
                fecha: new Date().toDateString(),
                indicadores: indicadores,
                timestamp: new Date().getTime()
            };
            localStorage.setItem(this.INDICATORS_STORAGE_KEY, JSON.stringify(data));
           // console.log('Indicadores guardados en localStorage');
        } catch (error) {
            console.error('Error al guardar indicadores en localStorage:', error);
        }
    }

    private hasIndicatorsForToday(): boolean {
        try {
            const storedData = localStorage.getItem(this.INDICATORS_STORAGE_KEY);
            if (storedData) {
                const data = JSON.parse(storedData);
                const today = new Date().toDateString();
                return data.fecha === today && data.indicadores && data.indicadores.length > 0;
            }
        } catch (error) {
            console.error('Error al verificar indicadores en localStorage:', error);
        }
        return false;
    }

    // Método para limpiar localStorage de indicadores (útil para testing)
    clearIndicatorsStorage() {
        localStorage.removeItem(this.INDICATORS_STORAGE_KEY);
       // console.log('Indicadores eliminados del localStorage');
    }

    // Métodos para manejar el clima
    private loadWeatherData() {
        // Primero intentar cargar desde localStorage
        const storedWeather = this.weatherService.loadWeatherFromStorage();
        if (storedWeather) {
            this.weatherData = storedWeather;
            this.weatherError = false;
           // console.log('Clima cargado desde localStorage');
            return;
        }

        // Si no hay datos en localStorage, hacer request a la API
        this.weatherService.getWeatherData().subscribe({
            next: (weatherData) => {
                this.weatherData = weatherData;
                this.weatherError = false;
                this.weatherService.saveWeatherToStorage(weatherData);
               //  console.log('Clima obtenido de la API');
            },
            error: (error) => {
                this.weatherError = true;
               // console.error('Error obteniendo datos del clima:', error);
            }
        });
    }





    // Método para refrescar datos del clima
    refreshWeather() {
        this.weatherService.clearWeatherStorage();
        this.loadWeatherData();
    }

    // Método para probar que la API no sea interceptada
    testWeatherInterceptor() {
     //   console.log('Probando exclusión del interceptor para OpenWeatherMap...');
        this.weatherService.testWeatherAPI().subscribe({
            next: (response) => {
                console.log('✅ Éxito: La URL no fue interceptada', response);
            },
            error: (error) => {
                console.error('❌ Error en la prueba:', error);
            }
        });
    }


}
