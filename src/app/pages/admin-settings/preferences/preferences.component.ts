import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  selectedValue: string;
  values = [
    {value: '10', viewValue: '10'},
    {value: '20', viewValue: '20'},
    {value: '50', viewValue: '50'},
    {value: '100', viewValue: '100'}
  
  ];

  constructor() { }

  ngOnInit() {
  }

}
