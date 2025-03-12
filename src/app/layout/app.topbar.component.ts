import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { UsersService } from 'src/app/erp/service/users.service';
import { Router } from '@angular/router';
import { AppState } from '../erp/dashboard/component/app.state';
import { Store } from '@ngrx/store';
import { selectEstado } from '../erp/dashboard/component/state/selectors/estado.selectors';
import { selectMensaje } from '../erp/dashboard/component/state/selectors/mensaje.selectors';
import { readMensajeRequest } from '../erp/dashboard/component/state/actions/mensajes.actions';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
    providers: [MessageService]
})
export class AppTopBarComponent {
    items!: MenuItem[];
    tieredItems: MenuItem[] = [];
    menuItems: MenuItem[] = [];
    hasNotifications: boolean = true;
    appLoading: boolean = false;

    // Propiedades para la búsqueda
    searchVisible: boolean = false;
    searchQuery: string = '';
    filteredOptions: any[] = [];
    allMenuOptions: any[] = [];
    mensajes: any[] = [];

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
    
    // Propiedades para el avatar
    img: string = '';
    label: string = '';
    nombreUsr: string = '';
    greeting: string = '';
    greetingEmoji: string = '';
    isDarkMode: boolean;
    empresaLetra: string = '';
    empresaNombreFormateado: string = '';
    private readonly STORAGE_KEY_PREFIX = 'app_config_';

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;

    isFullscreen: boolean = false;

