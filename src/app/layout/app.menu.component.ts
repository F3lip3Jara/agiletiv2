import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UsersService } from '../erp/service/users.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit {

    model     : any[]  = [];
    menu      : any[]  = [];
    nombreUsr : string = '';
    img       : string = '';
    label     : string = '';
   

    
    constructor(public layoutService: LayoutService, private UserService: UsersService) { }

    ngOnInit() {
        const user = this.UserService.getUser();
        if (user) {
            this.menu = this.transformModulesToMenu(user.menu || []);
            this.model = this.menu;
            this.nombreUsr = user.usuario || '';
            this.img = user.img || '';

            if (!this.img || this.img.length === 0) {
                this.label = this.nombreUsr ? this.nombreUsr.substring(0,1) : '';
            }
        }
    }

     transformModulesToMenu(modules) {
        return modules.map(module => {
            return {
                label: module.molDes, // Nombre del módulo
                items: module.opciones.map(opcion => {
                    // Si tiene subopciones, las procesamos recursivamente
                    if (opcion.optSub === "S" && opcion.childrens.length > 0) {
                        return {
                            label: opcion.optDes,
                            icon: opcion.optIcon,
                            items: opcion.childrens.map(child => ({
                                label: child.name,
                                icon: child.icon,
                                routerLink: [`./${child.url}`]
                            }))
                        };
                    }
                    // Si no tiene subopciones
                    return {
                        label: opcion.optDes,
                        icon: module.molIcon, // Icono ejemplo
                        routerLink: [`./${opcion.optLink}`]
                    };
                })
            };
        });
    }
    
}
