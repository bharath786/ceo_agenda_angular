import { QualityHighlightsComponent } from './quality/highlights/highlights.component';
import { QualityDataComponent } from './quality/data/data.component';
import { QualityComponent } from './quality/quality.component';
import { ProjectsComponent } from './projects/projects.component';
import { CustomSharedModule } from './../../custom-shared/custom-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ConstructionComponent } from '../../construction/construction.component';
import { TreeModule } from 'primeng/tree';
import { ChartModule } from 'angular-highcharts';
import { ModalModule } from 'ngx-bootstrap';
import { ProjectsDataComponent } from './projects/data/data.component';
import { ProjectsHighlightsComponent } from './projects/highlights/highlights.component';
import { SharedModule } from 'src/app/shared/shared.module';



export const routes: Routes = [

  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects', component: ProjectsComponent, data: { breadcrumb: 'Projects', helptext: { heading: 'Projects', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: ProjectsHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: ProjectsDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'quality', component: QualityComponent, data: { breadcrumb: 'Quality', helptext: { heading: 'Quality', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: QualityHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: QualityDataComponent, data: { breadcrumb: 'Data' } }
    ]

  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TreeModule,
    ChartModule,
    CustomSharedModule,
    ModalModule,
    SharedModule
  ],
  exports: [RouterModule],

  declarations: [
    ProjectsComponent,
    ProjectsDataComponent,
    ProjectsHighlightsComponent,
    QualityComponent,
    QualityDataComponent,
    QualityHighlightsComponent
    
  ]
})
export class ProcessModule { }
