import { SolutionsComponent } from './Solutions/solutions.component';
import { RiskHighlightsComponent } from './Risk/highlights/highlights.component';
import { ProgressDataComponent } from './Progress/data/data.component';
import { ProgressHighlightsComponent } from './Progress/highlights/highlights.component';
import { InnovationComponent } from './Innovation/innovation.component';
import { IndustriesHighlightsComponent } from './Industries/highlights/highlights.component';
import { IndustriesDataComponent } from './Industries/data/data.component';
import { IndustriesComponent } from './Industries/industries.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CustomSharedModule } from '../../custom-shared/custom-shared.module';
import { TreeModule } from 'primeng/tree';
import { ChartModule } from 'angular-highcharts';
import { ModalModule } from 'ngx-bootstrap';
import { InnovationHighlightsComponent } from './Innovation/highlights/highlights.component';
import { InnovationDataComponent } from './Innovation/data/data.component';
import { ProgressComponent } from './Progress/progress.component';
import { RiskComponent } from './Risk/risk.component';
import { RiskDataComponent } from './Risk/data/data.component';
import { SolutionsDataComponent } from './Solutions/data/data.component';
import { SolutionsHighlightsComponent } from './Solutions/highlights/highlights.component';
import { TalentComponent } from './Talent/talent.component';
import { TalentDataComponent } from './Talent/data/data.component';
import { TalentHighlightsComponent } from './Talent/highlights/highlights.component';
import { AlignmentComponent } from './alignment/alignment.component';
import { AlignmentDataComponent } from './alignment/data/data.component';
import { AlignmentHighlightsComponent } from './alignment/highlights/highlights.component';
import { CultureComponent } from './culture/culture.component';
import { CultureDataComponent } from './culture/data/data.component';
import { CultureHighlightsComponent } from './culture/highlights/highlights.component';
import { SharedModule } from 'src/app/shared/shared.module';




export const routes: Routes = [

  { path: '', redirectTo: 'solutions', pathMatch: 'full' },
  {
    path: 'solutions', component: SolutionsComponent, data: { breadcrumb: 'Solutions', helptext: { heading: 'Solutions', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: SolutionsHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: SolutionsDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'progress', component: ProgressComponent, data: { breadcrumb: 'Progress', helptext: { heading: 'Progress', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: ProgressHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: ProgressDataComponent, data: { breadcrumb: 'Data' } }
    ]

  },

  {
    path: 'innovation', component: InnovationComponent, data: { breadcrumb: 'Innovation', helptext: { heading: 'Innovation', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: InnovationHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: InnovationDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'talent', component: TalentComponent, data: { breadcrumb: 'Talent', helptext: { heading: 'Talent', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: TalentHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: TalentDataComponent, data: { breadcrumb: 'Data' } }
    ]

  },

  {
    path: 'culture', component: CultureComponent, data: { breadcrumb: 'Culture', helptext: { heading: 'Culture', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: CultureHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: CultureDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'industries', component: IndustriesComponent, data: { breadcrumb: 'Industries', helptext: { heading: 'Industries', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: IndustriesHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: IndustriesDataComponent, data: { breadcrumb: 'Data' } }
    ]

  },
  {
    path: 'alignment', component: AlignmentComponent, data: { breadcrumb: 'Alignment', helptext: { heading: 'Alignment', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: AlignmentHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: AlignmentDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'risk', component: RiskComponent, data: { breadcrumb: 'Risk', helptext: { heading: 'Risk', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: RiskHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: RiskDataComponent, data: { breadcrumb: 'Data' } }
    ]

  }
];



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
  AlignmentComponent,
  AlignmentDataComponent,
  AlignmentHighlightsComponent,
  CultureComponent,
  CultureDataComponent,
  CultureHighlightsComponent,
    IndustriesComponent,
    IndustriesDataComponent,
    IndustriesHighlightsComponent,
    InnovationComponent,
    InnovationHighlightsComponent,
    InnovationDataComponent,
    ProgressComponent,
    ProgressHighlightsComponent,
    ProgressDataComponent,
    RiskComponent,
    RiskDataComponent,
    RiskHighlightsComponent,
    SolutionsComponent,
    SolutionsDataComponent,
    SolutionsHighlightsComponent,
    TalentComponent,
    TalentDataComponent,
    TalentHighlightsComponent
  ]
})
export class SystemModule { }
