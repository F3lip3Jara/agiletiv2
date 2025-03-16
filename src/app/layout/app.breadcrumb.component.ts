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

    constructor(private router: Router) {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.generateBreadcrumb();
            });
    }

    ngOnInit() {
        this.generateBreadcrumb();
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 768;
        });
    }

    private generateBreadcrumb() {
        const paths = this.router.url.split('/').filter(x => x);
        this.items = [];
        let fullPath = '';
        
        // Si el último segmento tiene más de 10 caracteres, lo eliminamos
        if (paths.length > 0 && paths[paths.length - 1].length > 10) {
            paths.pop();
        }

        paths.forEach(path => {
            fullPath += '/' + path;
            this.items.push({
                label: this.formatLabel(path),
                routerLink: fullPath
            });
        });
    }

    private formatLabel(path: string): string {
        return path.charAt(0).toUpperCase() + path.slice(1).toLowerCase();
    }
} 