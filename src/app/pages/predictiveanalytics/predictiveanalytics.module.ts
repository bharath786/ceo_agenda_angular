import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TechnologyHighlightsComponent } from './technology/highlights/highlights.component';


import { ChartModule } from 'angular-highcharts';
import { MarketingDataComponent } from './marketing/data/data.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingComponent } from './marketing/marketing.component';

import { Routes, RouterModule } from '@angular/router';


import { TreeModule } from 'primeng/tree';
import { MarketingHighlightsComponent } from './marketing/highlights/highlights.component';
import { CustomSharedModule } from '../../custom-shared/custom-shared.module';
import { ConstructionComponent } from '../../construction/construction.component';
import { ModalModule } from 'ngx-bootstrap';
import { TechnologyComponent } from './technology/technology.component';
import { TechnologyDataComponent } from './technology/data/data.component';
import { SharedModule } from 'src/app/shared/shared.module';

export const routes: Routes = [
  {path:'',redirectTo:'marketing',pathMatch:'full'},
  {
    path: 'marketing', component: MarketingComponent, data: { breadcrumb: 'Marketing', helptext:{heading:'Marketing',text:'Detailed summary report can be viewed and managed from here' }}, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: MarketingHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: MarketingDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'technology', component: TechnologyComponent, data: { breadcrumb: 'Technology', helptext:{heading:'Technology',text:'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: TechnologyHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: TechnologyDataComponent, data: { breadcrumb: 'Data' } }
    ]

  },

  //  {path:'technology', loadChildren:'./technology/technology.module#TechnologyModule', data:{breadcrumb: 'Technology'}}
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    ChartModule,
    CustomSharedModule,
    ModalModule,
    SharedModule,
    NgxChartsModule,
  ],
  declarations: [MarketingComponent, MarketingDataComponent,  MarketingHighlightsComponent, TechnologyComponent, TechnologyDataComponent, TechnologyHighlightsComponent],
  exports: [RouterModule]
})


export class PredictiveanalyticsModule { }
