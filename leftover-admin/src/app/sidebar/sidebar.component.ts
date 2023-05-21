import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoginserviceService } from '../pages/service/loginservice.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',       title: 'Dashboard',         icon:'nc-bank',       class: '' },
    { path: '/userlist',        title: 'User List',      icon:'nc-single-02',  class: '' },
    { path: '/csvdata',         title: 'CSV',             icon:'nc-diamond',    class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(private authService: LoginserviceService, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }
}
