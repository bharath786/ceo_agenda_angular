import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimensionDataComponent } from './dimension-data/dimension-data.component';
import { DimensionHighlightsComponent } from './dimension-highlights/dimension-highlights.component';
import { Routes, RouterModule } from '@angular/router';
import { TreeModule } from 'primeng/tree';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { GlobalAnalyticsLayoutComponent } from './global-analytics-layout.component';
import {TabMenuModule} from 'primeng/tabmenu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetMonthName } from 'src/app/theme/pipes/Months.pipe';
import { DataTableModule } from 'angular2-datatable';
import { FilterPipe } from 'src/app/theme/filterfordata.pipe';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ChartModule } from 'angular-highcharts';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {KeyFilterModule} from 'primeng/keyfilter';



export const routes: Routes = [
  {
    path: 'highlights/:dimId', component: GlobalAnalyticsLayoutComponent, data: { breadcrumb: 'Dimension', helptext: { heading: 'Analytics', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      // { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      // { path: 'highlights/:dimId', component: DimensionHighlightsComponent, data: { breadcrumb: 'Highlights', helptext: { heading: 'Highlights', text: 'Users & Permissions can be managed from here' } } },
      // { path: 'data/:dimId', component: DimensionDataComponent, data: { breadcrumb: 'Data', helptext: { heading: 'Data', text: 'Users & Permissions can be managed from here' } } }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    MessagesModule,
    KeyFilterModule,
    MessageModule,
    Ng2SmartTableModule,
    TooltipModule.forRoot(),
    RouterModule.forChild(routes),
    TreeModule,
    HttpClientModule,
    ModalModule,
    ReactiveFormsModule,
    DataTableModule,
    SharedModule,
    NgxChartsModule,
    TabMenuModule,
    FormsModule,
    ChartModule 
  ],
  declarations: [FilterPipe,GetMonthName,DimensionDataComponent, DimensionHighlightsComponent, GlobalAnalyticsLayoutComponent],
  exports: [RouterModule],
  providers:[GetMonthName]
})
export class GlobalAnalyticsModule {


}
