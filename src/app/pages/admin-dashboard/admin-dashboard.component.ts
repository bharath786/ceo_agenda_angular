import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AdminsettingsService } from '../admin-settings/adminsettings.service';
import { FormBuilder } from '@angular/forms';
import { AppSettings } from 'src/app/app.settings';


@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    start_date: any;

    end_date: any;
    constructor(public dialog: MatDialog, public router: Router) {
        var EntityDetails = JSON.parse(localStorage['EntityDetails'])
        var userSession = JSON.parse(localStorage['Session_name'])
        if (EntityDetails.assignedEntities < 1) {
            
            if(userSession.email != "admin@ceo.com"){
                this.openDialog();
            }
 
        }
        if (EntityDetails.assignedEntities == 1) {
            
        }
        if (EntityDetails.assignedEntities > 1) {
            if (EntityDetails.defaultEntityId == null) {
                this.openDialog1();
            } 
        }
    }

        openDialog1() {
        const dialogRef = this.dialog.open(selectEntity, {
            width: '500px',
            disableClose: true
        }
        );

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(NoPermsisionModal, {
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    ngOnInit() {
        this.router.events.subscribe((res) => {
        })
        if (this.router.url == '/login') {
            this.dialog.closeAll()
        }
    }
}

//No Permission Component for Modal PopUp

@Component({
    selector: 'NoPermsisionModalPopup',
    templateUrl: 'no-permission.html',
})
export class NoPermsisionModal {
    constructor(public dialog: MatDialog, public router: Router) { }
    logout() {
        this.dialog.closeAll()
        localStorage.clear()
        this.router.navigate(['/login'])
    }
}

//Ends here



//For Select Entity Component for Modal PopUp
@Component({
    selector: 'Select-Entity',
    templateUrl: 'select-entity.html',
})
export class selectEntity {
    divisiondata: any[];
    entitiesList: any = [];
    locationdata: any[];
    entityarray: any[];
    userSelectedEntities: any;
    filteredEntities: any = [];
    entityform: any;
    sessionUser: any;
    selectedCountries: any;
    selectedDivisions: any;
    selectedEntity: any;
    entityDefault: any;
    UniqueEntitiesList: any;
    years: any[];
    i: any;
    differenceYears: any=[];

    constructor(public dialog: MatDialog,
        private appSettings:AppSettings,
        @Inject(MAT_DIALOG_DATA) public EntityDetails,
        public fb: FormBuilder,
        public router: Router,
        public adminsettingsservice: AdminsettingsService) {
        //this.getEntitiesList();
        this.entityform = this.fb.group({
            'divId': [null],
            'locationId': [null],
            'entityId': null,
            'isDefault': false,
            'year': [null]
        });
        this.getEntitiesList();
    }

    ngOnInit() {
        
    }

    onEntitySubmit(values) {
        var EntityDetails = JSON.parse(localStorage['EntityDetails'])
        localStorage.setItem('EntityDetails',
            JSON.stringify({
                assignedEntities: EntityDetails.assignedEntities,
                defaultCountryId: values['locationId'], defaultDivisionId: values['divId'],
                defaultEntityId: values['entityId'], isDefault: values['isDefault']
            }));
        let sessionUser = JSON.parse(localStorage['Session_name'])
        values['userId'] = sessionUser.user_id;
        this.adminsettingsservice.getEntityData(values).subscribe(
            data => {
                console.log(data, 'EntityData')
                this.dialog.closeAll()
                this.appSettings.setIsNewAdded(true);
                this.router.events.subscribe((res) => {
                })
                this.router.navigate(['/dashboard']);
                // this.router.navigate([this.router.url]);
            }
        )
    }

    getEntitiesList() {
        let sessionUser = JSON.parse(localStorage['Session_name'])
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                console.log(data)
                this.entitiesList = data['data']
                 this.UniqueEntitiesList = this.selectedEntities();
                var EntityDetails = JSON.parse(localStorage['EntityDetails'])
                console.log(EntityDetails,'local entity details')
                if (EntityDetails != null) {
                     console.log(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['divId'].setValue(EntityDetails['defaultDivisionId']);
                    this.onDivisionSelect(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['locationId'].setValue(EntityDetails['defaultCountryId']);
                    this.onLocationSelect(EntityDetails['defaultCountryId'])
                    this.entityform.controls['entityId'].setValue(EntityDetails['defaultEntityId']);
                    EntityDetails = JSON.parse(localStorage['EntityDetails'])
                    if(this.entityDefault == data['Data']['DefaultEntityId']){
                        this.entityform.controls['isDefault'].setValue(true);
                    }
                    else{
                        this.entityform.controls['isDefault'].setValue(false);
                    }
                }
            }
        )
    }

    selectedEntities() {
        let sessionUser = JSON.parse(localStorage['Session_name'])
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                console.log(data['Data'], 'Check Now')
                this.selectedDivisions = this.multiDimensionalUnique(data['Data']['DivisionIdnNames'])
                this.entityform.controls['isDefault'].setValue(false);
            }
        )
    }

    // getDivisionofSelected(selectedEntities: any[]) {
    //     this.selectedDivisions = [];
    //     this.filteredEntities = selectedEntities
    //     selectedEntities.forEach(element => {
    //         this.selectedDivisions.push({ divisonId: element.divisionId, divisionName: element.divisionName })
    //     }
    //     )
    //     this.selectedDivisions = this.multiDimensionalUnique(this.divisiondata)
    // }

    onDivisionSelect(divisionId: any) {
        this.selectedCountries = [];
        let selectedcoutryIds = [];
        console.log(this.entitiesList, 'ENTTTT')
        this.entitiesList.filter((x) => {
            if (x.divisionId == divisionId) {
                this.selectedCountries.push({ CountryId: x.countryId, CountryName: x.countryName })
                selectedcoutryIds.push(x.countryId)
            }
        })
        this.onLocationSelect(selectedcoutryIds)
        this.selectedCountries = this.multiDimensionalUnique(this.selectedCountries)
        console.log(this.selectedCountries, 'Entites')
        this.entityform.controls['isDefault'].setValue(false);
    }

    onLocationSelect(countryId) {
        this.selectedEntity = []
        this.entitiesList.filter((x) => {
            if (x.countryId == countryId) {
                this.selectedEntity.push({ EntityId: x.entityId, EntityName: x.entityName, EntityCreatedYear: x.EntityCreatedYear })
            }
        })
        this.selectedEntity = this.multiDimensionalUnique(this.selectedEntity)
        this.entityform.controls['isDefault'].setValue(false);
    }
    onEntitySelect(EntityId){
        this.years =[];
        this.selectedEntity.filter((x) => {
            if(x.EntityId == EntityId){
                console.log(this.getDifferenceYears(x.EntityCreatedYear),'years')
            }
        })
        var EntityDetails = JSON.parse(localStorage['EntityDetails'])
        if(EntityId == EntityDetails['defaultEntityId']){
            this.entityform.controls['isDefault'].setValue(true);
        }
        else{
            this.entityform.controls['isDefault'].setValue(false);
        }
    }

    getDifferenceYears(year){
        this.differenceYears =[];
        for(this.i= year; this.i<(new Date()).getFullYear()+1; this.i++){
          this.differenceYears.push(this.i)
        }
        return this.differenceYears
      }
    multiDimensionalUnique(arr: any[]) {
        var uniques = [];
        var itemsFound = {};
        for (var i = 0, l = arr.length; i < l; i++) {
            var stringified = JSON.stringify(arr[i]);
            if (itemsFound[stringified]) { continue; }
            uniques.push(arr[i]);
            itemsFound[stringified] = true;
        }
        return uniques;
    }
}

  //Ends Here