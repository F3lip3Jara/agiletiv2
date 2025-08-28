import { Component, HostListener, OnDestroy, Renderer2, ViewChild, ChangeDetectorRef, OnInit, ElementRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { LayoutService } from "./service/app.layout.service";
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppTopBarComponent } from './app.topbar.component';
import { Store } from '@ngrx/store';
import { selectEstado } from '../erp/dashboard/component/state/selectors/estado.selectors';
import { map, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html'
})
export class AppLayoutComponent implements OnDestroy , OnInit  {

    overlayMenuOpenSubscription: Subscription;

    surface: string = ''; // valor por defecto  

    menuOutsideClickListener: any;

    profileMenuOutsideClickListener: any;

    hoverTimer: any;

    isDarkMode: boolean = false;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
    const target = event.target as HTMLElement; // Convertir a HTMLElement para acceder a las propiedades específicas del elemento
    // Verificar si el objetivo del clic es un botón
    if (target.tagName === 'BUTTON') {
      const audio = new Audio('assets/button.mp3');
      audio.play();
    }
    // Verificar si el objetivo del clic es un enlace (a)
    if (target.tagName === 'A') {
      const audio = new Audio('assets/button.mp3');
      audio.play();
    }
  }

  altura$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isLoading$: Observable<boolean>  = of(true);

    constructor(public layoutService: LayoutService, public renderer: Renderer2, public el: ElementRef, public router: Router , private store: Store ,private cd: ChangeDetectorRef) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target) 
                        || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));
                    
                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.profileMenuOutsideClickListener) {
                this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    if (!this.appTopbar || !this.appTopbar.menu || !this.appTopbar.topbarMenuButton) {
                        return;
                    }
                    const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                        || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideProfileMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }

          
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });
        }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    onMenuMouseEnter() {
        if (this.layoutService.config().menuMode === 'static' && this.layoutService.state.staticMenuDesktopInactive) {
            this.layoutService.state.staticMenuDesktopInactive = false;
            this.layoutService.state.menuHoverActive = true;
          //  console.log('Menú (estático) expandido por hover en área de activación.');
        } 
        else if (this.layoutService.config().menuMode === 'overlay' && !this.layoutService.state.overlayMenuActive) {
            this.layoutService.state.overlayMenuActive = true;
            this.layoutService.state.menuHoverActive = true;
          // console.log('Menú (overlay) expandido por hover en área de activación.');
        }
    }

    onMenuMouseLeave() {
        clearTimeout(this.hoverTimer);
        if (this.layoutService.state.menuHoverActive) {
            if (this.layoutService.config().menuMode === 'static') {
                this.layoutService.state.staticMenuDesktopInactive = true;
                this.layoutService.state.menuHoverActive = false;
                //console.log('Menú (estático) contraído al salir de la barra lateral.');
            } 
            else if (this.layoutService.config().menuMode === 'overlay') {
                this.layoutService.state.overlayMenuActive = false;
                this.layoutService.state.menuHoverActive = false;
             //   console.log('Menú (overlay) contraído al salir de la barra lateral.');
            }
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-input-filled': this.layoutService.config().inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config().ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }

    ngOnInit(): void {       
        this.store.select(selectEstado).subscribe((estado: any) => {          
           this.isLoading$ = estado.loading;
           let altura = estado.altura + 50;
           if(altura > 1450){
            altura = 1400;
           }
            this.altura$.next(altura);        
            this.cd.detectChanges();
           
        });

       this.layoutService.configUpdate$.subscribe((valor: any) => {
        this.isDarkMode = valor.colorScheme == 'dark' ? true : false;
        let surface = valor.surface;
        this.setSurfaceColor(surface);
        console.log('surface', surface);
        //Rederizo lo del menu moderno en layout-menu
        const el = document.getElementById('layout-main-container');
        const el2 = document.getElementById('layout-wrapper');
       

        if(this.isDarkMode){
            this.renderer.setStyle(el2, 'background-color', '#111827');
        }else{
            this.renderer.setStyle(el2, 'background-color', this.surface);
        }

        if(valor.menuTipo === 'moderno'){
       //     console.log('menuStylexx', document.getElementById('layout-main-container'));
            this.renderer.addClass(el, 'layout-main-container-modern');          
           
        }else{           
            this.renderer.removeClass(el, 'layout-main-container-modern');      
               
        }
      //Rederizo el margen del menu moderno;
        const _el = document.getElementById('layout-main-container');
     
        if( valor.toogleSidebar === true  && valor.menuTipo ==='moderno'){
            this.renderer.removeStyle( _el, 'margin-left');
            console.log('aqui', 'margin-left', '0px');
        }else{
           if(valor.menuTipo === 'moderno'){                  
              if(valor.menuMode === 'overlay'){
                this.renderer.removeStyle( _el, 'margin-left');
                console.log('aqui3', 'margin-left', '0px');
              }else{
                this.renderer.setStyle( _el, 'margin-left', '165px');
                console.log('aqui2', 'margin-left', '165px');
              }
           }else{
            this.renderer.removeStyle( _el, 'margin-left');
           }
        }

       // console.log('valor', valor);
       });
    }

    setSurfaceColor(surface: number) {
        switch(surface){
            case 1: this.surface = '#f2f5fa'; break;
            case 2: this.surface = '#e5e7eb'; break;
            case 3: this.surface = '#d1d5db'; break;
            case 4: this.surface = '#9ca3af'; break;
            case 5: this.surface = '#6b7280'; break;
            case 6: this.surface = '#374151'; break;
            case 7: this.surface = '#1f2937'; break;
            case 8: this.surface = '#111827'; break;
            default: this.surface = '#f2f5fa';
        }
    }
 
}
