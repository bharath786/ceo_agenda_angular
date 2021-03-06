import { Injectable } from '@angular/core';
import { Settings } from './app.settings.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Input  } from '@angular/core';

@Injectable()
export class AppSettings {

    @Input('menuParentId') menuParentId;

    private menuSelected = new Subject<any>();
    private KpiId = new Subject<any>();
    private isNewAdded = new Subject<boolean>();
    private isSubmitted = new Subject<boolean>();
    kpiId$: Observable<any> = this.KpiId.asObservable();
    menuId$: Observable<any> = this.menuSelected.asObservable();
    newAdded$: Observable<boolean> = this.isNewAdded.asObservable();
    isSubmitted$: Observable<boolean> = this.isSubmitted.asObservable();


    public setMenuId(id) {
        this.menuId$ = id;
    }

    public getMenuId() {
        return this.menuId$;
    }

    public kpiIdInput(id) {
        this.kpiId$ = id;
    }

    public kpiIdOutput() {
        console.log(this.kpiId$)
        return this.kpiId$;
    }

    public setIsNewAdded(flag) {
        this.newAdded$ = flag;
    }

    public getIsNewAdded() {
        return this.newAdded$;
    }

    public filterSubmitted(flag){
        this.isSubmitted$ = flag;
    }

    public isfilterSubmitted() {
        return this.isSubmitted$;
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

