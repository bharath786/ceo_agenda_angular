import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { url } from 'src/app/shared/_constants.data';
import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems } from './menu';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class MenuService {
  sessiontoken: any;
  sessionuser: any;
  commondata: any
  headers: { headers: HttpHeaders; };

  constructor(private location:Location,
              private router:Router, private http: HttpClient){ } 
    
  public getVerticalMenuItems():Array<Menu> {
    return verticalMenuItems;
  }

  public getHorizontalMenuItems():Array<Menu> {
    return horizontalMenuItems;
  }

  getMenu(){
    var EntityDetails = JSON.parse(localStorage['EntityDetails'])
    return this.http.get(url+'get-menu'+'?entityId='+EntityDetails.defaultEntityId+'&filterYear='+EntityDetails.year, this.getHeaders())
  }

  getDimensionData(dimensionId){
    var EntityDetails = JSON.parse(localStorage['EntityDetails'])
    return this.http.get(url+'get-dimensiondata?dimensionId='+dimensionId+'&isTarget='+false+'&filterYear='+EntityDetails.year, this.getHeaders())
  }

    //For Headers
    getHeaders() {
      let sessionUser = JSON.parse(localStorage['Session_name'])
      this.sessiontoken = sessionUser.token;
      this.sessionuser = sessionUser.user_id;
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorisation': this.sessiontoken,
          'Userid': this.sessionuser
        })
      }
      this.headers = httpOptions;
      return this.headers
    }

  public expandActiveSubMenu(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = url; // url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
        let menuItem = activeMenuItem[0];
        while (menuItem.parentId != 0){  
          let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
          menuItem = parentMenuItem;
          this.toggleMenuItem(menuItem.id);
        }
      }
  }
  


  passData(data){
    return data
  }


  public toggleMenuItem(menuId){
    let menuItem = document.getElementById('menu-item-'+menuId);
    let subMenu = document.getElementById('sub-menu-'+menuId);  
    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }      
    }
  }

  public closeOtherSubMenus(menu:Array<Menu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0]; 
    if(currentMenuItem.parentId == 0 && !currentMenuItem.target){
      menu.forEach(item => {
        if(item.id != menuId){
          let subMenu = document.getElementById('sub-menu-'+item.id);
          let menuItem = document.getElementById('menu-item-'+item.id);
          if(subMenu){
            if(subMenu.classList.contains('show')){
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }              
          } 
        }
      });
    }
  }
  

}
