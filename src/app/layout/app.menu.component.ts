import { OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from './service/app.layout.service';
import { UsersService } from '../erp/service/users.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit, OnDestroy {

    model     : any[]  = [];
    menu      : any[]  = [];
    nombreUsr : string = '';
    img       : string = '';
    label     : string = '';
    nombreLetra : string = '';
    nombre_completo : string = '';
    rol : string = '';
    menuStyle : 'classic' | 'modern' = this.layoutService.config().menuTipo === 'moderno' ? 'classic' : 'modern'; // Nuevo: estilo de menú
    useMockData : boolean = false; // Usar datos reales de la API
    activeSubmenu : number | null = null; // Nuevo: submenú activo
    submenuTimeout : any = null; // Nuevo: timeout para cerrar submenú
    submenuPosition : { top: number, left: number } = { top: 0, left: 0 }; // Nuevo: posición del submenú
    submenuElement : HTMLElement | null = null; // Nuevo: elemento del submenú
    isMobile : boolean = false; // Nuevo: detectar si es mobile
    isOverlay : boolean = false; // Nuevo: detectar si es overlay
    isStatic : boolean = false; // Nuevo: detectar si es static
    sidebarEl = this.el.nativeElement.closest('.layout-wrapper');
    
    constructor(
        public layoutService: LayoutService, 
        private UserService: UsersService,
        private renderer: Renderer2,
        private el: ElementRef,
        private router: Router
    ) { }

    ngOnInit() {    

        // Detectar cambios en el tema
        this.setupThemeListener();

        // Agregar listener para clicks fuera del submenú
        this.setupClickOutsideListener();

        // Usar datos reales de la API
        const user = this.UserService.getUser();    
        
        if (user) {             
            this.avatarConfig(user);
        } else {
            // Inicializar con valores por defecto si no hay usuario
            this.label = 'U';
            this.nombreLetra = 'U';
        }

        //Escucho los cambios de menú para actualizar las condiciones del sidebar
       this.layoutService.configUpdate$.subscribe((config) => {
            this.isOverlay = config.menuMode === 'overlay' ? true : false;       
            this.menuStyle = config.menuTipo === 'moderno' ? 'modern' : 'classic';
            this.isStatic =  config.toogleSidebar === true ? true : false;
            this.checkMobile();
            //Rederizo lo del menu moderno en layout-menu
            if(config.menuTipo === 'moderno'){             
                this.renderer.addClass(this.el.nativeElement.closest('.layout-sidebar'), 'layout-sidebar-modern'); 
               
            }else{
                this.renderer.removeClass(this.el.nativeElement.closest('.layout-sidebar'), 'layout-sidebar-modern');
            }
       });

         // Detectar si es mobile
         this.checkMobile();
         window.addEventListener('resize', () => this.checkMobile());

         //Escucho cambios de usuario 
         this.UserService.disparador.subscribe((user: any) => {
            if (user) {
                this.avatarConfig(user);
            } else {
                // Inicializar con valores por defecto si no hay usuario
                this.label = 'U';
                this.nombreLetra = 'U';
            }
        }); 

    }

    ngOnDestroy() {
        this.removeSubmenu();
        window.removeEventListener('resize', () => this.checkMobile());
        // Remover listener de tema
        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }
        // Remover listener de clicks fuera
        document.removeEventListener('click', this.handleClickOutside);
        if (this.sidebarObserver) {
            this.sidebarObserver.disconnect();
        }
        // Limpiar el intervalo de fuerza de visibilidad
        if (this.sidebarForceInterval) {
            clearInterval(this.sidebarForceInterval);
            this.sidebarForceInterval = null;
        }
    }

    // Listener para detectar cambios en el tema
    private themeObserver: MutationObserver | null = null;
    
    private setupThemeListener() {
        // Observar cambios en las clases del body
        this.themeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                    // Si hay un submenú activo, actualizar sus colores
                    if (this.submenuElement && this.activeSubmenu !== null) {
                        this.updateSubmenuColors();
                    }
                }
            });
        });

        this.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['class', 'data-theme']
        });
    }

    // Actualizar colores del submenú cuando cambia el tema
    private updateSubmenuColors() {
        if (!this.submenuElement) return;
        
        const colors = this.getThemeColors();
        
        // Actualizar colores del submenú
    //    this.renderer.setStyle(this.submenuElement, 'background', colors.background);
        this.renderer.setStyle(this.submenuElement, 'border', `1px solid ${colors.border}`);
        
        // Actualizar header
        const header = this.submenuElement.querySelector('.submenu-header') as HTMLElement;
        if (header) {
           // this.renderer.setStyle(header, 'background', `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`);
        }
        
        // Actualizar items del submenú
        const items = this.submenuElement.querySelectorAll('.submenu-item');
        items.forEach((item: HTMLElement) => {
            this.renderer.setStyle(item, 'color', colors.text);
        });
    }

    // Listener para clicks fuera del submenú
    private setupClickOutsideListener() {
        this.handleClickOutside = this.handleClickOutside.bind(this);
        document.addEventListener('click', this.handleClickOutside);
    }

    // Manejar clicks fuera del submenú
    private handleClickOutside = (event: MouseEvent) => {
        if (this.submenuElement && this.activeSubmenu !== null) {
            const target = event.target as HTMLElement;
            
            // Verificar si el click fue fuera del submenú y fuera del menú principal
            const isClickInsideSubmenu = this.submenuElement.contains(target);
            const isClickInsideMenu = this.el.nativeElement.contains(target);
            
            // Si el click fue fuera del submenú pero dentro del menú principal, no cerrar
            if (!isClickInsideSubmenu && !isClickInsideMenu) {
             //   console.log('Click fuera del menú, cerrando submenú');
                this.activeSubmenu = null;
                this.removeSubmenu();                
                 //restauro las condiciones iniciales del sidebar
                this.forceSidebarDefault(this.sidebarEl);
            }
        }
    }

    // Observar cambios de visibilidad/display en el sidebar
    private sidebarObserver: MutationObserver | null = null;   

    // Detectar si es mobile
    private checkMobile() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Si cambió a mobile, cambiar automáticamente al menú clásico
        if (!wasMobile && this.isMobile && this.menuStyle === 'modern') {
            this.menuStyle = 'classic';
            this.layoutService.config().menuTipo = 'classic';
            this.removeSubmenu(); // Cerrar cualquier submenú abierto
            this.renderer.removeClass(this.el.nativeElement.closest('.layout-sidebar'), 'layout-sidebar-modern');
        }

     
    }

    // Helper para agregar clases de iconos con espacios
    private addIconClasses(element: HTMLElement, iconString: string) {
        const iconClasses = iconString.split(' ');
        iconClasses.forEach(iconClass => {
            this.renderer.addClass(element, iconClass);
        });
    }

    // Obtener variables CSS para dark mode
    private getCssVariable(variable: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    // Obtener colores según el modo (dark/light)
    private getThemeColors() {
        // Detectar modo oscuro de múltiples formas
        const isDark = 
            document.body.classList.contains('dark') || 
            document.documentElement.classList.contains('dark') ||
            document.body.classList.contains('p-dark') ||
            document.documentElement.classList.contains('p-dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches ||
            document.body.getAttribute('data-theme') === 'dark';
        
        // Usar variables CSS de PrimeNG si están disponibles
        const primaryColor = this.getCssVariable('--primary-color') || '#3B82F6';
        const surfaceOverlay = this.getCssVariable('--surface-overlay') || (isDark ? '#1e1e1e' : '#ffffff');
        const surfaceBorder = this.getCssVariable('--surface-border') || (isDark ? '#404040' : '#e0e0e0');
        const textColor = this.getCssVariable('--text-color') || (isDark ? '#ffffff' : '#333333');
        const textColorSecondary = this.getCssVariable('--text-color-secondary') || (isDark ? '#b0b0b0' : '#666666');
        const surfaceHover = this.getCssVariable('--surface-hover') || (isDark ? '#3a3a3a' : '#f0f8ff');
        const surfaceCard = this.getCssVariable('--surface-card') || (isDark ? '#2d2d2d' : '#f8f9fa');
        
        return {
            background: surfaceOverlay,
            surface: surfaceCard,
            text: textColor,
            textSecondary: textColorSecondary,
            border: surfaceBorder,
            hover: surfaceHover,
            subHover: isDark ? '#2a2a2a' : '#e3f2fd',
            primary: primaryColor
        };
    }

     transformModulesToMenu(modules) {
        return modules.map(module => {
            return {
                label: module.molDes, // Nombre del módulo
                icon: module.molIcon, // Icono del módulo
                items: module.opciones.map(opcion => {
                    // Si tiene subopciones, las procesamos recursivamente
                    if (opcion.optSub === "S" && opcion.childrens && opcion.childrens.length > 0) {
                        return {
                            label: opcion.optDes,
                            icon: module.molIcon, 
                            items: opcion.childrens.map(child => ({
                                label: child.name,
                                icon: child.icon,
                                routerLink: [`/desk/${child.url}`]
                            }))
                        };
                    }
                    // Si no tiene subopciones
                    return {
                        label: opcion.optDes,
                        icon: module.molIcon, // Icono ejemplo
                        routerLink: [`/desk/${opcion.optLink}`]
                    };
                })
            };
        });
    }

    // Nuevo: método para cambiar el estilo del menú
    toggleMenuStyle() {
        // No permitir cambiar a menú moderno en mobile
        if (this.isMobile) {
           // console.log('No se puede cambiar a menú moderno en mobile');
            return;
        }        
        this.menuStyle = this.layoutService.config().menuTipo === 'moderno' ? 'modern' : 'classic';      
        this.hideSubmenu(null); // Cerrar submenú al cambiar estilo
      
    }

    // Nuevo: mostrar submenú
    showSubmenu(index: number, event: MouseEvent) {
    

        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
            this.submenuTimeout = null;
        }
        
        

        // Calcular posición del submenú
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const submenuWidth = 280;
        const submenuHeight = 400; // Altura máxima estimada
        
        let left = rect.right + 10;
        let top = rect.top;
        
        // Verificar si se sale por la derecha
        if (left + submenuWidth > windowWidth) {
            left = rect.left - submenuWidth - 10;
        }
        
        // Verificar si se sale por abajo
        if (top + submenuHeight > windowHeight) {
            top = windowHeight - submenuHeight - 20;
        }
        
        // Verificar si se sale por arriba
        if (top < 20) {
            top = 20;
        }
        
        this.submenuPosition = {
            top: top,
            left: left
        };

        if(this.submenuPosition.left < 159) {
            this.submenuPosition.left = 159;
        }
        
     //  console.log('Posición calculada:', this.submenuPosition);
        
        this.activeSubmenu = index;
        this.createSubmenu(index);
        
        // Agregar clase CSS para indicar que el submenú está activo
        this.renderer.addClass(this.el.nativeElement, 'submenu-active');
        this.renderer.addClass(this.el.nativeElement.querySelector('.layout-menu'), 'submenu-active');
        
        // Agregar clase al sidebar padre si existe
        const sidebarElement = this.el.nativeElement.closest('app-sidebar');
        if (sidebarElement) {
            this.renderer.addClass(sidebarElement, 'submenu-active');
        }
        
        const layoutSidebar = this.el.nativeElement.closest('.layout-sidebar');
        if (layoutSidebar) {
            this.renderer.addClass(layoutSidebar, 'submenu-active');
        }

       
    }

    // Nuevo: ocultar submenú
    hideSubmenu(index: number | null) {
        
        // Solo ocultar si no hay submenú activo o si es un índice diferente
        if (this.activeSubmenu !== index) {
            this.submenuTimeout = setTimeout(() => {
                // Verificar si el mouse está sobre el menú principal o submenú antes de cerrar
                const menuElement = this.el.nativeElement;
                const submenuElement = this.submenuElement;
                
                // Verificar si el mouse está sobre el menú principal
                const isMouseOverMenu = menuElement.matches(':hover') || 
                                      menuElement.querySelector(':hover') ||
                                      menuElement.contains(document.activeElement);
                
                // Verificar si el mouse está sobre el submenú
                const isMouseOverSubmenu = submenuElement && (
                    submenuElement.matches(':hover') || 
                    submenuElement.querySelector(':hover') ||
                    submenuElement.contains(document.activeElement)
                );
                
                if (!isMouseOverMenu && !isMouseOverSubmenu) {
                   // console.log('Cerrando submenú - mouse fuera del área del menú');
                    this.activeSubmenu = null;
                    this.removeSubmenu();                    
                }
            }, 300); // Aumentado el delay para mejor experiencia
        }

       
    }

    // Nuevo: mantener submenú abierto
    keepSubmenuOpen(index: number) {
        if (this.submenuTimeout) {
            clearTimeout(this.submenuTimeout);
            this.submenuTimeout = null;
        }
        this.activeSubmenu = index;    
        this.forceSidebarVisible(this.sidebarEl);
    }

    // Nuevo: crear submenú dinámicamente
    createSubmenu(index: number) {
       // console.log('createSubmenu llamado con índice:', index);
        
        this.removeSubmenu(); // Remover submenú existente
        
        const item = this.model[index];
        if (!item || !item.items || item.items.length === 0) {
         //   console.log('No hay items para mostrar en el submenú');
            return;
        }

        //console.log('Creando submenú para:', item.label, 'con', item.items.length, 'items');
        

        // Crear elemento del submenú
        this.submenuElement = this.renderer.createElement('div');
        this.renderer.addClass(this.submenuElement, 'floating-submenu');
        this.renderer.addClass(this.submenuElement, 'global-submenu');
        
        // Obtener colores del tema
        const colors = this.getThemeColors();
        
        // Aplicar estilos básicos
        this.renderer.setStyle(this.submenuElement, 'position', 'fixed');
        this.renderer.setStyle(this.submenuElement, 'top', `${this.submenuPosition.top}px`);
        this.renderer.setStyle(this.submenuElement, 'left', this.isMobile ? '20px' : `${this.submenuPosition.left}px`);
        this.renderer.setStyle(this.submenuElement, 'width', this.isMobile ? 'calc(100vw - 40px)' : '230px');
        this.renderer.setStyle(this.submenuElement, 'z-index', '999997');
        this.renderer.setStyle(this.submenuElement, 'background', colors.background);
        this.renderer.setStyle(this.submenuElement, 'border-radius', '12px');
        this.renderer.setStyle(this.submenuElement, 'box-shadow', '0 12px 40px rgba(0, 0, 0, 0.25)');
        this.renderer.setStyle(this.submenuElement, 'border', `1px solid ${colors.border}`);
        this.renderer.setStyle(this.submenuElement, 'overflow', 'hidden');
        this.renderer.setStyle(this.submenuElement, 'pointer-events', 'auto');
        this.renderer.setStyle(this.submenuElement, 'backdrop-filter', 'blur(10px)');
        this.renderer.setStyle(this.submenuElement, '-webkit-backdrop-filter', 'blur(10px)');

        // Crear header simple
        const header = this.renderer.createElement('div');
        this.renderer.addClass(header, 'submenu-header');
        this.renderer.setStyle(header, 'background', `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`);
        this.renderer.setStyle(header, 'color', 'white');
        this.renderer.setStyle(header, 'padding', '1rem');
        this.renderer.setStyle(header, 'display', 'flex');
        this.renderer.setStyle(header, 'align-items', 'center');
        this.renderer.setStyle(header, 'gap', '0.75rem');

        const icon = this.renderer.createElement('i');
        this.addIconClasses(icon, item.icon);
        this.renderer.setStyle(icon, 'font-size', '1.2rem');

        const title = this.renderer.createElement('span');
        this.renderer.setStyle(title, 'font-weight', '600');
        this.renderer.setStyle(title, 'font-size', '1rem');
        title.textContent = item.label;

        this.renderer.appendChild(header, icon);
        this.renderer.appendChild(header, title);

        // Crear contenido
        const content = this.renderer.createElement('div');
        this.renderer.setStyle(content, 'max-height', this.isMobile ? '60vh' : '400px');
        this.renderer.setStyle(content, 'overflow-y', 'auto');
        this.renderer.setStyle(content, 'padding', '0.5rem');

        // Crear items del submenú
        item.items.forEach(subItem => {
            const submenuItem = this.renderer.createElement('div');
            this.renderer.addClass(submenuItem, 'submenu-item');
            this.renderer.setStyle(submenuItem, 'display', 'flex');
            this.renderer.setStyle(submenuItem, 'align-items', 'center');
            this.renderer.setStyle(submenuItem, 'padding', '0.75rem');
            this.renderer.setStyle(submenuItem, 'border-radius', '8px');
            this.renderer.setStyle(submenuItem, 'cursor', 'pointer');
            this.renderer.setStyle(submenuItem, 'transition', 'all 0.2s ease');
            this.renderer.setStyle(submenuItem, 'margin-bottom', '0.25rem');
            this.renderer.setStyle(submenuItem, 'color', colors.text);
            this.renderer.setStyle(submenuItem, 'position', 'relative');

            // Icono del item
            const itemIcon = this.renderer.createElement('div');
            this.renderer.setStyle(itemIcon, 'width', '40px');
            this.renderer.setStyle(itemIcon, 'height', '40px');
            this.renderer.setStyle(itemIcon, 'background', colors.surface);
            this.renderer.setStyle(itemIcon, 'border-radius', '8px');
            this.renderer.setStyle(itemIcon, 'display', 'flex');
            this.renderer.setStyle(itemIcon, 'align-items', 'center');
            this.renderer.setStyle(itemIcon, 'justify-content', 'center');
            this.renderer.setStyle(itemIcon, 'margin-right', '0.75rem');

            const itemIconElement = this.renderer.createElement('i');
            this.addIconClasses(itemIconElement, subItem.icon);
            this.renderer.setStyle(itemIconElement, 'font-size', '1rem');
            this.renderer.setStyle(itemIconElement, 'color', colors.textSecondary);

            this.renderer.appendChild(itemIcon, itemIconElement);

            // Contenido del item
            const itemContent = this.renderer.createElement('div');
            this.renderer.setStyle(itemContent, 'flex', '1');

            const itemLabel = this.renderer.createElement('span');
            this.renderer.setStyle(itemLabel, 'font-weight', '500');
            this.renderer.setStyle(itemLabel, 'font-size', '0.9rem');
            itemLabel.textContent = subItem.label;

            this.renderer.appendChild(itemContent, itemLabel);

            // Verificar si tiene subopciones (opciones hijas)
            if (subItem.items && subItem.items.length > 0) {
                // Crear contenedor para subopciones
                const subOptionsContainer = this.renderer.createElement('div');
                this.renderer.setStyle(subOptionsContainer, 'display', 'none');
                this.renderer.setStyle(subOptionsContainer, 'margin-top', '0.25rem');
                this.renderer.setStyle(subOptionsContainer, 'margin-bottom', '0.5rem');
                this.renderer.setStyle(subOptionsContainer, 'border-top', `1px solid ${colors.border}`);
                this.renderer.setStyle(subOptionsContainer, 'padding-top', '0.5rem');
                this.renderer.setStyle(subOptionsContainer, 'background', colors.surface);
                this.renderer.setStyle(subOptionsContainer, 'border-radius', '6px');
                this.renderer.setStyle(subOptionsContainer, 'padding-left', '0.5rem');
                this.renderer.setStyle(subOptionsContainer, 'padding-right', '0.5rem');

                // Agregar flecha indicadora a la derecha
                const arrow = this.renderer.createElement('div');
                this.renderer.setStyle(arrow, 'margin-left', 'auto');
                this.renderer.setStyle(arrow, 'opacity', '0.6');
                this.renderer.setStyle(arrow, 'transition', 'transform 0.2s ease');

                const arrowIcon = this.renderer.createElement('i');
                this.addIconClasses(arrowIcon, 'pi pi-chevron-down');
                this.renderer.setStyle(arrowIcon, 'font-size', '0.8rem');

                this.renderer.appendChild(arrow, arrowIcon);

                // Crear subopciones
                subItem.items.forEach(subSubItem => {
                    const subSubmenuItem = this.renderer.createElement('div');
                    this.renderer.setStyle(subSubmenuItem, 'display', 'flex');
                    this.renderer.setStyle(subSubmenuItem, 'align-items', 'center');
                    this.renderer.setStyle(subSubmenuItem, 'padding', '0.5rem');
                    this.renderer.setStyle(subSubmenuItem, 'border-radius', '4px');
                    this.renderer.setStyle(subSubmenuItem, 'cursor', 'pointer');
                    this.renderer.setStyle(subSubmenuItem, 'transition', 'all 0.2s ease');
                    this.renderer.setStyle(subSubmenuItem, 'margin-bottom', '0.25rem');
                    this.renderer.setStyle(subSubmenuItem, 'color', colors.textSecondary);
                    this.renderer.setStyle(subSubmenuItem, 'font-size', '0.85rem');
                    this.renderer.setStyle(subSubmenuItem, 'background', 'transparent');

                    // Icono de la subopción
                    const subItemIcon = this.renderer.createElement('div');
                    this.renderer.setStyle(subItemIcon, 'width', '30px');
                    this.renderer.setStyle(subItemIcon, 'height', '30px');
                    this.renderer.setStyle(subItemIcon, 'background', colors.surface);
                    this.renderer.setStyle(subItemIcon, 'border-radius', '6px');
                    this.renderer.setStyle(subItemIcon, 'display', 'flex');
                    this.renderer.setStyle(subItemIcon, 'align-items', 'center');
                    this.renderer.setStyle(subItemIcon, 'justify-content', 'center');
                    this.renderer.setStyle(subItemIcon, 'margin-right', '0.5rem');

                    const subItemIconElement = this.renderer.createElement('i');
                    this.addIconClasses(subItemIconElement, subSubItem.icon || 'pi pi-circle');
                    this.renderer.setStyle(subItemIconElement, 'font-size', '0.8rem');
                    this.renderer.setStyle(subItemIconElement, 'color', colors.textSecondary);

                    this.renderer.appendChild(subItemIcon, subItemIconElement);

                    // Etiqueta de la subopción
                    const subItemLabel = this.renderer.createElement('span');
                    subItemLabel.textContent = subSubItem.label;

                    // Eventos para subopciones
                    this.renderer.listen(subSubmenuItem, 'click', () => {
                    //   console.log('Click en subopción:', subSubItem.label);
                    //    console.log('RouterLink:', subSubItem.routerLink);
                        if (subSubItem.routerLink && subSubItem.routerLink.length > 0) {
                      //      console.log('Navegando a:', subSubItem.routerLink);
                            this.forceSidebarDefault(this.sidebarEl);
                            this.router.navigate(subSubItem.routerLink);
                        } else {
                           // console.log('No hay routerLink definido para subopción:', subSubItem.label);
                        }
                        this.removeSubmenu();
                    });

                    this.renderer.listen(subSubmenuItem, 'mouseenter', () => {
                        this.renderer.setStyle(subSubmenuItem, 'background',colors.hover);
                        this.renderer.setStyle(subSubmenuItem, 'transform', 'translateX(4px)');
                    });

                    this.renderer.listen(subSubmenuItem, 'mouseleave', () => {
                        this.renderer.setStyle(subSubmenuItem, 'background', 'transparent');
                        this.renderer.setStyle(subSubmenuItem, 'transform', 'translateX(0)');
                    });

                    this.renderer.appendChild(subSubmenuItem, subItemIcon);
                    this.renderer.appendChild(subSubmenuItem, subItemLabel);
                    this.renderer.appendChild(subOptionsContainer, subSubmenuItem);
                });

                // Variable para controlar el estado expandido
                let isExpanded = false;

                // Eventos para mostrar/ocultar subopciones
                this.renderer.listen(submenuItem, 'click', () => {
                    isExpanded = !isExpanded;
                    
                    if (isExpanded) {
                        this.renderer.setStyle(subOptionsContainer, 'display', 'block');
                        this.renderer.setStyle(arrow, 'transform', 'rotate(180deg)');
                    } else {
                        this.renderer.setStyle(subOptionsContainer, 'display', 'none');
                        this.renderer.setStyle(arrow, 'transform', 'rotate(0deg)');
                    }
                });

                // Eventos hover solo para el item padre
                this.renderer.listen(submenuItem, 'mouseenter', () => {
                    this.renderer.setStyle(submenuItem, 'background', colors.hover);
                });

                this.renderer.listen(submenuItem, 'mouseleave', () => {
                    this.renderer.setStyle(submenuItem, 'background', 'transparent');
                });

                this.renderer.appendChild(submenuItem, itemIcon);
                this.renderer.appendChild(submenuItem, itemContent);
                this.renderer.appendChild(submenuItem, arrow);
                this.renderer.appendChild(content, submenuItem);
                this.renderer.appendChild(content, subOptionsContainer);
            } else {
                // Evento click para opciones sin subopciones
                this.renderer.listen(submenuItem, 'click', () => {
            //        console.log('Click en submenú item:', subItem.label);
             //       console.log('RouterLink:', subItem.routerLink);
                    if (subItem.routerLink && subItem.routerLink.length > 0) {
                   //     console.log('Navegando a:', subItem.routerLink);
                        this.forceSidebarDefault(this.sidebarEl);
                        this.router.navigate(subItem.routerLink);
                      
                        
                    } else {
                     //   console.log('No hay routerLink definido para:', subItem.label);
                    }
                    this.removeSubmenu();
                });

                // Eventos hover para opciones sin subopciones
                this.renderer.listen(submenuItem, 'mouseenter', () => {
                    this.renderer.setStyle(submenuItem, 'background', colors.hover);
                });

                this.renderer.listen(submenuItem, 'mouseleave', () => {
                    this.renderer.setStyle(submenuItem, 'background', 'transparent');
                });

                this.renderer.appendChild(submenuItem, itemIcon);
                this.renderer.appendChild(submenuItem, itemContent);
                this.renderer.appendChild(content, submenuItem);
            }
        });

        this.renderer.appendChild(this.submenuElement, header);
        this.renderer.appendChild(this.submenuElement, content);

        // Agregar al body
        this.renderer.appendChild(document.body, this.submenuElement);
       // console.log('Submenú creado y agregado al DOM');

        // Eventos para mantener abierto
        this.renderer.listen(this.submenuElement, 'mouseenter', () => {
            this.keepSubmenuOpen(index);
        });

        this.renderer.listen(this.submenuElement, 'mouseleave', () => {
            this.hideSubmenu(index);
        });

        // Agregar listener al menú principal para mantener submenú abierto
        const menuElement = this.el.nativeElement;
        this.renderer.listen(menuElement, 'mouseenter', () => {
            if (this.activeSubmenu !== null) {
                this.keepSubmenuOpen(this.activeSubmenu);
            }
        });

        this.renderer.listen(menuElement, 'mouseleave', () => {
            if (this.activeSubmenu !== null) {
                this.hideSubmenu(this.activeSubmenu);
            }
        });
    }

    // Nuevo: remover submenú
    removeSubmenu() {
        if (this.submenuElement) {
            this.renderer.removeChild(document.body, this.submenuElement);
            this.submenuElement = null;
            //console.log('Submenú removido');
        }
        
        // Remover clases CSS cuando se cierra el submenú
        this.renderer.removeClass(this.el.nativeElement, 'submenu-active');
        const layoutMenu = this.el.nativeElement.querySelector('.layout-menu');
        if (layoutMenu) {
            this.renderer.removeClass(layoutMenu, 'submenu-active');
        }
        
        // Remover clase del sidebar padre si existe
        const sidebarElement = this.el.nativeElement.closest('app-sidebar');
        if (sidebarElement) {
            this.renderer.removeClass(sidebarElement, 'submenu-active');
        }
        
        const layoutSidebar = this.el.nativeElement.closest('.layout-sidebar');
        if (layoutSidebar) {
            this.renderer.removeClass(layoutSidebar, 'submenu-active');
        }

        // Limpiar el intervalo al cerrar el submenú
        if (this.sidebarForceInterval) {
            clearInterval(this.sidebarForceInterval);
            this.sidebarForceInterval = null;
           //condiciono según estilo de menú si agrego o quito la clase layout-static-inactive
        }
    }

    private sidebarForceInterval: any = null;

    private forceSidebarVisible(sidebarEl :any) {
        if (sidebarEl) {         
            sidebarEl.classList.remove('layout-static-inactive');
            sidebarEl.classList.add('layout-overlay-active');        
        }

    }
    private forceSidebarDefault(sidebarEl :any) {
        if(this.isOverlay) {                   
            sidebarEl.classList.remove('layout-overlay-active');       
        }

        if(this.isStatic) {                
            sidebarEl.classList.add('layout-static-inactive');                           
            console.log('isStatic', this.isStatic);
        }

    }

    avatarConfig(user: any){
        if (user) {
            this.menu = this.transformModulesToMenu(user.menu || []);
            this.model = this.menu;
            this.nombreUsr = user.usuario || '';
            this.img = user.img || '';
            this.nombreLetra = this.img.length <= 0 ? (user.usuario ? user.empNom.substring(0,1) : '') : '';
            this.label = this.nombreLetra; // Mantener consistencia con topbar
            this.nombre_completo = user.empNom + ' ' + user.empApe || '';
            this.rol = user.rol || '';

            //console.log('img', this.img);
            //console.log('img.length', this.img.length);
            //console.log('nombreLetra', this.nombreLetra);
        }
    }

    
}
