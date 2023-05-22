import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './pages/login/login.component';

import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AuthGuard } from "./shared/auth.guard";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserlistComponent } from './pages/userlist/userlist.component';

import { AgGridModule } from "ag-grid-angular";
import { CsvdataComponent } from './pages/csvdata/csvdata.component';
import { DatePipe } from "@angular/common";
import { LoadingComponent } from './shared/loading/loading.component';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    UserlistComponent,
    CsvdataComponent,
    LoadingComponent
  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    AgGridModule
  ],
  providers: [AuthGuard,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
