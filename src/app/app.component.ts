import { Component, ViewChild } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public spinkit = Spinkit;
  public settings: Settings;
  constructor(public appSettings: AppSettings, public router: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    var apiUrl = window.location.host;
    if (apiUrl == "ceo.optionm.com") {
      
    } else {

    }
  }

}


