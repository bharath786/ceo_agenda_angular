import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AdminsettingsService } from '../admin-settings/adminsettings.service';
import { FormBuilder } from '@angular/forms';


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

    constructor(public dialog: MatDialog,
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
    }

    ngOnInit() {
        this.selectedEntities();
        if (this.EntityDetails != null) {
            this.entityform.controls['divId'].setValue(this.EntityDetails['defaultDivisionId']);
            this.entityform.controls['locationId'].setValue(this.EntityDetails['defaultCountryId']);
            this.entityform.controls['entityId'].setValue(this.EntityDetails['defaultEntityId']);
        }
    }

    onEntitySubmit(values) {
        var EntityDetails = JSON.parse(sessionStorage['EntityDetails'])
        sessionStorage.setItem('EntityDetails',
            JSON.stringify({ assignedEntities: EntityDetails.assignedEntities,
                 defaultCountryId: values['locationId'], defaultDivisionId: values['divId'], 
                 defaultEntityId: values['entityId'] }));
        let sessionUser = JSON.parse(sessionStorage['Session_name'])
        values['userId'] = sessionUser.user_id;
        this.adminsettingsservice.getEntityData(values).subscribe(
            data => {
                console.log(data, 'EntityData')
                this.dialog.closeAll()
                window.location.reload();
            }
            
        )
                       
    }

    getEntitiesList() {
        //this.entitiesList = []
        this.adminsettingsservice.getAllEntities().subscribe(
            data => {
                this.entitiesList = data['data']
                if (this.entitiesList.length < 1) {
                    console.log('no data')
                }
                console.log(this.entitiesList)
            },
            error => {
                console.log(error)
            }
        )

        return this.entitiesList;
    }



    selectedEntities() {
        let sessionUser = JSON.parse(sessionStorage['Session_name'])
        this.entitiesList = this.getEntitiesList();
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                this.userSelectedEntities = data['EntityIds'];
                //console.log(this.userSelectedEntities)
                var temprecords = [];
                console.log(this.entitiesList, 'List')
                this.userSelectedEntities.forEach(element => {
                    this.entitiesList.filter((x) => {
                        if (x.entityId == element) {
                            temprecords.push(x)
                        }
                    }
                    )
                });

                this.getDivisionofSelected(temprecords)
                console.log(temprecords)
            }
        )
    }

    getDivisionofSelected(selectedEntities: any[]) {
        this.divisiondata = [];
        this.filteredEntities = selectedEntities
        selectedEntities.forEach(element => {
            this.divisiondata.push({ divisonId: element.divisionId, divisionName: element.divisionName })
        }
        )
        this.divisiondata = this.multiDimensionalUnique(this.divisiondata)
    }

    onDivisionSelect(divisionId) {
        this.locationdata = []
        this.filteredEntities.filter((x) => {
            if (x.divisionId == divisionId) {
                this.locationdata.push({ countryId: x.countryId, countryName: x.countryName })
            }
        })
        this.locationdata = this.multiDimensionalUnique(this.locationdata)
    }

    onLocationSelect(countryId) {
        this.entityarray = []
        this.filteredEntities.filter((x) => {
            if (x.countryId == countryId) {
                this.entityarray.push({ entityId: x.entityId, entityName: x.entityName })
            }
        })
        this.entityarray = this.multiDimensionalUnique(this.entityarray)
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