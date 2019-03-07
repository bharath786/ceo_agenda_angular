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


@Component({
  selector: 'app-global-analytics-layout',
  templateUrl: './global-analytics-layout.component.html',
  styleUrls: ['./global-analytics-layout.component.scss']

})


export class GlobalAnalyticsLayoutComponent implements OnInit {

  kpiId: boolean;
  @ViewChild('menuItems') menu: MenuItem[];
  files: any;
  mainvalue: any;
  selectedFile: any;
  menuId$: Observable<any>;
  public filterQuery = "";

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
  Data: { 'KPICreatedYear': any; 'KPICreatedMonth': any; 'KPICreatedWeek': any; 'KPIId': any; }[];
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

  constructor(private activeRoute: ActivatedRoute,
    private router: Router, public appSettings: AppSettings,
    public menuService: MenuService,
    public _adminsettindservice: AdminsettingsService,
    public excelService: DownloadExcelService,
    public _globalAnalyticsService: GlobalAnalyticsService,
    public snackBar: MatSnackBar,
    public Form: FormBuilder) {

    this.KPIForm = Form.group({
      "KPIid": [null],
      "Month": [null, Validators.compose([Validators.required])],
      "Week": [null, Validators.compose([Validators.required])],
      "textData": [null, Validators.compose([Validators.required])],
      "numericData": [null, Validators.compose([Validators.required])],
      "binaryData": [null, Validators.compose([Validators.required])]
    })
  }

  @ViewChild('uploadModal') public uploadModal: ModalDirective;
  @ViewChild('kpiDataModal') public kpiDataModal: ModalDirective;

  ngOnInit() {
    this.activeRoute.params.subscribe(params => {
      // this.dimId = crypto.DES.decrypt(params['dimId'].toString(), "DIMID").toString(crypto.enc.Utf8);
      this.dimId = atob(params['dimId'].toString());
      this.getTree();
    });
    this.items = [
      { label: 'Highlights', icon: 'fa fa-list-alt' },
    ];
    this.activeItem = this.items[0];
  }

  uploadModalToggle(e) {
    this.inputScopeFile = ""
    if (e == 1) {
      this.uploadModal.show();
    }
    else {
      this.uploadModal.hide();
    }
  }

  filterWeekKPISavedData(weekId){
    this.KPIFilteredSavedData = [];
    this.KPIFilteredSavedData = this.KPISavedData.filter(x=>x.int_week == weekId)
    console.log(this.KPIFilteredSavedData)
  }

  filterMonthKPISavedData(monthId){
    this.KPIFilteredSavedData = [];
    this.KPIFilteredSavedData = this.KPISavedData.filter(x=>x.int_month == monthId)
    console.log(this.KPIFilteredSavedData)
  }

