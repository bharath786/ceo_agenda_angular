import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { TreeModule } from 'primeng/tree';
import { AdminDashboardComponent, NoPermsisionModal, selectEntity } from './pages/admin-dashboard/admin-dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { routing } from './app.routing';
import { Daterangepicker } from 'ng2-daterangepicker';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { AppSettings } from './app.settings';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserIdleModule } from 'angular-user-idle';
import { AppService } from './app.service';
import { DataTableModule } from 'primeng/primeng'; // Here
import {ToasterModule, ToasterService} from 'angular2-toaster';
import { ErrorInterceptService } from './error-intercept.service';
import { NgHttpLoaderModule } from 'ng-http-loader'; 

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToasterModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    }),
    PerfectScrollbarModule,
    CalendarModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    SharedModule,
    PipesModule,
    routing,
    ModalModule.forRoot(),
    TreeModule,
    HttpClientModule,
    NgbPaginationModule, NgbAlertModule,
    NgxDaterangepickerMd,
    Daterangepicker,
    DataTableModule,
    UserIdleModule.forRoot({ idle: 700, timeout: 1, ping: 0 })
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    BlankComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    AdminDashboardComponent,
    FooterComponent,
    NoPermsisionModal,
    selectEntity
  ],
  entryComponents: [
    VerticalMenuComponent,NoPermsisionModal,selectEntity
  ],
  providers: [
    AppSettings,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptService, multi: true },
    AppService,ToasterService
    //AppService, LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}