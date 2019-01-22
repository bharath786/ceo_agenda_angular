import { Routes, RouterModule } from "@angular/router";
import { InfrastructureComponent } from "./infrastructure/infrastructure.component";
import { InfrastructureHighlightsComponent } from "./infrastructure/highlights/highlights.component";
import { InfrastructureDataComponent } from "./infrastructure/data/data.component";
import { FinanceComponent } from "./finance/finance.component";
import { FinanceHighlightsComponent } from "./finance/highlights/highlights.component";
import { FinanceDataComponent } from "./finance/data/data.component";
import { StatutoryComponent } from "./statutory/statutory.component";
import { StatutoryHighlightsComponent } from "./statutory/highlights/highlights.component";
import { StatutoryDataComponent } from "./statutory/data/data.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TreeModule } from "primeng/tree";
import { ChartModule } from "angular-highcharts";
import { CustomSharedModule } from "../../custom-shared/custom-shared.module";
import { ModalModule } from "ngx-bootstrap";
import { SharedModule } from "src/app/shared/shared.module";




export const routes: Routes = [

  { path: '', redirectTo: 'infrastructure', pathMatch: 'full' },
  {
    path: 'infrastructure', component: InfrastructureComponent, data: { breadcrumb: 'Infrastructure', helptext: { heading: 'Infrastructure', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: InfrastructureHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: InfrastructureDataComponent, data: { breadcrumb: 'Data' } }
    ]
  },
  {
    path: 'finance', component: FinanceComponent, data: { breadcrumb: 'Finance', helptext: { heading: 'Finance', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: FinanceHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: FinanceDataComponent, data: { breadcrumb: 'Data' } }
    ]

  },

  {
    path: 'statutory', component: StatutoryComponent, data: { breadcrumb: 'Statutory', helptext: { heading: 'Statutory', text: 'Detailed summary report can be viewed and managed from here' } }, children: [
      { path: '', redirectTo: 'highlights', pathMatch: 'full' },
      { path: 'highlights', component: StatutoryHighlightsComponent, data: { breadcrumb: 'Highlights' } },
      { path: 'data', component: StatutoryDataComponent, data: { breadcrumb: 'Data' } }
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
    InfrastructureComponent,
    InfrastructureDataComponent,
    InfrastructureHighlightsComponent,
    FinanceDataComponent,
    FinanceHighlightsComponent,
    FinanceComponent,
    StatutoryComponent,
    StatutoryDataComponent,
    StatutoryHighlightsComponent
  ]
})
export class ControlModule { }
