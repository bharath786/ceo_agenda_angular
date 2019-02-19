import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from 'src/app/slideanimation';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { DimensionDataComponent } from './dimension-data/dimension-data.component';
import { DimensionHighlightsComponent } from './dimension-highlights/dimension-highlights.component';

@Component({
  selector: 'app-global-analytics-layout',
  templateUrl: './global-analytics-layout.component.html',
  styleUrls: ['./global-analytics-layout.component.scss']

})
export class GlobalAnalyticsLayoutComponent implements OnInit {
  kpiId$: Observable<any>;
  kpiId: any;

  constructor(public appsettings: AppSettings) { }

  ngOnInit() {
    this.kpiId$ = this.appsettings.kpiIdOutput();
    console.log(this.kpiId$)
  }




}
