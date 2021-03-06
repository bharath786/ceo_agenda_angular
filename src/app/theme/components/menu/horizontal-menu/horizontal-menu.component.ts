import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { MenuService } from '../menu.service';
import { MatMenuTrigger } from '@angular/material';
import { Menu } from '../menu.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class HorizontalMenuComponent implements OnInit {

  @Input('menuParentId') menuParentId;

  public menuItems: Array<Menu[]>;
  menuId$: Observable<any>;
  public settings: Settings;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  componentRef: any;
  files: any;
  horizontalMenuItems: any = []

  constructor(public appSettings: AppSettings, private activatedRoute: ActivatedRoute,
    public menuService: MenuService, public router: Router, private cdref: ChangeDetectorRef, ) {

    this.settings = this.appSettings.settings;

    // subscribe to the router events - storing the subscription so
    // we can unsubscribe later. 
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        if (this.appSettings.getIsNewAdded()) {
          this.setInitialMenus();
          this.appSettings.setIsNewAdded(false);
          this.cdref.detectChanges();
        }
      }
    });
  }


  ngOnInit() {
    this.appSettings.setIsNewAdded(false);
    this.setInitialMenus();
  }


  setInitialMenus() {
    let horizontalMenuItems = [];
    let Userdetails = JSON.parse(localStorage.getItem('Session_name'));
    if (Userdetails.email == 'admin@ceo.com') {
      horizontalMenuItems = [
        new Menu(6, 'Dashboard', '/dashboard', null, 'looks', null, false, 0),
        new Menu(1, 'Predictive', ' ', null, 'multiline_chart', null, true, 0),
        new Menu(2, 'System', ' ', null, 'pie_chart', null, true, 0),
        new Menu(3, 'Control', ' ', null, 'insert_chart', null, true, 0),
        new Menu(4, 'Process', ' ', null, 'equalizer', null, true, 0),
        new Menu(5, 'Admin', ' ', null, 'portrait', null, true, 0),
        new Menu(8, 'Setup', '/adminsettings/setup', null, 'build', null, false, 5),
        new Menu(9, 'Structure', '/adminsettings/structure', null, 'memory', null, false, 5),
        new Menu(10, 'Manage Users', '/adminsettings/manageusers', null, 'people_outline', null, false, 5),
        new Menu(27, 'Target', '/adminsettings/target', null, 'done_all', null, false, 5),
      ];
    }
    else {
      horizontalMenuItems = []
      horizontalMenuItems = [
        new Menu(6, 'Dashboard', '/dashboard', null, 'looks', null, false, 0),
        new Menu(1, 'Predictive', ' ', null, 'multiline_chart', null, true, 0),
        new Menu(2, 'System', ' ', null, 'pie_chart', null, true, 0),
        new Menu(3, 'Control', ' ', null, 'insert_chart', null, true, 0),
        new Menu(4, 'Process', ' ', null, 'equalizer', null, true, 0),
        new Menu(5, 'Admin', ' ', null, 'portrait', null, true, 0),
      ];
      var permissionlist = [];
      let PermsissionDetails = [];
      PermsissionDetails = JSON.parse(localStorage.getItem('userPermissions'));
      if (PermsissionDetails != null || PermsissionDetails != undefined) {
        PermsissionDetails = PermsissionDetails['PermissionArray']
        permissionlist = PermsissionDetails.filter(x => x.bt_isRead == true);
        permissionlist.forEach(element => {
          if (element.screen_name == 'Setup') {
            horizontalMenuItems.push(new Menu(8, 'Setup', '/adminsettings/setup', null, 'build', null, false, 5))
          }
          else if (element.screen_name == 'Structure') {
            horizontalMenuItems.push(new Menu(9, 'Structure', '/adminsettings/structure', null, 'memory', null, false, 5))
          }
          else if (element.screen_name == 'Manage Users') {
            horizontalMenuItems.push(new Menu(10, 'Manage Users', '/adminsettings/manageusers', null, 'people_outline', null, false, 5))
          }
          else if (element.screen_name == 'Target') {
            horizontalMenuItems.push(new Menu(27, 'Target', '/adminsettings/target', null, 'done_all', null, false, 5))
          }
        })
      }

    }

    this.menuService.getMenu().subscribe(
      data => {
        data['data'].forEach((element) => {
          horizontalMenuItems.push(new Menu(element['dimensionId'], element['dimensionName'], '/category/highlights/' + btoa(element['dimensionId'].toString()), null, '', null, false, element['analyticsId']))
          // horizontalMenuItems.push(new Menu(element['dimensionId'], element['dimensionName'], '/analytics/highlights/'+ crypto.DES.encrypt(element['dimensionId'].toString(), "DIMID") , null, '', null, false, element['analyticsId']))
        });
        let menuItemsBeforeFilter = horizontalMenuItems;
        let temp = menuItemsBeforeFilter.filter(item => item.parentId == this.menuParentId);
        this.menuItems = temp;
        // this.menuItems = horizontalMenuItems;
        // this.menuItems = this.menuItems.filter(item => item.parentId == this.menuParentId);
      }
    )
  }


  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.settings.fixedHeader) {
          let mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.scrollTop = 0;
          }
        }
        else {
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }
    });

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

}