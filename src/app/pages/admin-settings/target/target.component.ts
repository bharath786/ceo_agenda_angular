import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {

  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;



  downloadModalToggle(e){
    if(e==1){
      this.downloadModal.show();
    }
    else{
      this.downloadModal.hide();
    }
  }

  uploadModalToggle(e)
  {
    if(e==1){
      this.uploadModal.show();
    }
    else{
      this.uploadModal.hide();
    }
  }

  locations = [
    {value: 'Hyderabad-0', viewValue: 'Hyderabad'},
    {value: 'Chennai-1', viewValue: 'Chennai'},
    {value: 'Bangalore-2', viewValue: 'Bangalore'},
    {value: '0', viewValue: 'None'}
  
  ];
  divisions = [
    {value: 'Project-0', viewValue: 'Project'},
    {value: 'Product-1', viewValue: 'Product'},
    {value: '0', viewValue: 'None'}
  
  ];
  entities = [
    {value: '0', viewValue: 'Option Matrix'},
    {value: '1', viewValue: 'Option M'},
    {value: 'none', viewValue: 'None'}
  ];

  years = [
    {value: '1', viewValue: '2012'},
    {value: '2', viewValue: '2013'},
    {value: '3', viewValue: '2014'},
    {value: '4', viewValue: '2015'},
    {value: '5', viewValue: '2016'},
    {value: '6', viewValue: '2017'},
    {value: '7', viewValue: '2018'}
  ];

  
  months = [
    {value: '1', viewValue: 'January'},
    {value: '2', viewValue: 'February'},
    {value: '3', viewValue: 'March'},
    {value: '4', viewValue: 'April'},
    {value: '5', viewValue: 'May'},
    {value: '6', viewValue: 'June'},
    {value: '7', viewValue: 'July'},
    {value: '8', viewValue: 'August'},
    {value: '9', viewValue: 'September'},
    {value: '10', viewValue: 'October'},
    {value: '11', viewValue: 'November'},
    {value: '12', viewValue: 'December'}
  ];


  constructor() { }

  ngOnInit() {
  }

}
