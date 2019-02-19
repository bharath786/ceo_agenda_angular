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
        var EntityDetails = JSON.parse(sessionStorage['EntityDetails'])
        if (EntityDetails.assignedEntities < 1) {
            this.openDialog()
        }
        if (EntityDetails.assignedEntities == 1) {

        }
        if (EntityDetails.assignedEntities > 1) {
            if (EntityDetails.defaultEntityId == null) {
                this.openDialog1();
            }
            else {

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
        sessionStorage.clear()
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
            'isDefault': false
        });
        this.getEntitiesList();


    }

    ngOnInit() {
    }

    onEntitySubmit(values) {
        console.log(values)
        var EntityDetails = JSON.parse(sessionStorage['EntityDetails'])
        sessionStorage.setItem('EntityDetails',
            JSON.stringify({
                assignedEntities: EntityDetails.assignedEntities,
                defaultCountryId: values['locationId'], defaultDivisionId: values['divId'],
                defaultEntityId: values['entityId'], isDefault: values['isDefault']
            }));
        let sessionUser = JSON.parse(sessionStorage['Session_name'])
        values['userId'] = sessionUser.user_id;
        this.adminsettingsservice.getEntityData(values).subscribe(
            data => {
                console.log(data, 'EntityData')
                this.dialog.closeAll()
                this.appSettings.setIsNewAdded(true);
                // this.router.events.subscribe((res) => {
                // })
                this.router.navigate(['/dashboard']);
                // this.router.navigate([this.router.url]);
            }
        )
    }

    getEntitiesList() {
        this.adminsettingsservice.getAllEntities().subscribe(
            data => {
                console.log(data)
                this.entitiesList = data['data']
                this.selectedEntities();
                var EntityDetails = JSON.parse(sessionStorage['EntityDetails'])
                console.log(EntityDetails)
                if (EntityDetails != null) {
                     console.log(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['divId'].setValue(EntityDetails['defaultDivisionId']);
                    this.onDivisionSelect(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['locationId'].setValue(EntityDetails['defaultCountryId']);
                    this.onLocationSelect(EntityDetails['defaultCountryId'])
                    this.entityform.controls['entityId'].setValue(EntityDetails['defaultEntityId']);
                    this.entityform.controls['isDefault'].setValue(EntityDetails['isDefault']);
                }
            }
        )
    }

    selectedEntities() {
        let sessionUser = JSON.parse(sessionStorage['Session_name'])
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                console.log(data)
                this.selectedDivisions = this.multiDimensionalUnique(data['DivisionIdnNames']);

                // this.selectedCountries = this.multiDimensionalUnique(data['CountryIdnNames']);
                //this.selectedEntity = this.multiDimensionalUnique(data['EntityIdnNames']);
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
        console.log(this.entitiesList, 'ENTTTT^')
        this.entitiesList.filter((x) => {
            if (x.divisionId == divisionId) {
                this.selectedCountries.push({ CountryId: x.countryId, CountryName: x.countryName })
            }
        })
        this.selectedCountries = this.multiDimensionalUnique(this.selectedCountries)
        console.log(this.selectedCountries, 'Entites')
    }

    onLocationSelect(countryId) {
        this.selectedEntity = []
        this.entitiesList.filter((x) => {
            if (x.countryId == countryId) {
                this.selectedEntity.push({ EntityId: x.entityId, EntityName: x.entityName })
            }
        })
        this.selectedEntity = this.multiDimensionalUnique(this.selectedEntity)
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