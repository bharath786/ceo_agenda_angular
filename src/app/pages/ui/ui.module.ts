import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CardsComponent } from './cards/cards.component';
import { ProgressComponent } from './progress/progress.component';

export const routes = [
  { path: '', redirectTo: 'buttons', pathMatch: 'full'},
  { path: 'cards', component: CardsComponent, data: { breadcrumb: 'Cards' } },
  { path: 'progress', component: ProgressComponent, data: { breadcrumb: 'Progress' } },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SharedModule
  ],
  declarations: [
    CardsComponent, 
    ProgressComponent, 
  ],
  entryComponents: [
  ]
})
export class UiModule { }
