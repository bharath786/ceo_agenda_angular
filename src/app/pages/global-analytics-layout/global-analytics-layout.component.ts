import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { fadeAnimation } from 'src/app/slideanimation';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { DimensionDataComponent } from './dimension-data/dimension-data.component';
import { DimensionHighlightsComponent } from './dimension-highlights/dimension-highlights.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { MenuItem } from 'primeng/api';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { AdminsettingsService } from '../admin-settings/adminsettings.service';

@Component({
  selector: 'app-global-analytics-layout',
  templateUrl: './global-analytics-layout.component.html',
  styleUrls: ['./global-analytics-layout.component.scss']

})
export class GlobalAnalyticsLayoutComponent implements OnInit {

  kpiId: boolean;
  @ViewChild('menuItems') menu: MenuItem[];

  files: any;
  mainvalue: any;
  selectedFile: any;
  menuId$: Observable<any>;
  // ... your class variables here
  navigationSubscription;
  kpivalue: any;
  dimId: any;
  items: MenuItem[];
  activeItem: MenuItem;
  kpiDetails: any;
  dimensionFrequency: any;
  kpiDataType: any;
  KPIPriorityType: any;


  constructor(private activeRoute: ActivatedRoute, private router: Router, public appSettings: AppSettings, public menuService: MenuService, public _adminsettindservice: AdminsettingsService) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      // this.dimId = crypto.DES.decrypt(params['dimId'].toString(), "DIMID").toString(crypto.enc.Utf8);
      this.dimId = atob(params['dimId'].toString());
      this.getTree();
    });
    this.items = [
      { label: 'Highlights', icon: 'fa fa-list-alt' },
      // {label: 'Data', icon: 'fa fa-folder'}
    ];
    this.activeItem = this.items[0];

  }

  getTree() {
    //this.menuId$ = this.appSettings.getMenuId();
    this.menuService.getDimensionData(this.dimId).subscribe(
      data => {
        this.files = data['data']
      },
      error => {
        console.log(error)
      }
    );
  }

  activateMenu() {
    this.activeItem = this.menu['activeItem'];
    console.log(this.activeItem)
  }
  
    //For Getting Dimension Frequencies for Dropdown
    getDimensionFrequencies() {
      this._adminsettindservice.getDimensionFrequency().subscribe(
        data => {
          //Assigning the values to the dimension frequency variable
         this.dimensionFrequency = data['data']
         this.dimensionFrequency = this.dimensionFrequency.filter(x=>x.lookupId == this.kpiDetails.frequencyId);
         this.dimensionFrequency = this.dimensionFrequency[0]['lookupName']

         console.log(this.dimensionFrequency,'Dimension Frequency')
        },
        error => {
          console.log(error);
        }
      )
    }

      //For Getting KPI Data Types for Dropdown
  getKpiDataType() {
    this._adminsettindservice.getKpiDataType().subscribe(
      data => {
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.kpiDataType = this.kpiDataType.filter(x=>x.lookupId == this.kpiDetails.dataTypeId)
        this.kpiDataType = this.kpiDataType[0]['lookupName']
        console.log(this.kpiDataType, 'Data Type')
        this.KPIPriorityType = data['data1']
        this.KPIPriorityType = this.KPIPriorityType.filter(x=>x.lookupId == this.kpiDetails.PriorityTypeId)
        this.KPIPriorityType = this.KPIPriorityType[0]['lookupName']
        console.log(this.KPIPriorityType, 'proiritytype')
      },
      error => {
        console.log(error);
      }
    )
  }


  checkData() {

    if (localStorage['kpiDetails'] != null || localStorage['kpiDetails'] != undefined) {
      this.kpiId = true;
    }
    else {
      this.kpiId = false;
    }
    return this.kpiId;
  }

  nodeSelect(event) {
    // console.log(event['node']['label']);
    this.mainvalue = event['node'];
    console.log(this.mainvalue);
    if (this.mainvalue['KPIId'] != null) {
      this.kpiDetails = this.mainvalue;
      console.log(this.kpiDetails)
      this.getDimensionFrequencies();
      this.getKpiDataType();
      this.items = [];
      this.items = [
        { label: 'Highlights', icon: 'fa fa-list-alt' },
        { label: 'Data', icon: 'fa fa-folder' }
      ];
      this.activeItem = this.items[0];
    }
    else {
      this.items = [];
      this.items = [
        { label: 'Highlights', icon: 'fa fa-list-alt' }
      ];
      this.activeItem = this.items[0];
    }
  }


}
