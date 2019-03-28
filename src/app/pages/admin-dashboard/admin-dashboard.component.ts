import { Component, OnInit, Inject } from '@angular/core';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AdminsettingsService } from '../admin-settings/adminsettings.service';
import { FormBuilder } from '@angular/forms';
import { AppSettings } from 'src/app/app.settings';
import { Chart } from 'angular-highcharts';
import { AppService } from 'src/app/app.service';
import { MonthAppModule } from 'src/app/theme/pipes/MonthappModul.pipe';


@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

    start_date: any;
    barChartDataforExceptions: Chart;
    exceptionDimensionSpecific: Chart;
    end_date: any;
    presentMonthExceptions: any;
    TotalCompliance: any;
    TotalExceptions: any;
    PresentMonthCompliance: any;
    monthlyExceptionsBarChart: any = [];
    categoryExceptions: any = [];
    exceptionCategorySpecific: Chart;
    DimensionExceptions: any = [];
    last10Exceptions: any = [];
    constructor(private appSettings: AppSettings,
        public dialog: MatDialog, public router: Router,
        public _appService: AppService,
        public _monthNameAppModule: MonthAppModule,
        public _adminsettings: AdminsettingsService) {
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        var userSession = JSON.parse(localStorage.getItem('Session_name'))
        if (EntityDetails.assignedEntities < 1) {

            if (userSession.email != "admin@ceo.com") {
                this.openDialog();
            }

        }
        // if (EntityDetails.assignedEntities == 1) {
        //     this.appSettings.setIsNewAdded(true);
        // }

        if (EntityDetails.assignedEntities >= 1) {
            if (EntityDetails.defaultEntityId == null) {
                this.openDialog1();
            }
        }


        // subscribe to the router events - storing the subscription so
        // we can unsubscribe later. 
        this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                if (this.appSettings.isfilterSubmitted()) {
                    this.getDashboardData();
                }
            }
        });
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
        this.getDashboardData();
    }



    getDashboardData() {
        var MonthData = [];
        var Values = [];
        var DimensionExceptions = [];
        var CategoryExceptions = [];
        let EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'));
        this._appService.getDashboardData(EntityDetails.defaultEntityYear, EntityDetails.defaultEntityId).subscribe(
            data => {
                console.log(data)
                this.presentMonthExceptions = data['PresentMonthExceptions'];
                this.PresentMonthCompliance = data['PresentMonthCompliance'];
                this.TotalExceptions = data['TotalExceptions'];
                this.TotalCompliance = data['TotalCompliance'];
                this.monthlyExceptionsBarChart = data['MonthlyExceptions'];
                this.categoryExceptions = data['CategoryExceptionss']
                this.DimensionExceptions = data['DimensionExceptionss'];
                this.last10Exceptions = data['Top10Exceptions'];
                this.monthlyExceptionsBarChart.filter(x => {
                    MonthData.push(this._monthNameAppModule.transform(x['MonthID']));
                    Values.push(x['ExceptionCount'])
                })

                this.DimensionExceptions.filter(x => {
                    DimensionExceptions.push({ name: x['DimensionName'], y: x['DimensionExceptions'] });
                })
                this.categoryExceptions.filter(x => {
                    CategoryExceptions.push({ name: x['CategoryName'], y: x['CategoryExceptions'] });
                    // categories.push(x['ExceptionCount'])

                })
                console.log(CategoryExceptions)

                // Numeric Chart Data with Scope
                this.barChartDataforExceptions = new Chart({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Exceptions for ' + EntityDetails.defaultEntityYear
                    },
                    legend: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: MonthData,
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Exceptions'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                            '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    series: <Array<Highcharts.SeriesOptionsType>>[{
                        name: 'Exceptions',
                        data: Values

                    }]
                });

                this.exceptionCategorySpecific = new Chart({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },

                    legend: {
                        enabled: false,
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Exceptions for Category Level'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: <Array<Highcharts.SeriesOptionsType>>[{
                        name: 'Exceptions',
                        data: CategoryExceptions
                    }]
                })

                this.exceptionDimensionSpecific = new Chart({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: 'Exceptions for Dimension Level'
                    },
                    legend: {
                        enabled: false,
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: <Array<Highcharts.SeriesOptionsType>>[{
                        name: 'Exceptions',
                        data: DimensionExceptions
                    }]
                })


            },
            error => {
                console.log(error)
            }
        )

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
    selectedEntityCode: any[];
    UniqueEntitiesList: any;
    years: any[];
    i: any;
    differenceYears: any = [];

    constructor(public dialog: MatDialog,
        private appSettings: AppSettings,
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
        console.log(values, 'VAlues Format')
        var entityCodeSet = this.selectedEntityCode.filter(x => x.EntityId == values['entityId'])
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        localStorage.setItem('EntityDetails',
            JSON.stringify({
                assignedEntities: EntityDetails.assignedEntities,
                defaultCountryId: values['locationId'], defaultDivisionId: values['divId'],
                entityCode: entityCodeSet[0]['EntityCode'], defaultEntityId: values['entityId'],
                defaultEntityYear: values['year'], isDefault: values['isDefault']
            }));
        let sessionUser = JSON.parse(localStorage.getItem('Session_name'))
        values['userId'] = sessionUser.user_id;
        this.adminsettingsservice.getEntityData(values).subscribe(
            data => {
                console.log(data, 'EntityData')
                this.dialog.closeAll()
                this.appSettings.setIsNewAdded(true);
                this.appSettings.filterSubmitted(true);
                this.router.navigate(['/dashboard']);
            }
        )
    }

    getEntitiesList() {
        let sessionUser = JSON.parse(localStorage.getItem('Session_name'))
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                console.log(data)
                this.entitiesList = data['data']
                this.UniqueEntitiesList = this.selectedEntities();
                var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
                console.log(EntityDetails,'DD')
                if (EntityDetails != null) {
                    console.log(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['divId'].setValue(EntityDetails['defaultDivisionId']);
                    this.onDivisionSelect(EntityDetails['defaultDivisionId'])
                    this.entityform.controls['locationId'].setValue(EntityDetails['defaultCountryId']);
                    this.onLocationSelect(EntityDetails['defaultCountryId'])
                    this.entityform.controls['entityId'].setValue(EntityDetails['defaultEntityId']);
                    this.onEntitySelect(EntityDetails['defaultEntityId'])
                    this.entityform.controls['year'].setValue(EntityDetails['defaultEntityYear']);
                    EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
                    // if (this.entityDefault == data['Data']['DefaultEntityId']) {
                    this.entityform.controls['isDefault'].setValue(data['data'][0]['isDefault']);
                    // }
                    // else {
                        // this.entityform.controls['isDefault'].setValue(false);
                    // }
                }
            }
        )
    }

    selectedEntities() {
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        let sessionUser = JSON.parse(localStorage.getItem('Session_name'))
        this.adminsettingsservice.getUserEntitiesList(sessionUser.user_id).subscribe(
            data => {
                console.log(data['Data'], 'Check Now')
                this.selectedEntityCode = data['Data']['EntityIdnNames'];
                this.selectedDivisions = this.multiDimensionalUnique(data['Data']['DivisionIdnNames'])
                this.entityform.controls['isDefault'].setValue(EntityDetails.isDefault);
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
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
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
        this.entityform.controls['isDefault'].setValue(EntityDetails.isDefault);
    }

    onLocationSelect(countryId) {
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        this.selectedEntity = []
        this.entitiesList.filter((x) => {
            if (x.countryId == countryId) {
                this.selectedEntity.push({ EntityId: x.entityId, EntityName: x.entityName, EntityCreatedYear: x.EntityCreatedYear })
            }
        })
        this.onEntitySelect(this.selectedEntity)
        this.selectedEntity = this.multiDimensionalUnique(this.selectedEntity)
        this.entityform.controls['isDefault'].setValue(EntityDetails.isDefault);
        this.entityform.controls['year'].setValue(null);
    }
    onEntitySelect(EntityId) {
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        this.years = [];
        this.selectedEntity.filter((x) => {
            if (x.EntityId == EntityId) {
                console.log(this.getDifferenceYears(x.EntityCreatedYear), 'years')
            }
        })
        var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
        this.entityform.controls['isDefault'].setValue(EntityDetails.isDefault);

        // if (EntityId == EntityDetails['defaultEntityId']) {
        //     this.entityform.controls['isDefault'].setValue(true);
        // }
        // else {
        //     this.entityform.controls['isDefault'].setValue(false);
        // }
    }

    getDifferenceYears(year) {
        this.differenceYears = [];
        for (this.i = year; this.i < (new Date()).getFullYear() + 1; this.i++) {
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