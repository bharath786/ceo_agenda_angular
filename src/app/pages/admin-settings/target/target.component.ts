import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AdminsettingsService } from '../adminsettings.service';
import { DownloadExcelService } from '../../download-excel.service';
import { MatSnackBar, MatOptionSelectionChange } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss']
})
export class TargetComponent implements OnInit {

  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('downloadModal') public downloadModal: ModalDirective;


  //For Steup Tree
  files: TreeNode[] = [];
  //For selected File
  public filterQuery = "";
  weekFilter: any = "";
  monthFilter: any = "";
  selectedFile: TreeNode[];
  mainvalue: any;
  somevalue: any;
  addtoggle: any;
  selectedradiobtn = 1;
  scopeValue: boolean;
  analyticsId: any;
  dimensionId: any;
  KRAId: any;
  KPIId: any;
  KPIHigherOrLower: any;
  allforms: string;
  sessionUser: any;
  dimensionform: any;
  fileName: any;
  kpiDetails: any;
  KPIPriorityType: any;
  kpiDataType: any;
  dimensionFrequency: any;
  Months: any;
  Weeks: any;
  targetForm: any;
  targetData: any[];
  targetSavedData: any;
  Data: { 'KPICreatedYear': any; 'KPICreatedMonth': any; 'KPICreatedWeek': any; 'KPIId': any; 'year':number}[];
  KPIFilteredTargetData: any[];
  isRead: any = false;
  isWrite: any = false;

  constructor(private _adminsettingservice: AdminsettingsService,
    public fb: FormBuilder, public snackBar: MatSnackBar,
    private excelService: DownloadExcelService,
    private setupservice: AdminsettingsService, public router: Router,
    public toasterService: ToasterService) {
    //Form to Update Target Values
    this.targetForm = this.fb.group({
      'KPIId': null,
      'numericData': null,
      'Month': null,
      'Week': null
    });

    let PermsissionDetails = [];
    PermsissionDetails = JSON.parse(localStorage['userPermissions']);
    PermsissionDetails = PermsissionDetails['PermissionArray']
    console.log(PermsissionDetails,'User Permissions')
    let Userdetails = JSON.parse(localStorage['Session_name']);
    if(Userdetails.email == 'admin@ceo.com')
    {
      this.isRead = true;
      this.isWrite = true;
    }
    else{
     var permissionlist = [];
     permissionlist =  PermsissionDetails.filter(x=>x.screen_name == 'Target');
     if(permissionlist.length > 0){
       this.isRead = permissionlist[0]['bt_isRead'];
       this.isWrite = permissionlist[0]['bt_isWrite'];
     }
     else{
      this.isRead = false;
      this.isWrite = false;
     }
    }

  }

  ngOnInit() {
    //For Loading setup Tree On Load
    this.getSetup();
  }

  //For Getting Dimension Frequencies for Dropdown
  getDimensionFrequencies() {
    this._adminsettingservice.getDimensionFrequency().subscribe(
      data => {
        //Assigning the values to the dimension frequency variable
        this.dimensionFrequency = data['data']
        this.dimensionFrequency = this.dimensionFrequency.filter(x => x.lookupId == this.kpiDetails.frequencyId);
        this.dimensionFrequency = this.dimensionFrequency[0]['lookupName']
      },
      error => {
        console.log(error);
      }
    )
  }

  onSubmit(value) {
    this.sessionUser = JSON.parse(localStorage.getItem('Session_name'))
    value['KPIId'] = this.kpiDetails['KPIId'];
    var EntityDetails = JSON.parse(localStorage.getItem('EntityDetails'))
    value['year'] = EntityDetails.defaultEntityYear;
    value['createdById'] = this.sessionUser['user_id'],
      this._adminsettingservice.postTargetValues(value).subscribe(
        data => {
          console.log(data)
         this.toasterService.pop('success','',data['message']);
          this.targetForm.reset();
          this.getTargetData();
        }
      )
  }

