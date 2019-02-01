import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppSettings {

    private menuSelected = new Subject<any>();
    menuId$: Observable<any> = this.menuSelected.asObservable();

    public setMenuId(id) {
        this.menuId$ = id;
    }

    public getMenuId() {
        return this.menuId$;
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

