import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/theme/components/menu/menu.service';
import { MenuItem } from 'primeng/api';
import * as XLSX from 'xlsx';
import { AdminsettingsService } from '../admin-settings/adminsettings.service';
import { GlobalAnalyticsService } from './global-analytics.service';
import { DownloadExcelService } from '../download-excel.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';
import { GetMonthName } from 'src/app/theme/pipes/Months.pipe';
import { Chart } from 'angular-highcharts';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
  selector: 'app-global-analytics-layout',
  templateUrl: './global-analytics-layout.component.html',
  styleUrls: ['./global-analytics-layout.component.scss']
})

export class GlobalAnalyticsLayoutComponent implements OnInit {

  // KPISavedData: kpiData[];
  kpiId: boolean;
  @ViewChild('menuItems') menu: MenuItem[];
  files: any;
  mainvalue: any;
  selectedFile: any;
  menuId$: Observable<any>;
  public filterQuery = "";
  chartData: Chart;
  binaryChartData: Chart;
  chartDataWithScope: Chart;
  binaryChartDataWithScope: Chart;
  // ... your class variables here
  navigationSubscription;
  kpivalue: any;
  dimId: any;
  items: MenuItem[];
  activeItem: MenuItem;
  kpiDetails: any;
  dimensionFrequency: any;
  kpiDataType: any;
  KPIPriorityType: any;
  Data: { 'KPICreatedYear': any; 'KPICreatedMonth': any; 'KPICreatedWeek': any; 'KPIId': any; 'year': number}[];
  Months: any;
  Weeks: any;
  arrayBuffer: any;
  file: File;
  KPIForm: any;
  KPISavedData: any = [];
  KPIScope: any = [];
  ScopeTemplate: any;
  submittedfile: any[];
  scopeData: any = [];
  KPIData: any;
  valid_invalid_ScopeRecords: any = [];
  tempKPIScope: any = [];
  check: boolean;
  inputScopeFile: any;
  validRecords: any;
  isFilePresent: boolean = false;
  weekFilter: any = "";
  monthFilter: any = "";
  KPIFilteredSavedData: any;
  kpiDataTable: any;
  KPIBandDataId: number;
  KPIBandDataForm: FormGroup;
  fileValues: any;
  iskpiDataValid: boolean = false;
  chartsData: any;
  numericWeekly: any;
  scopeList: any = [];
  defaultSelectedScope: any;
  temporaryValue: any;
  summary: boolean = false;
  dimensionSummary: any;
  dimensionExceptions: any;
  exceptions: boolean = false;
  numericValid: boolean = true;
  textValid: boolean = true;

