import { AdminsettingsService } from './../adminsettings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router, NavigationEnd } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import * as XLSX from 'xlsx';
import { Menu } from 'src/app/theme/components/menu/menu.model';
import { DownloadExcelService } from '../../download-excel.service';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {


  rangeValues: number[] = [];

  @ViewChild('file') fileInput;

  //For Steup Tree
  files: TreeNode[] = [];
  //For selected File
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
  analyticsform: any;
  dimensionform: any;
  KRAform: any;
  KPIform: any;
  dimensionFrequency: any= [];
  scopeInput: any;
  kpiDataType: any;
  fileScope: File;
  todaysDate: number = Date.now();
  fileName: any = null;
  isScopeApplicable: boolean = false;
  //For Confirmation
  popoverTitle: string = 'Delete?';
  popoverMessage: string = "Are You Sure ? You want to delete record, this action can't be undone.";
  confirmText: string = 'Delete <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;
  arrayBuffer: any;
  submittedfile: any;
  fileScopeInput : any;
  uploadedFileFormatChecking: boolean;
  DatatypeId: any;
  rangeApplicableDataType: any;
  datatypeType: boolean;
  isRead: boolean = false;
  isWrite: boolean = false;

  constructor(private appSettings: AppSettings,public toasterService:ToasterService, private excelService: DownloadExcelService, private setupservice: AdminsettingsService, public router: Router, public fb: FormBuilder, public snackBar: MatSnackBar) {

    this.sessionUser = JSON.parse(localStorage['Session_name'])
    //Analytics Update Form
    this.analyticsform = this.fb.group({
      'analyticsId': null,
      'analyticsName': [null, Validators.compose([Validators.required])],
      'analyticsDescription': [null],
      'modifiedBy': this.sessionUser['user_id']
    });

    //Dimension Update Form
    this.dimensionform = this.fb.group({
      'dimensionId': null,
      'dimensionName': [null, Validators.compose([Validators.required])],
      'description': null,
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'analyticsId': null
    });

    //KRA Upsert Form
    this.KRAform = this.fb.group({
      'KRAId': null,
      'KRAName': [null, Validators.compose([Validators.required])],
      'description': [null],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'dimensionId': null
    });

    //KPI Update Form
    this.KPIform = this.fb.group({
      'KPIId': null,
      'KPIName': [null, Validators.compose([Validators.required])],
      'KPICode': [null, Validators.compose([Validators.required])],
      'PriorityTypeId': [null, Validators.compose([Validators.required])],
      'dataTypeId': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'isScope': null,
      'frequencyId': [4],
      'KRAId': null,
      'minMax': [null],
      'filescopeinput': null,
      'scopeAlias': null
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
     permissionlist =  PermsissionDetails.filter(x=>x.screen_name == 'Setup');
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

  dataTypeCheck(event){
    if(event == "7" || event == "10" ){
      this.rangeValues = [];
      this.rangeApplicableDataType = true;
      this.datatypeType = true;
      this.KPIform.controls['PriorityTypeId'].setValidators(null);
    }
      else{
        this.rangeValues = [];
        this.rangeApplicableDataType = false;
        this.datatypeType = true;
        this.KPIform.controls['PriorityTypeId'].setValidators(Validators.compose([Validators.required]));
    }
  }

  customValidation(){
    if(this.rangeApplicableDataType){
      if(this.rangeValues[0] == this.rangeValues[1]){
        return false;
      }
      if(this.rangeValues.length < 2){
        return false;
      }
    }
   
    if(this.isScopeApplicable == true){

      if (this.fileScopeInput == null || this.fileScopeInput == '' || this.uploadedFileFormatChecking == false){
        return false;
      }
      else{
         return true;
      }
    }
    else{
      this.fileScopeInput = "" 
      return true;
    }

  }

  ngOnInit() {
    //For Loading setup Tree On Load
    this.getSetup();
  }

  removeScopeAlias(){
    if(this.isScopeApplicable == false){
      this.KPIform.controls['scopeAlias'].setValue(null);
    }
  }

  //For Updating Analytics
  public onSubmitAnalytics(value: object) {
    this.setupservice.updateAnalytics(value).subscribe(
      data => {
        this.getSetup();
        this.toasterService.pop('success','',data['message']);
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For File Upload
  handleFileSelect(event) {
    var target: HTMLInputElement = event.target as HTMLInputElement;
    for (var i = 0; i < target.files.length; i++) {
      this.fileScope = target.files[i];
    }
    // this.fileScope = event.target.files[0];
    this.Upload()
    console.log(this.fileScope.name)
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
      if(this.submittedfile.length > 0){
      let is_Code_Value_Null = false;

        let codeCheckArray =[];
        this.submittedfile.filter(x=>{
          codeCheckArray.push(x.ScopeCode)
          if(x.ScopeCode == "" || x.ScopeValue == "" || x.ScopeCode == undefined || x.ScopeValue == undefined){
            is_Code_Value_Null = true;
            this.fileScopeInput = '';
            console.log(x,"is_Code_Value_Null")
          }
        })
        
      if(is_Code_Value_Null){
        this.toasterService.pop('error','Invalid File',"System dosn't allow null values")
        this.fileScopeInput = '';
      }
      else if(this.submittedfile.length != this.multiDimensionalUnique(codeCheckArray).length){
          this.toasterService.pop('error','Invalid File',"Please maintain unique scope code")
          this.fileScopeInput = '';
          is_Code_Value_Null = false;
        }
        else{
        this.uploadedFileFormatChecking = true;
        }

      }
    else{
      this.toasterService.pop('error','Invalid File',"No data available in the uploaded file")
      this.fileScopeInput = '';
    }
  }
    fileReader.readAsArrayBuffer(this.fileScope);
  }

  //For Dimesion Upsert
  public onSubmitDimension(value) {
    let EntityDetails = JSON.parse(localStorage['EntityDetails']);
    value['entityId'] = EntityDetails.defaultEntityId;
    this.setupservice.upsertDimension(value).subscribe(

      data => {
        console.log(data);
        if (data['error'] == true) {
        this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.appSettings.setIsNewAdded(true);
          this.router.navigate(['adminsettings/setup']);
        this.toasterService.pop('success','',data['message']);

        }

      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Deleting Dimension 
  onDeleteDimension(value) {
    this.setupservice.deleteDimension(value).subscribe(
      data => {
        if (data['error'] == true) {
        this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.appSettings.setIsNewAdded(true);
          this.router.navigate(['adminsettings/setup']);
          this.toasterService.pop('success','',data['message']);
        }


      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For KRA Upser
  public onSubmitKRA(value: object) {
    console.log(value)
    this.setupservice.upsertKRA(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.toasterService.pop('success','',data['message']);
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Deleting KRA
  onDeleteKRA(value) {
    this.setupservice.deleteKRA(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.toasterService.pop('success','',data['message']);
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For KPI Upsert
  public onSubmitKPI(value: object) {

    if(this.isScopeApplicable == false){
      this.submittedfile = null;
      value['scopeAlias'] = null;
    }
    console.log(value)
    value['scope'] = this.submittedfile
    this.setupservice.upsertKPI(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.toasterService.pop('success','',data['message']);
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  downloadScopesample() {
    let scope = [];
    scope.push({ 'ScopeValue': '', 'ScopeCode': '' })

    console.log(scope)
    this.excelService.exportAsExcelFile(scope, 'ScopeSample');
  }

  //For Deleting KPI
  onDeleteKPI(value) {
    this.setupservice.deleteKPI(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getSetup();
          this.toasterService.pop('success','',data['message']);
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //On Selecting Tree Nodes for Setup Tree
  nodeSelect(event) {
    this.mainvalue = event['node'];
    this.analyticsId = event['node']['analyticsId']
    this.dimensionId = event['node']['dimensionId']
    this.KRAId = event['node']['KRAId']
    this.KPIId = event['node']['KPIId']

    //If the Analytics Selected (for Binding the data to the form)
    if (this.analyticsId != null) {
      this.analyticsform.controls['analyticsName'].setValue(event['node']['analyticsName']);
      this.analyticsform.controls['analyticsDescription'].setValue(event['node']['analyticsDescription']);
      this.analyticsform.controls['analyticsId'].setValue(event['node']['analyticsId']);
      this.allforms = 'updateanalytics';
    }
    //If the Dimension Selected (for Binding the data to the form)
    if (this.dimensionId != null) {
      this.dimensionform.controls['dimensionId'].setValue(event['node']['dimensionId']);
      this.dimensionform.controls['dimensionName'].setValue(event['node']['dimensionName']);
      this.dimensionform.controls['analyticsId'].setValue(event['node']['analyticsId']);
      this.allforms = 'updatedimension';
    }
    //If the KRA Selected (for Binding the data to the form)
    if (this.KRAId != null) {
      this.isScopeApplicable = false;
      this.rangeApplicableDataType = false;
      this.KRAform.controls['KRAId'].setValue(event['node']['KRAId']);
      this.KRAform.controls['KRAName'].setValue(event['node']['KRAName']);
      this.KRAform.controls['description'].setValue(event['node']['description']);
      this.KRAform.controls['dimensionId'].setValue(event['node']['dimensionId']);
      this.allforms = 'updateKRA';
    }
    //If the KPI Selected (for Binding the data to the form)
    if (this.KPIId != null) {
      this.getKpiDataType();
      console.log(event['node'], 'Kpi Data')
      //Calling Dimension Frequencies function
      this.getDimensionFrequencies();
      this.KPIform.controls['KPIId'].setValue(event['node']['KPIId']);
      this.KPIform.controls['KPIName'].setValue(event['node']['KPIName']);
      this.KPIform.controls['KPICode'].setValue(event['node']['KPICode']);
      this.KPIform.controls['PriorityTypeId'].setValue(event['node']['PriorityTypeId']);
      this.KPIform.controls['dataTypeId'].setValue(event['node']['dataTypeId']);
      this.dataTypeCheck(event['node']['dataTypeId']);
      this.KPIform.controls['isScope'].setValue(event['node']['isScope']);
      this.KPIform.controls['KRAId'].setValue(event['node']['KRAId']);
      
      if(event['node']['isScope'] == true){
        this.isScopeApplicable = true
      }
      this.KPIform.controls['frequencyId'].setValue(event['node']['frequencyId']);
      this.KPIform.controls['minMax'].setValue(event['node']['minMax']);
      this.rangeValues = event['node']['minMax'];
      this.KPIform.controls['scopeAlias'].setValue(event['node']['scopeAlias']);

      this.allforms = 'updateKPI';
    }
  }

  //For Adding new Dimension
  adddimension(e) {
    this.dimensionform.reset();
    this.dimensionform.controls['analyticsId'].setValue(this.mainvalue['analyticsId']);
    this.dimensionform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.dimensionform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.fileName = null;
    this.getDimensionFrequencies();
    this.allforms = 'adddimension'
  }

  //For Adding new KRA
  addKRA(e) {
    this.KRAform.reset();
    this.KRAform.controls['dimensionId'].setValue(this.mainvalue['dimensionId']);
    this.KRAform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.KRAform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.allforms = 'addKRA'
  }

  //For Adding New KPI
  addKPI(e) {
    this.KPIform.reset();
      this.getDimensionFrequencies();
    this.KPIform.controls['KRAId'].setValue(this.mainvalue['KRAId']);
    this.KPIform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.KPIform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.getKpiDataType();
    this.allforms = 'addKPI'
  }


  createNewUploadFilesObject() {
    // Create a new BasicInfo
    let newUploadFilesObject = {
      scope: [],
      scopeName: [],
    }
    return newUploadFilesObject;
  }

  //For Getting Dimension Frequencies for Dropdown
  getDimensionFrequencies() {
    this.setupservice.getDimensionFrequency().subscribe(
      data => {
        //Assigning the values to the dimension frequency variable
        this.dimensionFrequency = data['data']
        this.dimensionFrequency = this.dimensionFrequency.filter(x=>x.lookupName == "Monthly" || x.lookupName == "Weekly")
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Getting KPI Data Types for Dropdown
  getKpiDataType() {
    this.setupservice.getKpiDataType().subscribe(
      data => {
        console.log(data, 'Data Type')
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.kpiDataType = this.kpiDataType.filter(x=>x.lookupName != 'List');
        this.KPIHigherOrLower = data['data1']
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Setup Tree
  getSetup() {
    this.setupservice.getSetup()
      .subscribe(
        files => {
          this.files = files['data'];
          this.selectedFile = files['data']['0'];
          console.log(files['data']['0'])
          this.nodeSelect({ "node": this.selectedFile });
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
