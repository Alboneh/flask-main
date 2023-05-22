import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UserlistComponent } from 'src/app/pages/userlist/userlist.component';
import { CsvdataComponent } from 'src/app/pages/csvdata/csvdata.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',        component: DashboardComponent },
    { path: 'user',             component: UserComponent },
    { path: 'table',            component: TableComponent },
    { path: 'icons',            component: IconsComponent },
    { path: 'notifications',    component: NotificationsComponent },
    { path: 'userlist',         component:UserlistComponent},
    { path: 'csvdata',          component:CsvdataComponent},
];
