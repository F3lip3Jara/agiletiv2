import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-breadcrumb',
    template: `
        <div class="layout-breadcrumb" [class.mobile]="isMobile">
            <p-breadcrumb 
                [model]="items" 
                [home]="home"
                [styleClass]="'custom-breadcrumb'"              
            ></p-breadcrumb>
        </div>
    `,
    styles: [`
        .layout-breadcrumb {
            padding: 0.5rem 0;
            background: var(--surface-card);
            border: 1px solid var(--surface-card);
            border-radius: 5px;
            margin-bottom: 1rem;
            margin-top: 1rem;
        }

        ::ng-deep .custom-breadcrumb {
            background: transparent;
            border: none;
            padding: 0;

            .p-breadcrumb-list {
                li {
                    .p-menuitem-link {
                        color: var(--primary-color);
                        font-size: 0.875rem;
                        padding: 0.25rem 0.5rem;
                        border-radius: 4px;

                        &:focus {
                            box-shadow: none;
                        }

                        &:hover {
                            background: var(--primary-50);
                            color: var(--primary-700);
                        }

                        .p-menuitem-text {
                            color: inherit;
                        }
                    }

                    &:last-child {
                        .p-menuitem-link {
                            color: var(--text-color);
                            pointer-events: none;
                        }
                    }
                }
            }

            .p-breadcrumb-chevron {
                margin: 0 0.25rem;
                color: var(--text-color-secondary);
                font-size: 0.75rem;
            }
        }

        .layout-breadcrumb.mobile ::ng-deep .custom-breadcrumb {
            .p-breadcrumb-list li .p-menuitem-link {
                padding: 0.25rem;
                font-size: 0.75rem;
            }
            
            .p-breadcrumb-chevron {
                margin: 0 0.15rem;
                font-size: 0.65rem;
            }
        }
    `]
})
export class AppBreadcrumbComponent implements OnInit {
    
    items: MenuItem[] = [];
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/desk/home' };
    isMobile: boolean = window.innerWidth < 768;
    private readonly HISTORY_KEY = 'breadcrumb_history';

    constructor(private router: Router) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                let url = decodeURIComponent(event.url);
                this.updateHistory(url);
                this.generateBreadcrumb();
            });
    }
4
    ngOnInit() {
        this.generateBreadcrumb();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    }

    private updateHistory(url: string) {
        let history: {label: string, routerLink: string}[] = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
         const paths = this.router.url.split('/').filter(x => x);
        let label :string = '';
        paths.forEach(path => {
            if(path.length < 15){
                label = this.formatLabel(path);
            }
            
        });


        // Si la URL ya existe en el historial, eliminamos todo lo que viene después
     //   const existingIndex = history.indexOf();
        let existingIndex =0;
      /*  history.forEach(breadcrumb => {
            if(breadcrumb.routerLink === url){
                if(existingIndex === 0){
                    existingIndex = history.indexOf(breadcrumb);
                }
            }
        });*/     
        
        if (existingIndex > 1) {
           history = history.slice(0, existingIndex );
        } else {
            // Si es una nueva URL, la agregamos al historial            
            let breadcrumb = {label : label , routerLink : url}; 
            history.push(breadcrumb);
         }

        // Limitamos el historial a las últimas 10 URLs
        if (history.length > 15) {
            history = history.slice(-15);
        }

        localStorage.setItem(this.HISTORY_KEY, JSON.stringify(history));
    }

    private generateBreadcrumb() {
        const history: any[] = JSON.parse(localStorage.getItem(this.HISTORY_KEY) || '[]');
        this.items = [];
        const paths = this.router.url.split('/').filter(x => x);
     
       paths.forEach(path => {
        if(path.length < 15){
            let label = this.formatLabel(path);
            let breadcrumb = history.find(breadcrumb => breadcrumb.label === label);
            let currentPath = '';
            currentPath += '/' + path;
            
            if(breadcrumb){
                this.items.push(breadcrumb);
            }else{
                this.items.push({
                    label: this.formatLabel(path),
                    routerLink: ''
                });
            }
        }
       });
    }

    private formatLabel(path: string): string {
        return path.charAt(0).toUpperCase() + path.slice(1).toLowerCase();
    }

    
} 