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
    darkMode  : boolean = false;
    notifications: boolean = true;
      

    @Input() minimal: boolean = false;
    scales: number[]          = [12, 13, 14, 15, 16];
    messages: Message[]       = [];

    menuOptions = [
        { label: 'Fijo', value: 'static', icon: 'pi pi-lock' },
        { label: 'Dinámico', value: 'overlay', icon: 'pi pi-sync' }
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

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService,
        private router: Router, 
        private UserService: UsersService,
       // private rest: RestService,
        private store: Store
    ) {}

    ngOnInit() {
       
        const storedConfig = localStorage.getItem(this.getStorageKey());

        if(storedConfig){
            const parsedConfig = JSON.parse(storedConfig);
            this.selectedThemeVariant = parsedConfig.themeVariant;
        }else{
            this.selectedThemeVariant = this.themes.find(t => t.name === 'lara')?.variants[0];
        }
        
        this.nombreUsr = this.UserService.getUser().usuario;        
        this.rol       = this.UserService.getUser().rol;
        this.img       = this.UserService.getUser().img;
       // console.log(this.img);
        this.nombreEmp = this.UserService.getUser().empNom + ' ' + this.UserService.getUser().empApe;
        this.empresa   = this.UserService.getUser().empresa;
       
        if(this.img.length === 0){
            this.label = this.nombreUsr.substring(0,1);
        }
        this.token      = this.UserService.getToken();           
        // Cargar configuración guardada
        this.loadSavedConfig();
     //   this.store.dispatch(getIndicadorRequest());
        this.store.select(selectIndicador).subscribe((indicador : any) => {  
           // console.log(indicador);
                     
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
            }else{
                this.store.dispatch(incrementarRequest({ request: 1 }));
                this.store.dispatch(getIndicadorRequest());
            }
        });
    
   
        // Inicializar estados de los switches
        this.val = this.menuMode === 'overlay';
        this.val2 = this.inputStyle === 'filled';

        this.layoutService.disparador2.subscribe((themei) => { 
         //   console.log(themei);
            const storedConf = localStorage.getItem(this.getStorageKey());
            if(storedConf){
                const parsedConfig = JSON.parse(storedConf);
               this.selectedThemeVariant = parsedConfig.themeVariant;
            }else{
                this.selectedThemeVariant = this.themes.find(t => t.name === 'lara')?.variants[0];
            }
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
                if (config.ripple !== undefined) this.ripple = config.ripple;
                if (config.inputStyle !== undefined) {
                    this.inputStyle = config.inputStyle;
                    this.val2 = config.inputStyle === 'filled';
                }
                if (config.menuMode !== undefined) {
                    this.menuMode = config.menuMode;
                    this.val = config.menuMode === 'overlay';
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
                menuMode    : this.menuMode
            };
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
            this.layoutService.disparador.emit(this.themei);
        }
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }

    showMenuModeButton = signal(!this.router.url.includes('auth'));
}
