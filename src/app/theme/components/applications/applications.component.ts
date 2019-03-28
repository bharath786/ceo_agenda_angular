import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { constructor } from 'daterangepicker';
import 'rxjs/add/operator/map';
import { ModalDirective } from 'ngx-bootstrap';
import { MatDialog } from '@angular/material';
import { selectEntity } from 'src/app/pages/admin-dashboard/admin-dashboard.component';




@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationsComponent implements OnInit {

  @ViewChild('filterModal') public filterModal: ModalDirective;

  start_date: any;

  end_date: any;
  isFilter: any;
  EntityCode: any;
  isEntityCode : boolean = false;
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  checkEntityCode(){
    this.isEntityCode = false
    if(localStorage['EntityDetails']  != null){
      var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'));
      this.EntityCode = EntityDetails['entityCode'];
      this.isEntityCode = true;
    }
    else{
      this.isEntityCode = false;

    }
    return this.isEntityCode;
  }

  //For Dropdown filter
  selectedValue: string;
  locations = [
    { value: 'Hyderabad-0', viewValue: 'Hyderabad' },
    { value: 'Chennai-1', viewValue: 'Chennai' },
    { value: 'Bangalore-2', viewValue: 'Bangalore' },
    { value: '0', viewValue: 'None' }

  ];
  divisions = [
    { value: 'Project-0', viewValue: 'Project' },
    { value: 'Product-1', viewValue: 'Product' },
    { value: '0', viewValue: 'None' }

  ];
  entities = [
    { value: '0', viewValue: 'Option Matrix' },
    { value: '1', viewValue: 'Option M' },
    { value: 'none', viewValue: 'None' }
  ];

  years = [
    { value: '1', viewValue: '2012' },
    { value: '2', viewValue: '2013' },
    { value: '3', viewValue: '2014' },
    { value: '4', viewValue: '2015' },
    { value: '5', viewValue: '2016' },
    { value: '6', viewValue: '2017' },
    { value: '7', viewValue: '2018' }
  ];

  filterModalToggle(e) {
    if (e == 1) {
      this.openDialog1();
      // this.filterModal.show();
    } else {
      this.filterModal.hide();
    }
  }

  openDialog1() {
    var EntityDetails = JSON.parse(localStorage['EntityDetails'])
    const dialogRef = this.dialog.open(selectEntity, {
      data: EntityDetails ,
      width: '500px'
    }
    );
  }

  stopClickPropagate(event: any) {
    event.stopPropagation();
    event.preventDefault();
  }
}