import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DimensionDataComponent } from './dimension-data/dimension-data.component';
import { DimensionHighlightsComponent } from './dimension-highlights/dimension-highlights.component';
import { Routes, RouterModule } from '@angular/router';
import { TreeModule } from 'primeng/tree';
import { ChartModule } from 'angular-highcharts';
import { CustomSharedModule } from 'src/app/custom-shared/custom-shared.module';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HttpClientModule } from '@angular/common/http';
import { GlobalAnalyticsLayoutComponent } from './global-analytics-layout.component';

export const routes: Routes = [



  { path: '', component: GlobalAnalyticsLayoutComponent, data: { breadcrumb: 'Dimension', helptext:{heading:'Analytics',text:'Detailed summary report can be viewed and managed from here' }}, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: DimensionHighlightsComponent, data: { breadcrumb: 'Highlights' , helptext:{heading:'Highlights', text:'Users & Permissions can be managed from here'} } },
      { path: 'data', component: DimensionDataComponent, data: { breadcrumb: 'Data' , helptext:{heading:'Data', text:'Users & Permissions can be managed from here'} }  }
    ]
  }


      
    ]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    HttpClientModule,
    ChartModule,
    CustomSharedModule,
    ModalModule,
    SharedModule,
    NgxChartsModule,
  ],
  declarations: [DimensionDataComponent,DimensionHighlightsComponent,GlobalAnalyticsLayoutComponent],
  exports: [RouterModule]
})
export class GlobalAnalyticsModule {


 }