  constructor(private activeRoute: ActivatedRoute,
    private router: Router, public appSettings: AppSettings,
    public _GetMonthName: GetMonthName,
    public menuService: MenuService,
    public _adminsettingservice: AdminsettingsService,
    public excelService: DownloadExcelService,
    public _globalAnalyticsService: GlobalAnalyticsService,
    public snackBar: MatSnackBar,
    public toasterService : ToasterService,
    public Form: FormBuilder) {

    this.KPIForm = Form.group({
      "KPIId": [null],
      "Month": [null, Validators.compose([Validators.required])],
      "Week": [null, Validators.compose([Validators.required])],
      "textData": [null, Validators.compose([Validators.required])],
      "numericData": [null, Validators.compose([Validators.required])],
      "binaryData": [null, Validators.compose([Validators.required])]
    })

    this.KPIBandDataForm = Form.group({
      'numericData': null,
      'textData': null,
      'binaryData': null
    })
  }


  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('kpiDataModal') public kpiDataModal: ModalDirective;

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      this.dimId = atob(params['dimId'].toString());
      this.getTree();
    });
    this.items = [
      { label: 'Highlights', icon: 'fa fa-list-alt' },
    ];
    this.activeItem = this.items[0];
  }

  cancelBand() {
    this.KPIBandDataId = null;
    this.getDataOfKPI();
  }


  onSaveConfirm(ee) {
    console.log(ee)
    ee.confirm.resolve();
  }


  uploadModalToggle(e) {
    this.inputScopeFile = ""
    if (e == 1) {
      this.uploadModal.show();
    }
    else {
      this.file = null;
      this.KPIForm.reset();
      this.uploadModal.hide();
    }
  }

  editBand(data) {
    console.log(data, this.KPIBandDataId)
    this.temporaryValue = data;
    this.KPIBandDataId = data.int_kpi_data_id;

  }

  onSubmitKPI(values) {
    if (!this.KPIBandDataForm.valid) {
      console.log(values,'Checkin FOrmat')
     if(values['numericData'] == null || values['numericData'] == ""){
       this.toasterService.pop('error','','Value Required')
       this.numericValid = false;
     }
     else if(values['numericData'] < this.getMinValue() || values['numericData'] > this.getMaxValue()){
      this.toasterService.pop('error','','Value should be between Min and Max')
      this.numericValid = false;
     }
     else if(values['textData'] == ""){
      this.toasterService.pop('error','','Text Required')
      this.textValid = false;
     }
    }
    else {
      this.textValid = true;
      this.numericValid = true;
      let sessionUser = JSON.parse(localStorage['Session_name']);
      this.KPIBandDataId = null;
      var EntityDetails = JSON.parse(localStorage['EntityDetails']);
      values['year'] = EntityDetails.year;
      values['KPIId'] = this.kpiDetails.KPIId;
      values['Month'] = this.temporaryValue['int_month']
      values['isScopeAvailable'] = this.kpiDetails['isScope'];
      values['KPIDataTypeId'] = this.kpiDetails['dataTypeId'];
      values['Week'] = this.temporaryValue['int_week']
      values['createdById'] = sessionUser.user_id;
      var scopeData = []
      if (this.kpiDetails['dataTypeId'] == 7) {
        scopeData.push({ 'ScopeId': this.temporaryValue['int_scope_id'], 'NumericData': values['numericData'] })
      }
      else if (this.kpiDetails['dataTypeId'] == 6) {

        scopeData.push({ 'ScopeId': this.temporaryValue['int_scope_id'], 'TextData': values['textData'] })

      }
      else if (this.kpiDetails['dataTypeId'] == 8) {

        scopeData.push({ 'ScopeId': this.temporaryValue['int_scope_id'], 'BinaryData': values['binaryData'] })

      }
      else if (this.kpiDetails['dataTypeId'] == 10) {

        scopeData.push({ 'ScopeId': this.temporaryValue['int_scope_id'], 'NumericData': values['numericData'], 'TextData': values['textData'] })
      }
      values['scopeData'] = scopeData;
      this._globalAnalyticsService.saveKPIData(values).subscribe(
        data => {
          console.log(data)
          this.getDataOfKPI();
       this.toasterService.pop('success','',data['message']);

        }
      )

    }
  }

  deleteBand(values) {
    console.log(values);
    var EntityDetails = JSON.parse(localStorage['EntityDetails']);
    values['year'] = EntityDetails.year;
    values['KPIId'] = this.kpiDetails.KPIId;
    values['Month'] = values['int_month'];
    values['isScopeAvailable'] = this.kpiDetails['isScope'];
    values['KPIDataTypeId'] = this.kpiDetails['dataTypeId'];
    values['Week'] = values['int_week'];
    var scopeData = [];
    scopeData.push({ 'ScopeId': values['int_scope_id'], 'NumericData': values['numericData'] })
    values['scopeData'] = scopeData;
    this._globalAnalyticsService.deleteKPIData(values).subscribe(
      data => {
        console.log(data)
        this.getDataOfKPI();
        this.toasterService.pop('success','',data['message']);
      }
    )
  }

  filterWeekKPISavedData(weekId) {
    this.KPIFilteredSavedData = [];
    this.KPIFilteredSavedData = this.KPISavedData.filter(x => x.int_week == weekId)
    console.log(this.KPIFilteredSavedData)
  }

  filterMonthKPISavedData(monthId) {
    this.KPIFilteredSavedData = [];
    this.KPIFilteredSavedData = this.KPISavedData.filter(x => x.int_month == monthId)
    console.log(this.KPIFilteredSavedData)
  }

  onSubmit(values: object) {
    console.log(values)
    this.fileValues = values;
    if (this.kpiDetails.isScope == false) {
      var EntityDetails = JSON.parse(localStorage['EntityDetails']);
      let sessionUser = JSON.parse(localStorage['Session_name']);
      values['createdById'] = sessionUser.user_id;
      values['isScopeAvailable'] = this.kpiDetails['isScope'];
      values['KPIDataTypeId'] = this.kpiDetails['dataTypeId'];
      values['year'] = EntityDetails.year;
      values['KPIId'] = this.kpiDetails.KPIId;
      console.log(values);
      this._globalAnalyticsService.saveKPIData(values).subscribe(
        data => {
          console.log(data)
          this.mainvalue['KPIId'] = this.fileValues['KPIId']
          this.getDataOfKPI();
          this.toasterService.pop('success','',data['message']);
          this.KPIForm.reset();
          // this.isFilePresent = false;
          this.iskpiDataValid = false;
          this.inputScopeFile = "";
        }
      )
    }
    else {
      this.uploadModalToggle(1);
    }
  }

  //Key press function for allowing only numbers
  keyPress(event: any) {
    const pattern = /[0-9/]/;
    let inputValue = Number(event.key);
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar) && inputValue < 5) {
      event.preventDefault();
    }
  }

  //To get teh dimension data from the API
  getTree() {
    //this.menuId$ = this.appSettings.getMenuId();
    // Calling the menu service to get the dimension data of the particular id
    this.menuService.getDimensionData(this.dimId).subscribe(
      data => {
        this.files = data['data']
        let dimensiondata = [];
        dimensiondata[0] = {
          "label": "Summary",
          "expandedIcon": null,
          "collapsedIcon": "fa fa-file green",
          "expanded": false,
          "selectable": true
        };
        dimensiondata[1] = this.files[0];
        dimensiondata[2] = {
          "label": "Exception(s)",
          "expandedIcon": null,
          "collapsedIcon": "fa fa-exclamation-circle red",
          "expanded": false,
          "selectable": true
        };

        this.files = dimensiondata;

        console.log(this.files, "dim data")
        this.selectedFile = this.files['0'];
        this.nodeSelect({ "node": this.selectedFile });
      },
      error => {
        console.log(error)
      }
    );
  }

  activateMenu() {
    this.activeItem = this.menu['activeItem'];
    console.log(this.activeItem)
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

  checkData() {
    if (localStorage['kpiDetails'] != null || localStorage['kpiDetails'] != undefined) {
      this.kpiId = true;
    }
    else {
      this.kpiId = false;
    }
    return this.kpiId;
  }

  //For File Upload
  handleFileSelect(event) {
    var target: HTMLInputElement = event.target as HTMLInputElement;
    for (var i = 0; i < target.files.length; i++) {
      this.file = target.files[i];
    }
    // this.fileScope = event.target.files[0];
    this.Upload()
    console.log(this.file.name)
  }

  //Function to convert data from Excel format to Object format
  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.submittedfile = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      console.log(this.submittedfile)
      this.scopeData = [];
      if (this.kpiDetails['dataTypeId'] == 7) {
        this.submittedfile.forEach(element => {
          this.KPIScope.filter((x) => {
            if (x.vc_scope_code == element["ScopeCode"]) {
              this.scopeData.push({ 'ScopeId': x.int_scope_id, 'NumericData': element['Numeric Data'] })
            }
          })
        })
      }
      else if (this.kpiDetails['dataTypeId'] == 6) {
        this.submittedfile.forEach(element => {
          this.KPIScope.filter((x) => {
            if (x.vc_scope_code == element["ScopeCode"]) {
              this.scopeData.push({ 'ScopeId': x.int_scope_id, 'TextData': element['Text Data'] })
            }
          })
        })
      }
      else if (this.kpiDetails['dataTypeId'] == 8) {
        this.submittedfile.forEach(element => {
          this.KPIScope.filter((x) => {
            if (x.vc_scope_code == element["ScopeCode"]) {
              this.scopeData.push({ 'ScopeId': x.int_scope_id, 'BinaryData': element['Binary Data'] })
            }
          })
        })
      }
      else if (this.kpiDetails['dataTypeId'] == 10) {
        this.submittedfile.forEach(element => {
          this.KPIScope.filter((x) => {
            if (x.vc_scope_code == element["ScopeCode"]) {
              this.scopeData.push({ 'ScopeId': x.int_scope_id, 'NumericData': element['Numeric Data'], 'TextData': element['Text Data'] })
            }
          })
        })
      }
      console.log(this.scopeData, 'Scope File')
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  //For Excel validation
  scopefileValidation() {
    this.valid_invalid_ScopeRecords = [];
    this.tempKPIScope = this.KPIScope;
    if (this.submittedfile.length <= this.tempKPIScope.length) {
      this.uploadModal.hide()
      this.inputScopeFile = ""
      this.iskpiDataValid = true;
      //For Numeric Data Type Validation
      if (this.kpiDetails['dataTypeId'] == 7) {
        this.submittedfile.filter(element => {
          let isvalid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
              //Pushing Valid Records
              this.valid_invalid_ScopeRecords.push({
                'scopeId': x['int_scope_id'],
                'scopeValue': element['ScopeValue'],
                'scopeCode': element['ScopeCode'],
                'numericData': element['Numeric Data'],
                'isValid': true
              })
              isvalid = true;
            }
          })
          if (!isvalid) {
            //Pushing Invalid Records
            this.valid_invalid_ScopeRecords.push({
              'scopeValue': element['ScopeValue'],
              'scopeCode': element['ScopeCode'],
              'numericData': element['Numeric Data'],
              'isValid': false,
              'errorMessage': "Improper scope code or given numeric value is not in KPI range (" + this.getMinValue() + " - " + this.getMaxValue() + ")"
            })
          }
        })
      }
      //For Text Data Type Validation
      else if (this.kpiDetails['dataTypeId'] == 6) {
        this.submittedfile.filter(element => {
          let isvalid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
              //Pushing Valid Records
              this.valid_invalid_ScopeRecords.push({
                'scopeId': x['int_scope_id'],
                'scopeValue': element['ScopeValue'],
                'scopeCode': element['ScopeCode'],
                'textData': element['Text Data'],
                'isValid': true
              })
              isvalid = true;
            }
          })
          //Pushing Invalid Records
          if (!isvalid) {
            this.valid_invalid_ScopeRecords.push({
              'scopeValue': element['ScopeValue'],
              'scopeCode': element['ScopeCode'],
              'textData': element['Text Data'],
              'isValid': false,
              'errorMessage': "Improper scope code or given numeric value is not in KPI range (" + this.getMinValue() + " - " + this.getMaxValue() + ")"
            })
          }
        })
      }
      //For Binary Data Type
      else if (this.kpiDetails['dataTypeId'] == 8) {
        this.submittedfile.filter(element => {
          let isValid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            //Condition to check the record validity
            if (x.vc_scope_code == element["ScopeCode"] && element['Binary Data (Yes/No)'] != null &&
              element['Binary Data (Yes/No)'] != undefined &&
              (element['Binary Data (Yes/No)'].toUpperCase() == 'YES' ||
                element['Binary Data (Yes/No)'].toUpperCase() == 'NO')) {
              //Process to push the valid records
              this.valid_invalid_ScopeRecords.push({
                'scopeId': x['int_scope_id'],
                'scopeValue': element['ScopeValue'],
                'scopeCode': element['ScopeCode'],
                'BinaryData': element['Binary Data (Yes/No)'] == 'yes' ? true : false,
                'isValid': true,
              })
              console.log(this.valid_invalid_ScopeRecords)
              isValid = true;
            }
          })
          if (!isValid) {
            //Pushing Invalid Records
            this.valid_invalid_ScopeRecords.push({
              'scopeValue': element['ScopeValue'],
              'scopeCode': element['ScopeCode'],
              'BinaryData': element['Binary Data (Yes/No)'] == 'yes' ? true : false,
              'isValid': false,
              'errorMessage': "Improper scope code or given numeric value is not in KPI range (" + this.getMinValue() + " - " + this.getMaxValue() + ")"
            })
          }
        })
      }
      //For Text Numeric Data Type
      else if (this.kpiDetails['dataTypeId'] == 10) {
        this.submittedfile.filter(element => {
          let isValid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
              //Pushing the Valid Records
              this.valid_invalid_ScopeRecords.push({
                'scopeId': x['int_scope_id'],
                'scopeValue': element['ScopeValue'],
                'scopeCode': element['ScopeCode'],
                'textData': element['Text Data'],
                'numericData': element['Numeric Data'],
                'isValid': true
              })
              isValid = true;
            }
          })
          if (!isValid) {
            //Pushing Invalid Records
            this.valid_invalid_ScopeRecords.push({
              'scopeId': null,
              'scopeValue': element['ScopeValue'],
              'scopeCode': element['ScopeCode'],
              'textData': element['Text Data'],
              'numericData': element['Numeric Data'],
              'isValid': false,
              'errorMessage': "Improper scope code or given numeric value is not in KPI range (" + this.getMinValue() + " - " + this.getMaxValue() + ")"
            })
          }
        })
      }
      console.log(this.valid_invalid_ScopeRecords, 'validrecords')
      //  let records this.valid_invalid_ScopeRecords.filter()
      this.validRecords = [];
      this.validRecords = this.valid_invalid_ScopeRecords.filter(x => x.isValid == true);
      console.log(this.validRecords, 'Validated Records')
      //Sending Complete Records to ChcFunction
      this.checkFunc(this.validRecords)
      this.isFilePresent = true;

    }
    else {
      this.toasterService.pop('error','Invalid File','Please Check File Format');
      this.inputScopeFile = ""
      this.isFilePresent = false;
    }
  }

  checkFunc(validRecords: any[]) {
    //Checking the Valid Records Length
    if (this.tempKPIScope.length > validRecords.length) {
      //Assigning variable to true of the valid records are less than total records
      this.check = true;
      if (validRecords.length < 1) {
        //Making the variable null if there is no valid record
        this.check = null;
      }
    }
    //Checking all the records are valid or not 
    else if (this.tempKPIScope.length == validRecords.length) {
      // Assigning the variable false if all the records are true(valid)
      this.check = false;
    }
    else {
      this.check = null;
    }
  }

  kpiDataModalToggle(e) {
    if (e == 2) {
      this.iskpiDataValid = false;
      this.inputScopeFile = "";
      this.isFilePresent = false;
      this.file = null;
    }
    else if (e == 3) {
      //Taking the filter entity values from the session
      var EntityDetails = JSON.parse(localStorage['EntityDetails']);
      //Taking the user values from the session
      let sessionUser = JSON.parse(localStorage['Session_name']);
      //Merging all the data to fuilevalues to send (API)
      this.fileValues['createdById'] = sessionUser.user_id;
      this.fileValues['isScopeAvailable'] = this.kpiDetails['isScope'];
      this.fileValues['KPIDataTypeId'] = this.kpiDetails['dataTypeId'];
      this.fileValues['year'] = EntityDetails.year;
      this.fileValues['KPIId'] = this.kpiDetails['KPIId']
      this.fileValues['scopeData'] = this.validRecords;
      console.log(this.fileValues)
      //Sending data to the API
      this._globalAnalyticsService.saveKPIData(this.fileValues).subscribe(
        data => {
          console.log(data)
          this.mainvalue['KPIId'] = this.fileValues['KPIId']
          //Calling the getDataOfKPI to get all the saved data from an API
          this.getDataOfKPI();
          this.toasterService.pop('success','',data['message']);
          this.KPIForm.reset();
          // this.isFilePresent = false;
          this.iskpiDataValid = false;
          this.inputScopeFile = "";
        }
      )
      this.uploadModalToggle(2)
      this.iskpiDataValid = false;
      this.isFilePresent = true;
    }
  }

  //Function for exporting the data by Excel format
  downloadDatasample() {
    this.excelService.exportAsExcelFile(this.ScopeTemplate, 'Scope Template')
  }

  //Function to get the min value of the KPI (used in validation)
  getMinValue() {
    return this.kpiDetails.minMax[0]
  }

  //Function to get the max value of the KPI (used in validation)
  getMaxValue() {
    return this.kpiDetails.minMax[1]
  }

  //Function for every node click on tree
  nodeSelect(event) {
    this.isFilePresent = false;
    this.inputScopeFile = "";
    this.KPIForm.reset();
    // console.log(event['node']['label']);
    this.mainvalue = event['node'];
    this.iskpiDataValid = false;
    var EntityDetails = JSON.parse(localStorage['EntityDetails']);
    console.log(this.mainvalue);
    if (this.mainvalue['KPIId'] != null) {
      this.summary = false;
      this.exceptions = false;
      this.kpiDetails = this.mainvalue;
      this.Data = [{
        'KPICreatedYear': this.mainvalue['KPICreatedYear'],
        'KPICreatedMonth': this.mainvalue['KPICreateMonth'],
        'KPICreatedWeek': this.mainvalue['KPICreatedWeek'],
        'KPIId': this.mainvalue['KPIId'],
        'year': EntityDetails.year
      }];
      this.kpiDataTable = null;
      //For Weekly Frequency
      if (this.kpiDetails['frequencyId'] == 2) {
        this.KPIForm.controls['Month'].setValidators(null);
        if (this.kpiDetails['isScope'] == true) {
          this.KPIForm.controls['Week'].setValidators(Validators.compose([Validators.required]));
          this.KPIForm.controls['textData'].setValidators(null);
          this.KPIForm.controls['binaryData'].setValidators(null);
          this.KPIForm.controls['numericData'].setValidators(null);
          //For Binary Data Validations removing Numeric Data
          if (this.kpiDetails['dataTypeId'] == 8) {
            this.KPIBandDataForm.controls['binaryData'].setValidators(Validators.compose([Validators.required]));
            this.KPIBandDataForm.controls['numericData'].setValidators(null);
            this.KPIBandDataForm.controls['textData'].setValidators(null);
          }
          //For Numeric Data Validations removing Binary Data
          else if (this.kpiDetails['dataTypeId'] == 7) {
            this.KPIBandDataForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]));
            this.KPIBandDataForm.controls['binaryData'].setValidators(null);
            this.KPIBandDataForm.controls['textData'].setValidators(null);
          }
          //For Numeric Data Validations removing Binary Data
          else if (this.kpiDetails['dataTypeId'] == 10) {
            this.KPIBandDataForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]));
            this.KPIBandDataForm.controls['binaryData'].setValidators(null);
            this.KPIBandDataForm.controls['textData'].setValidators(Validators.compose([Validators.required]));
          }
        }
        else {
          //For Data Type
          //For Numeric Data Type 
          if (this.kpiDetails['dataTypeId'] == 7) {
            this.numericWeekly = '';
            this.KPIForm.controls['textData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
          }
          //For Text Data Type
          else if (this.kpiDetails['dataTypeId'] == 6) {
            this.KPIForm.controls['numericData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['textData'].setValidators(Validators.compose([Validators.required]));
          }
          //For Text Numeric Data Type
          else if (this.kpiDetails['dataTypeId'] == 10) {
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
          }
          // For Binary Data Type
          else if (this.kpiDetails['dataTypeId'] == 8) {
            this.KPIForm.controls['numericData'].setValidators(null);
            this.KPIForm.controls['textData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(Validators.compose([Validators.required]));
          }
        }
      }
      else {
        this.KPIForm.controls['Week'].setValidators(null);
        if (this.kpiDetails['isScope'] == true) {
          this.KPIForm.controls['Month'].setValidators(Validators.compose([Validators.required]));
          this.KPIForm.controls['textData'].setValidators(null);
          this.KPIForm.controls['binaryData'].setValidators(null);
          this.KPIForm.controls['numericData'].setValidators(null);
             //For Binary Data Validations removing Numeric Data
             if (this.kpiDetails['dataTypeId'] == 8) {
              this.KPIBandDataForm.controls['binaryData'].setValidators(Validators.compose([Validators.required]));
              this.KPIBandDataForm.controls['numericData'].setValidators(null);
              this.KPIBandDataForm.controls['textData'].setValidators(null);
            }
            //For Numeric Data Validations removing Binary Data
            else if (this.kpiDetails['dataTypeId'] == 7) {
              this.KPIBandDataForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]));
              this.KPIBandDataForm.controls['binaryData'].setValidators(null);
              this.KPIBandDataForm.controls['textData'].setValidators(null);
            }
            //For Text Numeric Data Validations removing Binary Data
            else if (this.kpiDetails['dataTypeId'] == 10) {
              this.KPIBandDataForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]));
              this.KPIBandDataForm.controls['binaryData'].setValidators(null);
              this.KPIBandDataForm.controls['textData'].setValidators(Validators.compose([Validators.required]));
            }
        }
        else {
          //For Data Type
          //For Numeric Data Type 
          if (this.kpiDetails['dataTypeId'] == 7) {
            this.KPIForm.controls['textData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
          }
          //For Text Data Type
          else if (this.kpiDetails['dataTypeId'] == 6) {
            this.KPIForm.controls['numericData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['textData'].setValidators(Validators.compose([Validators.required]))
          }
          //For Text Numeric Data Type
          else if (this.kpiDetails['dataTypeId'] == 10) {
            this.KPIForm.controls['binaryData'].setValidators(null);
            this.KPIForm.controls['numericData'].setValidators(Validators.compose([Validators.min(this.kpiDetails.minMax[0]), Validators.max(this.kpiDetails.minMax[1]), Validators.required]))
            this.KPIForm.controls['textData'].setValidators(Validators.compose([Validators.required]))         
          }
          // For Binary Data Type
          else if (this.kpiDetails['dataTypeId'] == 8) {
            this.KPIForm.controls['numericData'].setValidators(null);
            this.KPIForm.controls['textData'].setValidators(null);
            this.KPIForm.controls['binaryData'].setValidators(Validators.compose([Validators.required]));
          }
        }
      }
      this.getDataOfKPI();
      console.log(this.kpiDetails)
      this.getDimensionFrequencies();
      this.getKpiDataType();
      this.items = [];
      this.items = [
        { label: 'Highlights', icon: 'fa fa-list-alt' },
        { label: 'Data', icon: 'fa fa-folder' }
      ];
      this.activeItem = this.items[0];
    }

    else {
      this.items = [];
      this.items = [
        { label: 'Highlights', icon: 'fa fa-list-alt' }
      ];
      this.activeItem = this.items[0];
      this.kpiDetails = null;
      if (this.mainvalue.label == 'Summary') {
        this.summary = true;
        this.exceptions = false;
        this._globalAnalyticsService.getDimensionSummary(this.dimId).subscribe(
          data => {
            console.log(data);
            this.dimensionSummary = data['DimensionSummary']
          }
        )
      }
      else if (this.mainvalue.label == 'Exception(s)') {
        this.summary = false;
        this.exceptions = true;
        var EntityDetails = JSON.parse(localStorage['EntityDetails']);
        this._globalAnalyticsService.getDimensionExceptions(this.dimId, EntityDetails.year).subscribe(
          data => {
            console.log(data['DimensionExceptions']);
            this.dimensionExceptions = data['DimensionExceptions']
          }
        )
      }
      else {
        this.summary = false;
        this.exceptions = false;
      }

    }
  }

  //Function for chart to get the data for scope member
  onScopeSelect(value) {
    var weekMonthData = [];
    var valueData = [];
    var binaryYes: any = [];
    var binaryNo: any = [];
    var chartDataWithScope = [];
    chartDataWithScope = this.KPISavedData.filter(x => x.int_scope_id == value);
    if (this.kpiDetails.frequencyId == 2) {
      chartDataWithScope.filter(x => {
        weekMonthData.push('Week - ' + x['int_week']);
        valueData.push(x['int_numeric_data'])
      }
      )
    }
    else {
      chartDataWithScope.filter(x => {
        weekMonthData.push(this._GetMonthName.transform(x['int_month']));
        valueData.push(x['int_numeric_data'])
      }
      )
    }
    //For Binary Cahrt Calculation 
    if (chartDataWithScope.length > 0) {
      //Filtering the data for Yes Option
      binaryYes = chartDataWithScope.filter(x => x.bt_binary_data == true)
      //Filtering the data for No option
      binaryNo = chartDataWithScope.filter(x => x.bt_binary_data == false)
      //Calculating the YES percentage from total numbers 
      binaryYes = (binaryYes.length / chartDataWithScope.length) * 100
      //Calculating the NO percentage from the total numbers
      binaryNo = (binaryNo.length / chartDataWithScope.length) * 100
    }

    //Numeric Chart Data with Scope
    this.chartDataWithScope = new Chart({
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: this.kpiDetails.KPIName + ' <b>{point.y}</b>'
      },
      xAxis: {
        categories: weekMonthData,
        title: {
          text: 'Frequency'
        }
      },
      yAxis: {
        title: {
          text: this.kpiDetails.KPIName
        }
      },
      series: <Array<Highcharts.SeriesOptionsType>>[{
        name: this.kpiDetails.KPIName,
        data: valueData
      }]
    });

    //Binary Chart With Scope
    this.binaryChartDataWithScope = new Chart({
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
        text: ''
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
        name: this.kpiDetails.KPIName,
        data: [{
          name: 'Yes',
          y: binaryYes,
        },
        {
          name: 'No',
          y: binaryNo
        }
        ]
      }]
    });
  }

  //Function For Charts data binding
  chartNoScope() {
    var weekMonthData = [];
    var valueData = [];
    var binaryYes: any = [];
    var binaryNo: any = [];
    var scopeList: any = [];
    this.chartData = null;
    //If the Scope is selected 
    if (this.kpiDetails['isScope'] == true) {
      this.scopeList = [];
      //getting all the scope members from the data
      this.KPISavedData.filter(x => {
        this.scopeList.push({ scopeId: x['int_scope_id'], scopeName: x['scopeValue'] })
      })
      //taking unique records by sending the data to multiDimensionalUnique function
      this.scopeList = this.multiDimensionalUnique(this.scopeList)
      //For default selection of scope members
      this.defaultSelectedScope = this.scopeList[0]['scopeId'];
      //Triggering the OnScopeSelect Function to get the value and for cahrt binding
      this.onScopeSelect(this.defaultSelectedScope)
    }
    //Checking the frequency
    if (this.kpiDetails.frequencyId == 2) {
      //Setting the number to Week number and pushing the data to pass this data to chart 
      this.KPISavedData.filter(x => {
        weekMonthData.push('Week - ' + x['int_week']);
        valueData.push(x['int_numeric_data'])
      }
      )
    }
    else {
      //Setting the number to Month Name and pushing the data to pass this data to chart 
      this.KPISavedData.filter(x => {
        //Getting the month name by using the pipe
        weekMonthData.push(this._GetMonthName.transform(x['int_month']));
        valueData.push(x['int_numeric_data'])
      }
      )
    }
    //For Binary Cahrt Calculation 
    if (this.KPISavedData.length > 0) {
      //Filtering the data for Yes Option
      binaryYes = this.KPISavedData.filter(x => x.bt_binary_data == true)
      //Filtering the data for No option
      binaryNo = this.KPISavedData.filter(x => x.bt_binary_data == false)
      //Calculating the YES percentage from total numbers 
      binaryYes = (binaryYes.length / this.KPISavedData.length) * 100
      //Calculating the NO percentage from the total numbers
      binaryNo = (binaryNo.length / this.KPISavedData.length) * 100
    }

    //Chart for Numeric
    this.chartData = new Chart({
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      tooltip: {
        headerFormat: '{point.x}<br />',
        pointFormat: this.kpiDetails.KPIName + ' <b>{point.y}</b>'
      },
      xAxis: {
        categories: weekMonthData,
        title: {
          text: 'Frequency'
        }
      },
      yAxis: {
        title: {
          text: this.kpiDetails.KPIName
        }
      },
      series: <Array<Highcharts.SeriesOptionsType>>[{
        name: this.kpiDetails.KPIName,
        data: valueData

      }]
    });

    //For Binary Chart
    this.binaryChartData = new Chart({
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
        text: ''
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
        name: this.kpiDetails.KPIName,

        data: [{
          name: 'Yes',
          y: binaryYes,

        },
        {
          name: 'No',
          y: binaryNo
        }
        ]
      }]
    });
  }

  //Function to give unique multi-dimensional array (To prevent duplicates) 
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

  getDataOfKPI() {
    this.monthFilter = "";
    this.weekFilter = "";
    this.filterQuery = "";
    //Calling an API to get all the saved data
    this._globalAnalyticsService.getKPIMonthsWeeks(this.Data).subscribe(
      data => {
        this.KPISavedData = data['KPISavedData']
        this.KPIFilteredSavedData = data['KPISavedData']
        this.KPIScope = data['KPIScope']
        console.log(data, 'KPI months and weeks');
        this.Months = data['Months'];
        this.Weeks = data['Weeks']
        this.chartNoScope();
        if (this.kpiDetails['isScope'] == true) {
          console.log(this.KPIScope)
          this.ScopeTemplate = [];
          //For Numeric Data Type 
          if (this.kpiDetails['dataTypeId'] == 7) {
            this.KPIScope.forEach(element => {
              this.ScopeTemplate.push({
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Numeric Data': null,
              })
            });
            // this.ScopeTemplate['Numeric Data ('+this.kpiDetails.minMax[0]+' - '+this.kpiDetails.minMax[1]+')'] = null;
          }
          //For Text Data Type
          else if (this.kpiDetails['dataTypeId'] == 6) {
            //For Generating Scope Template for Text Data Type
            this.KPIScope.forEach(element => {
              this.ScopeTemplate.push({
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Text Data': null,
              })
            });
          }
          //For Text Numeric Data Type
          else if (this.kpiDetails['dataTypeId'] == 10) {
            //For Generating Scope Template for Text Numeric Data Type
            this.KPIScope.forEach(element => {
              this.ScopeTemplate.push({
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Text Data': null, 'Numeric Data': null
              })
            });
            //   this.ScopeTemplate['Numeric Data ('+this.kpiDetails.minMax[0]+' - '+this.kpiDetails.minMax[1]+')'] = null;
          }
          // For Binary Data Type
          else if (this.kpiDetails['dataTypeId'] == 8) {
            //For Generating Scope Template for Binary Data Type
            this.KPIScope.forEach(element => {
              this.ScopeTemplate.push({
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Binary Data (Yes/No)': null
              })
            });
          }
        }
      }
    )
  }

  //Function for binding the saved data values to their inputs based on the month and week selection
  onWeekMonthSelection(Id) {
    this.KPIData = []
    this.KPIData = this.KPISavedData.filter(x => x.int_week == Id || x.int_month == Id)
    //Checking for the data
    if (this.KPIData.length > 0) {
      this.KPIForm.controls['numericData'].setValue(this.KPIData[0]['int_numeric_data'])
      this.KPIForm.controls['textData'].setValue(this.KPIData[0]['vc_text_data'])
      if (this.KPIData[0]['bt_binary_data'] != null)
        this.KPIForm.controls['binaryData'].setValue(this.KPIData[0]['bt_binary_data'].toString())
    }
    //If there is no data
    else {
      this.KPIForm.controls['numericData'].setValue(null)
      this.KPIForm.controls['textData'].setValue(null)
      this.KPIForm.controls['binaryData'].setValue(null)
    }
  }
}
