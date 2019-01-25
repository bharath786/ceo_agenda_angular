import { AdminsettingsService } from './../adminsettings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

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
  dimensionFrequency: any;
  scopeInput: any;
  kpiDataType: any;
  fileScope: File;
  todaysDate: number = Date.now();
  fileName: any = null;

  //For Confirmation

  popoverTitle: string = 'Delete?';
  popoverMessage: string = "Are You Sure ? You want to delete record, this action can't be undone.";
  confirmText: string = 'Delete <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;

  constructor(private setupservice: AdminsettingsService, public router: Router, public fb: FormBuilder, public snackBar: MatSnackBar) {

    this.sessionUser = JSON.parse(sessionStorage['Session_name'])
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
      'scopeName': [null],
      'scopeApplicable': [false,],
      'frequencyId': [null, Validators.compose([Validators.required])],
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
      'KPICode': [null],
      'higherIsBetter': [null, Validators.compose([Validators.required])],
      'dataType': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'KRAId': null
    });
  }


  //For Updating Analytics
  public onSubmitAnalytics(value: object) {
    this.setupservice.updateAnalytics(value).subscribe(
      data => {
        this.getSetup();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass: ['greenSnackbar']
        });
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
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
  }
  //For Dimesion Upsert
  public onSubmitDimension(value) {
    //Creating Form Data
    const dimdata = new FormData();
    // if (value['scopeName'] == null) {
    //   value['scopeApplicable'] = true
    // }
    //Making the file null if the Scope Applicable is selected
    if (value['scopeApplicable'] == true) {
      dimdata.append('scopeName', '')
      value['dimensionId'] != null ? dimdata.append('dimensionId', value['dimensionId']) : dimdata.append('dimensionId', '0');
      dimdata.append('dimensionName', value['dimensionName'])
      //value['scopeApplicable'] != null ? dimdata.append('scopeApplicable', value['scopeApplicable']) : dimdata.append('scopeApplicable', "false");
      dimdata.append('scopeApplicable', value['scopeApplicable'])
      dimdata.append('frequencyId', value['frequencyId'])
      dimdata.append('analyticsId', value['analyticsId'])
      dimdata.append('createdBy', value['createdBy'])
      dimdata.append('modifiedBy', value['modifiedBy'])
    }
    else {
      //Send Form values to Form Data
      value['dimensionId'] != null ? dimdata.append('dimensionId', value['dimensionId']) : dimdata.append('dimensionId', '0');
      dimdata.append('dimensionName', value['dimensionName'])
      value['scopeName'] != null ? dimdata.append('scopeName', this.fileScope, this.todaysDate + "@#$" + this.fileScope.name) : dimdata.append('scopeName',"")
      value['scopeApplicable'] != null ? dimdata.append('scopeApplicable', value['scopeApplicable']) : dimdata.append('scopeApplicable', "false");
      dimdata.append('frequencyId', value['frequencyId'])
      dimdata.append('analyticsId', value['analyticsId'])
      dimdata.append('createdBy', value['createdBy'])
      dimdata.append('modifiedBy', value['modifiedBy'])
      value['scopeName'] != null ? dimdata.append("fileName", this.fileScope['name']):dimdata.append("fileName", "");
      console.log(dimdata.get('scopeName')['name'])
    }
    //Sending Form Data Values to Service
    this.setupservice.upsertDimension(dimdata).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup(); 
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }

        this.router.navigateByUrl("/adminsettings/setup");
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
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
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
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
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }


  //For Deleting KRA
  onDeleteKRA(value) {
    // console.log(value['KRAId'], 'KRA VALUE')
    // console.log(this.mainvalue, 'MAIN VALUE')
    // let somevalue = this.mainvalue.filter(item=>item.KRAId == value['KRAId'])
    // console.log(somevalue, 'Somevalue')
    this.setupservice.deleteKRA(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For KPI Upsert
  public onSubmitKPI(value: object) {

    this.setupservice.upsertKPI(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Deleting KPI
  onDeleteKPI(value) {
    this.setupservice.deleteKPI(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getSetup();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
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
      //Calling Dimension Frequencies function
      this.getDimensionFrequencies();
      if (event['node']['scopeApplicable'] == 1) {
        this.scopeInput = true;
        //this.scopeValue = true;
      }
      else {
        this.scopeInput = false;
        this.dimensionform.controls['scopeName'].setValue('');
        this.scopeValue = false;
      }
      if (event['node']['scopeName'] != null) {
        let nameoffile = event['node']['scopeName'].split("@#$");
        this.fileName = nameoffile[1];
        this.scopeValue = false;
      }
      else {
        this.fileName = null;
      }
      this.dimensionform.controls['dimensionId'].setValue(event['node']['dimensionId']);
      this.dimensionform.controls['dimensionName'].setValue(event['node']['dimensionName']);
      this.dimensionform.controls['frequencyId'].setValue(event['node']['frequencyId']);
      this.dimensionform.controls['scopeApplicable'].setValue(event['node']['scopeApplicable']);
      this.dimensionform.controls['analyticsId'].setValue(event['node']['analyticsId']);
      this.allforms = 'updatedimension';

    }
    //If the KRA Selected (for Binding the data to the form)
    if (this.KRAId != null) {
      this.KRAform.controls['KRAId'].setValue(event['node']['KRAId']);
      this.KRAform.controls['KRAName'].setValue(event['node']['KRAName']);
      this.KRAform.controls['description'].setValue(event['node']['description']);
      this.KRAform.controls['dimensionId'].setValue(event['node']['dimensionId']);
      this.allforms = 'updateKRA';
    }
    //If the KPI Selected (for Binding the data to the form)
    if (this.KPIId != null) {
      this.getKpiDataType();
      this.KPIform.controls['KPIId'].setValue(event['node']['KPIId']);
      this.KPIform.controls['KPIName'].setValue(event['node']['KPIName']);
      this.KPIform.controls['KPICode'].setValue(event['node']['KPICode']);
      this.KPIform.controls['higherIsBetter'].setValue(event['node']['higherIsBetter']);
      this.KPIform.controls['dataType'].setValue(event['node']['dataType']);
      this.KPIform.controls['KRAId'].setValue(event['node']['KRAId']);
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
    this.KPIform.controls['KRAId'].setValue(this.mainvalue['KRAId']);
    this.KPIform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.KPIform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.getKpiDataType();
    this.allforms = 'addKPI'
  }

  ngOnInit() {
    //For Loading setup Tree On Load
    this.getSetup();
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
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Getting KPI Data Types for Dropdown
  getKpiDataType() {
    this.setupservice.getKpiDatatType().subscribe(
      data => {
        //Assigning the values to the KPI Datatype variable
        this.kpiDataType = data['data']
        this.KPIHigherOrLower = data['data1']
      },
      error => {
        console.log(error);
        if (error.status == 401) {
          sessionStorage.clear();
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
          this.nodeSelect({ "node": this.selectedFile });
          this.fileName = null;
        },
        error => {
          console.log(error);
          if (error.status == 401) {
            sessionStorage.clear();
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
