import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Menu } from './theme/components/menu/menu.model';
import { map } from 'rxjs/operators';
import { Input  } from '@angular/core';

@Injectable()
export class AppSettings {

    @Input('menuParentId') menuParentId;

    private menuSelected = new Subject<any>();
    private totalMenus = new Subject<Menu[]>();
    menuId$: Observable<any> = this.menuSelected.asObservable();
    menuItems: Observable<Menu[]> = this.totalMenus.asObservable();


    public setMenuId(id) {
        this.menuId$ = id;
    }

    public getMenuId() {
        return this.menuId$;
    }

    public initialMenus(menuItems) {
        this.menuItems = menuItems;
    }

    public setMenus(menuItem) {
        console.log(menuItem);
        this.menuItems.pipe(map(menuItemList => {
            menuItemList.push(menuItem.filter(item => item.parentId == this.menuParentId));
            return menuItemList;
        }));
        console.log(this.menuItems,'Ggjg')
    }

    public getMenus() {
        return this.menuItems;
    }

    public settings = new Settings(
        'CEO Agenda',   //theme name
        true,       //loadingSpinner
        true,       //fixedHeader
        true,       //sidenavIsOpened
        true,       //sidenavIsPinned  
        true,       //sidenavUserBlock 
        'horizontal', //horizontal , vertical
        'default',  //default, compact, mini
        'indigo-light',   //indigo-light, teal-light, red-light, blue-dark, green-dark, pink-dark
        false       // true = rtl, false = ltr
    )
}