  onSubmit(values: object) {
    console.log(values)
    var EntityDetails = JSON.parse(localStorage['EntityDetails']);
    let sessionUser = JSON.parse(localStorage['Session_name']);
    values['createdById'] = sessionUser.user_id;
    values['isScopeAvailable'] = this.kpiDetails['isScope'];
    values['KPIDataTypeId'] = this.kpiDetails['dataTypeId'];
    values['year'] = EntityDetails.year;
    values['KPIId'] = this.kpiDetails['KPIId']
    values['scopeData'] = this.validRecords;
    console.log(values)
    this._globalAnalyticsService.saveKPIData(values).subscribe(
      data => {
        console.log(data)
        this.mainvalue['KPIId'] = values['KPIId']
        this.getDataOfKPI();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass: ['greenSnackbar'],
        });
        this.KPIForm.reset();
        this.isFilePresent = false;
        this.inputScopeFile = "";
      }
    )

  }


  keyPress(event: any) {
    const pattern = /[0-9/]/;
    let inputValue = Number(event.key);
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar) && inputValue < 5) {
      event.preventDefault();
    }
  }

  getTree() {
    //this.menuId$ = this.appSettings.getMenuId();
    this.menuService.getDimensionData(this.dimId).subscribe(
      data => {
        this.files = data['data']
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
    this._adminsettindservice.getDimensionFrequency().subscribe(
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
    this._adminsettindservice.getKpiDataType().subscribe(
      data => {
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.kpiDataType = this.kpiDataType.filter(x => x.lookupId == this.kpiDetails.dataTypeId)
        this.kpiDataType = this.kpiDataType[0]['lookupName']
        this.KPIPriorityType = data['data1']
        this.KPIPriorityType = this.KPIPriorityType.filter(x => x.lookupId == this.kpiDetails.PriorityTypeId)
        this.KPIPriorityType = this.KPIPriorityType[0]['lookupName']
        console.log(this.KPIPriorityType, 'proiritytype')
        // if (this.kpiDetails['isScope'] == true) {
        //   this.KPIForm.controls['NumericData'].setValidators(null);
        //   this.KPIForm.controls['TextData'].setValidators(null);
        //   this.KPIForm.controls['BinaryData'].setValidators(null);
        // }
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

  scopefileValidation() {
    this.valid_invalid_ScopeRecords = [];
    this.tempKPIScope = this.KPIScope;
    if (this.submittedfile.length <= this.tempKPIScope.length) {
      this.uploadModal.hide()
      this.inputScopeFile = ""
      this.kpiDataModal.show();
      if (this.kpiDetails['dataTypeId'] == 7) {
        this.submittedfile.filter(element => {
          let isvalid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
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
      else if (this.kpiDetails['dataTypeId'] == 6) {
        this.submittedfile.filter(element => {
          let isvalid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
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
      else if (this.kpiDetails['dataTypeId'] == 8) {
        this.submittedfile.filter(element => {
          let isValid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
              this.valid_invalid_ScopeRecords.push({
                'scopeId': x['int_scope_id'],
                'scopeValue': element['ScopeValue'],
                'scopeCode': element['ScopeCode'],
                'binaryData': element['Binary Data'],
                'isValid': true,
              })
            }
          })
          if (!isValid) {
            this.valid_invalid_ScopeRecords.push({
              'scopeValue': element['ScopeValue'],
              'scopeCode': element['ScopeCode'],
              'binaryData': element['Binary Data'],
              'isValid': false,
              'errorMessage': "Improper scope code or given numeric value is not in KPI range (" + this.getMinValue() + " - " + this.getMaxValue() + ")"
            })
          }
        })
      }
      else if (this.kpiDetails['dataTypeId'] == 10) {
        this.submittedfile.filter(element => {
          let isValid = false;
          let code = '';
          this.tempKPIScope.forEach((x) => {
            code = x.vc_scope_code;
            if (x.vc_scope_code == element["ScopeCode"] && element['Numeric Data'] != null && element['Numeric Data'] != undefined &&
              element['Numeric Data'] >= this.getMinValue() && element['Numeric Data'] <= this.getMaxValue()) {
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
      this.checkFunc(this.validRecords)
      this.isFilePresent = true;

    }
    else {
      this.snackBar.open('Please Check File Format', 'OK', {
        panelClass: ['redSnackbar'],
      });
      this.inputScopeFile = ""
      this.isFilePresent = false;
    }
  }

  checkFunc(validRecords: any[]) {
    if (this.tempKPIScope.length > validRecords.length) {
      this.check = true;
      if (validRecords.length < 1) {
        this.check = null;
      }
    }
    else if (this.tempKPIScope.length == validRecords.length) {
      this.check = false;
    }
    else {
      this.check = null;
    }
  }

  kpiDataModalToggle(e) {
    if (e == 2) {
      this.kpiDataModal.hide();
      this.inputScopeFile = "";
      this.isFilePresent = false;
    }
    else if(e == 3 ){
      this.kpiDataModal.hide();
      this.isFilePresent = true;
    }
  }

  downloadDatasample() {
    this.excelService.exportAsExcelFile(this.ScopeTemplate, 'Scope Template')
  }

  getMinValue() {
    return this.kpiDetails.minMax[0]
  }

  getMaxValue() {
    return this.kpiDetails.minMax[1]
  }

  nodeSelect(event) {
    this.isFilePresent = false;
    this.inputScopeFile = "";
    this.KPIForm.reset();
    // console.log(event['node']['label']);
    this.mainvalue = event['node'];
    console.log(this.mainvalue);
    if (this.mainvalue['KPIId'] != null) {
      this.kpiDetails = this.mainvalue;
      this.Data = [{
        'KPICreatedYear': this.mainvalue['KPICreatedYear'],
        'KPICreatedMonth': this.mainvalue['KPICreateMonth'],
        'KPICreatedWeek': this.mainvalue['KPICreatedWeek'],
        'KPIId': this.mainvalue['KPIId']
      }];
      //For Weekly Frequency
      if (this.kpiDetails['frequencyId'] == 2) {
        this.KPIForm.controls['Month'].setValidators(null);
        if (this.kpiDetails['isScope'] == true) {
          this.KPIForm.controls['Week'].setValidators(Validators.compose([Validators.required]));
          this.KPIForm.controls['textData'].setValidators(null);
          this.KPIForm.controls['binaryData'].setValidators(null);
          this.KPIForm.controls['numericData'].setValidators(null);
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
    }
  }

  getDataOfKPI() {
    this.monthFilter = ""
    this.weekFilter = ""
    this.filterQuery = ""
    this._globalAnalyticsService.getKPIMonthsWeeks(this.Data).subscribe(
      data => {
        this.KPISavedData = data['KPISavedData']
        this.KPIFilteredSavedData = data['KPISavedData']
        this.KPIScope = data['KPIScope']
        console.log(data, 'KPI months and weeks');
        this.Months = data['Months'];
        this.Weeks = data['Weeks']
        if (this.kpiDetails['isScope'] == true) {
          console.log(this.KPIScope)
          this.ScopeTemplate = [];
          //For Numeric Data Type 
          if (this.kpiDetails['dataTypeId'] == 7) {
            this.KPIScope.forEach(element => {
              this.ScopeTemplate = [{
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Numeric Data': null,
              }]
            });
            // this.ScopeTemplate['Numeric Data ('+this.kpiDetails.minMax[0]+' - '+this.kpiDetails.minMax[1]+')'] = null;
          }
          //For Text Data Type
          else if (this.kpiDetails['dataTypeId'] == 6) {
            this.KPIScope.forEach(element => {
              this.ScopeTemplate = [{
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Text Data': null,
              }]
            });
          }
          //For Text Numeric Data Type
          else if (this.kpiDetails['dataTypeId'] == 10) {
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
            this.KPIScope.forEach(element => {
              this.ScopeTemplate = [{
                'ScopeValue': element['vc_scope_value'], 'ScopeCode': element['vc_scope_code'],
                'Binary Data (Yes/No)': null
              }]
            });
          }
        }
      }
    )
  }

  onWeekMonthSelection(Id) {
    console.log(this.KPISavedData)
    this.KPIData = []
    this.KPIData = this.KPISavedData.filter(x => x.int_week == Id || x.int_month == Id)
    if (this.KPIData.length > 0) {
      this.KPIForm.controls['numericData'].setValue(this.KPIData[0]['int_numeric_data'])
      this.KPIForm.controls['textData'].setValue(this.KPIData[0]['vc_text_data'])
      if (this.KPIData[0]['bt_binary_data'] != null)
        this.KPIForm.controls['binaryData'].setValue(this.KPIData[0]['bt_binary_data'].toString())
    }
    else {
      this.KPIForm.controls['numericData'].setValue(null)
      this.KPIForm.controls['textData'].setValue(null)
      this.KPIForm.controls['binaryData'].setValue(null)
    }

  }
}
