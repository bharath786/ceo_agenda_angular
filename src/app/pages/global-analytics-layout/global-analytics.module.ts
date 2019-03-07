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
import { DataFilterPipe } from 'src/app/data-filter.pipe';
import { FilterPipe } from 'src/app/theme/filterfordata.pipe';

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
  ],
  declarations: [FilterPipe,GetMonthName,DimensionDataComponent, DimensionHighlightsComponent, GlobalAnalyticsLayoutComponent],
  exports: [RouterModule]
})
export class GlobalAnalyticsModule {


}
