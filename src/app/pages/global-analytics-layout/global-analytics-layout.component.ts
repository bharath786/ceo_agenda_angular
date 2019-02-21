import { Component, OnInit, Input } from '@angular/core';
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

  kpiId: boolean = false;

  constructor(public appsettings: AppSettings) { }

  ngOnInit() {
  }

  checkData(){

    if(sessionStorage['kpiDetails'] != null || sessionStorage['kpiDetails'] != undefined){
      this.kpiId = true;
    }
    else{
      this.kpiId = false;
    }
    return this.kpiId;
  }


}