  //Key press function for allowing only numbers
  keyPress(event: any) {
    const pattern = /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/;
    let inputValue = Number(event.key);
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar) && inputValue < 5) {
      event.preventDefault();
    }
  }

  //Function for binding the saved data values to their inputs based on the month and week selection
  onWeekMonthSelection(Id) {
    console.log(this.targetSavedData)
    this.targetData = []
    this.targetData = this.targetSavedData.filter(x => x.int_week == Id || x.int_month == Id)
    //Checking for the data
    console.log(this.targetData);
    if (this.targetData.length > 0) {
      this.targetForm.controls['numericData'].setValue(this.targetData[0]['int_target'])
    }
    //If there is no data
    else {
      this.targetForm.controls['numericData'].setValue(null)
    }
  }

  //For Getting KPI Data Types for Dropdown
  getKpiDataType() {
    this._adminsettingservice.getKpiDataType().subscribe(
      data => {
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.kpiDataType = this.kpiDataType.filter(x => x.lookupId == this.kpiDetails.dataTypeId)
        this.kpiDataType = this.kpiDataType[0]['lookupName']
        this.KPIPriorityType = data['data1']
        this.KPIPriorityType = this.KPIPriorityType.filter(x => x.lookupId == this.kpiDetails.PriorityTypeId)
        this.KPIPriorityType = this.KPIPriorityType[0]['lookupName']
        console.log(this.KPIPriorityType, 'proiritytype')

      },
      error => {
        console.log(error);
      }
    )
  }

  filterWeekKPITargetData(weekId) {
    this.KPIFilteredTargetData = [];
    this.KPIFilteredTargetData = this.targetSavedData.filter(x => x.int_week == weekId)
    console.log(this.KPIFilteredTargetData)
  }

  filterMonthKPITargetData(monthId) {
    this.KPIFilteredTargetData = [];
    this.KPIFilteredTargetData = this.targetSavedData.filter(x => x.int_month == monthId)
    console.log(this.KPIFilteredTargetData)
  }


  //On Selecting Tree Nodes for Setup Tree
  nodeSelect(event) {
    this.kpiDetails = event['node'];
    console.log(this.kpiDetails)
    var EntityDetails = JSON.parse(localStorage['EntityDetails'])
    this.getKpiDataType();
    this.getDimensionFrequencies();
    this.Data = [{
      'KPICreatedYear': this.kpiDetails['KPICreatedYear'],
      'KPICreatedMonth': this.kpiDetails['KPICreateMonth'],
      'KPICreatedWeek': this.kpiDetails['KPICreatedWeek'],
      'KPIId': this.kpiDetails['KPIId'],
      'year': EntityDetails.defaultEntityYear
    }];

    //Custom Validator for Week Frequency
    if (this.kpiDetails.frequencyId == 2) {
      this.targetForm.controls['Week'].setValidators(Validators.compose([Validators.required]))
      this.targetForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
      this.targetForm.controls['Month'].setValidators(null)
    }
    //Custom Validation for Month Frequency
    else if (this.kpiDetails.frequencyId == 4){
      this.targetForm.controls['Month'].setValidators(Validators.compose([Validators.required]))
      this.targetForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
      this.targetForm.controls['Week'].setValidators(null)
    }
    this.targetForm.reset();
    this.getTargetData();
  }

  getTargetData() {
    this.monthFilter = "";
    this.weekFilter = "";
    this.filterQuery = "";
    this._adminsettingservice.getKPITargetMonthsWeeksData(this.Data).subscribe(
      data => {
        console.log(data, 'KPITARGET');
        this.targetSavedData = data['KPISavedTargetData']
        this.KPIFilteredTargetData = data['KPISavedTargetData']
        this.Months = data['Months'];
        this.Weeks = data['Weeks']
      }
    )
  }

  //For Setup Tree
  getSetup() {
    this.setupservice.getTarget()
      .subscribe(
        files => {
          this.files = files['data'];
          console.log(files['data']['0'])
          this.fileName = null;
        },
        error => {
          console.log(error);
          if (error.status == 401) {
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        });
  }


  //For Setup Tree Starts here
  unselectFile() {
    this.files = null;
  }

  expandAll() {
    this.files.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.files.forEach(node => {
      this.expandRecursive(node, false);
    });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  //Setup tree Ends here

}