    unreadCount: number = 0;
    inboxMessages: any[] = [];
    generalMessages: any[] = [];
    archivedMessages: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private userService: UsersService,
        private router: Router,
        private store: Store<AppState>,
        private messageService: MessageService
    ) {
        this.setGreeting();
        this.initializeSearchOptions();
        this.initializeNotifications();
    }

    ngOnInit() {
        // Obtener información del usuario
        this.nombreUsr               = this.userService.getUser().usuario;
        this.img                     = this.userService.getUser().img;
        this.empresaLetra            = this.userService.getUser().empresa.substring(0,1);
        this.empresaNombreFormateado = this.userService.getUser().empresa.replace(/-/g, ' ');

        // Suscripción al estado de la aplicación
        this.store.select(selectEstado).subscribe((estado) => {
            this.appLoading = estado.loading;
        });

        this.store.select(selectMensaje).subscribe((mensaje : any) => {
            this.mensajes = mensaje;
        });
        const storedConfig = localStorage.getItem(this.getStorageKey());
        
        if (storedConfig) {
            const parsedConfig = JSON.parse(storedConfig);
            this.isDarkMode = parsedConfig.themeVariant.isDark;
        }else{
            this.isDarkMode = this.layoutService.config().colorScheme === 'dark';
        }
        
        if(this.img.length === 0) {
            this.label = this.nombreUsr.substring(0,1);
        }

        // Inicializar el estado del tema
        this.isDarkMode = this.layoutService.config().colorScheme === 'dark';

        this.menuItems = [
            {
                label: 'Mi Perfil',
                icon: 'pi pi-user',
                command: () => {
                    // Implementar navegación al perfil
                }
            },
            {
                label: 'Mis Tareas',
                icon: 'pi pi-check-square',
                command: () => {
                    // Implementar navegación a tareas
                }
            },
            {
                label: 'Mensajes',
                icon: 'pi pi-envelope',
                command: () => {
                    // Implementar navegación a mensajes
                }
            },
            { separator: true },
            {
                label: 'Configuración',
                icon: 'pi pi-cog',
                command: () => {
                    this.onConfigButtonClick();
                }
            },
            { separator: true },
            {
                label: 'Cerrar Sesión',
                icon: 'pi pi-sign-out',
                command: () => {
                    // Implementar cierre de sesión
                }
            }
        ];
        
        this.layoutService.disparador.subscribe((themei) => {
            this.isDarkMode = !themei;
        });
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                this.isFullscreen = false;
            }
        }
    }

    private setGreeting() {
        const hour = new Date().getHours();
        
        if (hour >= 5 && hour < 12) {
            this.greeting = 'Buenos días';
            this.greetingEmoji = '🌅';
        } else if (hour >= 12 && hour < 20) {
            this.greeting = 'Buenas tardes';
            this.greetingEmoji = '☀️';
        } else {
            this.greeting = 'Buenas noches';
            this.greetingEmoji = '🌙';
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        // Obtener el tema actual
        const currentTheme = this.layoutService.config().theme;     
       // console.log(currentTheme);
           
        const lastWord = currentTheme.split('-').pop();
       // console.log(lastWord);
        // Buscar el tema actual en la lista de temas
        const currentThemeFamily = this.themes.find(theme => 
            theme.variants.some(variant => variant.value === currentTheme)
        );
       // console.log(currentThemeFamily);

        if (currentThemeFamily) {
            // Buscar la variante oscura correspondiente
            const darkVariant = currentThemeFamily.variants.find(variant =>             
              variant.isDark == this.isDarkMode && variant.value.split('-').pop() == lastWord
            );    

            if (darkVariant) {
                // Actualizar la configuración con el tema oscuro correspondiente
                this.layoutService.config.update((config) => ({
                    ...config,
                    theme: darkVariant.value,
                    colorScheme: 'dark'
                }));
                // Guardar la configuración
                this.saveThemeConfig(darkVariant.value);
                this.layoutService.disparador2.emit(true);
            }
        }
    }

    private saveThemeConfig(theme: string) {
        try {
            const config = {
                themeFamily: this.themes.find(t => 
                    t.variants.some(v => v.value === theme)
                )?.name,
                themeVariant: this.themes.find(t => 
                    t.variants.some(v => v.value === theme)
                )?.variants.find(v => v.value === theme)
            };
            
            localStorage.setItem('app_config_' + this.nombreUsr, JSON.stringify(config));
        } catch (error) {
            console.error('Error al guardar la configuración del tema:', error);
        }
    }

    // Método para inicializar las opciones de búsqueda
    private initializeSearchOptions() {
        const userMenu = this.userService.getUser().menu;
        this.allMenuOptions = this.flattenMenuOptions(userMenu);
    }

    // Método para aplanar el menú en una lista simple
    private flattenMenuOptions(menu: any[]): any[] {
        let options: any[] = [];
        menu.forEach(module => {
            module.opciones.forEach(opcion => {
                if (opcion.optSub === "S" && opcion.childrens.length > 0) {
                    opcion.childrens.forEach(child => {
                        options.push({
                            label: child.name,
                            icon: child.icon,
                            route: child.url,
                            module: module.molDes
                        });
                    });
                } else {
                    options.push({
                        label: opcion.optDes,
                        icon: opcion.molId === 1 ? 'pi pi-fw pi-shield' : 'pi pi-fw pi-circle',
                        route: opcion.optLink,
                        module: module.molDes
                    });
                }
            });
        });
        return options;
    }

    // Método para mostrar el diálogo de búsqueda
    showSearch() {
        this.searchVisible = true;
    }

    // Método para ocultar el diálogo de búsqueda
    hideSearch() {
        this.searchVisible = false;
        this.searchQuery = '';
        this.filteredOptions = [];
    }

    // Método para filtrar las opciones
    onSearch(event: any) {
        const query = event.query.toLowerCase();
        this.filteredOptions = this.allMenuOptions.filter(option =>
            option.label.toLowerCase().includes(query) ||
            option.module.toLowerCase().includes(query)
        );
    }

    // Método para navegar a la opción seleccionada
    onSelectOption(option: any) {
        if (option.route) {    
            this.hideSearch();        
            this.router.navigate(['desk/'+option.route]);            
        }
    }

    // Método para manejar el atajo de teclado
    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        // Ctrl/Cmd + K para abrir la búsqueda
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            console.log(event.key);
            this.hideSearch();

            if (this.appLoading === false) {
                event.preventDefault();
                this.showSearch();
            }
        }
        // Escape para cerrar la búsqueda
        if (event.key === 'Escape' && this.searchVisible) {
            this.hideSearch();
        }
    }

    private getStorageKey(): string {
        return this.STORAGE_KEY_PREFIX + this.nombreUsr;
    }

    private initializeNotifications() {
        this.store.select(selectMensaje).subscribe((state: any) => {
            if (state) {
                // Limpiar los mensajes existentes antes de agregar los nuevos
                this.generalMessages = [];
                this.archivedMessages = [];
                
                state.forEach((ms:any)=> {                     
                    if(ms.read === false){
                        this.generalMessages.push({
                            ...ms,
                            time: this.formatDate(new Date()),
                            read: false
                        });
                        // Mostrar toast para nuevos mensajes
                        this.showNotificationToast(ms);
                    }else{
                        this.archivedMessages.push({
                            ...ms,
                        });
                    }
                });

                this.unreadCount = this.generalMessages.length;
            }
        });
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    private showNotificationToast(message: any) {
        this.messageService.add({
            key: 'notification-toast',
            severity: message.type || 'info',
            summary: 'Nueva notificación',
            detail: message.mensaje,
            life: 5000,
            styleClass: 'notification-toast'
        });
    }

    markAllAsRead() {
        // Mover mensajes a archivados
        this.store.dispatch(readMensajeRequest());
        
    }

    getAvatarStyle(type: string) {
        const styles: any = {
            'success': {
                'background-color': 'var(--green-500)',
                'color': 'var(--surface-0)'
            },
            'error': {
                'background-color': 'var(--red-500)',
                'color': 'var(--surface-0)'
            },
            'warning': {
                'background-color': 'var(--yellow-500)',
                'color': 'var(--surface-900)'
            },
            'info': {
                'background-color': 'var(--blue-500)',
                'color': 'var(--surface-0)'
            }
        };
        return styles[type] || styles['info'];
    }

}
