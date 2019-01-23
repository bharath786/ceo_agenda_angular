import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AdminsettingsService } from '../adminsettings.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class StructureComponent implements OnInit {
  //For Tree
  files: TreeNode[] = [];
  //For Default Selection
  selectedFile: TreeNode[];
  mainvalue: any;
  organizationId: number;
  divisionId: number;
  locationId: number;
  entityId: number;
  allforms: any;
  countries: any;
  states: any;
  cities: any;
  //For Session values
  sessionUser: any;
  //For add div
  addtoggle: any;
  //for location option
  organizationform: any;
  divisionform: any;
  locationform: any;
  entityform: any;

    //For Confirmation
    popoverTitle: string = 'Delete?';
    popoverMessage: string = "Are You Sure ? You want to delete record, this action can't be undone.";
    confirmText: string = 'Delete <i class="glyphicon glyphicon-ok"></i>';
    cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
    confirmClicked: boolean = false;
    cancelClicked: boolean = false;
  dimensionsEntityBased: any;

  constructor(private structureservice: AdminsettingsService, public router: Router,  public fb: FormBuilder, public snackBar: MatSnackBar) {

    this.sessionUser = JSON.parse(sessionStorage['Session_name'])
    //Organization Update Form
    this.organizationform = this.fb.group({
      'organizationId': null,
      'organizationName': [null, Validators.compose([Validators.required])],
      'organizationDescription': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id']
    });

    //Division Update Form
    this.divisionform = this.fb.group({
      'divId': null,
      'divName': [null, Validators.compose([Validators.required])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'address': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'organizationId': null
    });

    //Location Upsert Form
    this.locationform = this.fb.group({
      'locationId': null,
      'countryId': [null, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'divisionId': null
    });

    //Entity Update Form
    this.entityform = this.fb.group({
      'entityId': null,
      'entityName': [null, Validators.compose([Validators.required])],
      'countryId': [null],
      'stateId': [null, Validators.compose([Validators.required])],
      'cityId': [null, Validators.compose([Validators.required])],
      'phoneNumber': [null, Validators.compose([Validators.required])],
      'address': [null, Validators.compose([Validators.required])],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'locationId': null
    });
  }
  

  ngOnInit() {
    //Get Structure Tree
    this.getStructure();
  }

    //For Phone Number Validation
    keyPress(event: any) {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar)) {
        event.preventDefault();
      }
    }

  //For Getting Contries
  getCountries(divId, countryId) {
    this.structureservice.getCountries(divId, countryId).subscribe(
      data => {
        this.countries = data['data']
      },
      error => {
        console.log(error)
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Getting states based on country id
  onCountrySelect(countryId) {
    this.structureservice.getStates(countryId).subscribe(
      data => {
        this.states = data['data']
      },
      error => {
        console.log(error)
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Getting cities based on state id
  onStateSelect(stateId) {
    this.structureservice.getCities(stateId).subscribe(
      data => {
        this.cities = data['data']
        
        console.log(data['data'], 'Cities')
      },
      error => {
        console.log(error)
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Structure Tree
  getStructure() {
    this.structureservice.getstructureJSON()
      .subscribe(
        files => {
          //Assigning the tree to files 
          this.files = files['data'];
          //For default selection (pre-select)
          this.selectedFile = files['data']['0']
          this.nodeSelect({ 'node': this.selectedFile })
          return files['data'];
        },
        error => {
          console.log(error);
          if(error.status==401){
            sessionStorage.clear();
            this.router.navigate(['/login'])
          }
        });
  }

  //For Adding Division
  adddiv(e) {
    this.divisionform.reset();
    this.divisionform.controls['organizationId'].setValue(this.mainvalue['organizationId']);
    this.divisionform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.divisionform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.allforms = 'adddivision'
  }

  // countryselection() {
  //   console.log(this.divisionform.value['locationId']);
  // }

  //For Adding Location
  addLoc(e) {
    this.locationform.reset();
    this.locationform.controls['divisionId'].setValue(this.mainvalue['divId']);
    this.locationform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.locationform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.getCountries(this.mainvalue['divId'], 0);
    console.log(this.mainvalue['divId'])
    this.allforms = 'addlocation'
  }

  //For adding Entity
  addEntity(e) {
    this.entityform.reset();
    this.getDimensionEntity(0);
    this.onCountrySelect(this.mainvalue['countryId']);
    this.onStateSelect(e);
    console.log(this.mainvalue)
    this.entityform.controls['countryId'].setValue(this.mainvalue['countryId'])
    this.entityform.controls['locationId'].setValue(this.mainvalue['locationId']);
    this.entityform.controls['modifiedBy'].setValue(this.sessionUser['user_id']);
    this.entityform.controls['createdBy'].setValue(this.sessionUser['user_id']);
    this.allforms = 'addEntity'
  }

  selectDimension(e){
    if(e=1){
    this.allforms = 'dimensiondata'
  }
  else{
    this.allforms = 'addEntity'
  }
}

  //Tree Node Selection on Structure Tree
  nodeSelect(event) {
    this.mainvalue = event['node'];
    this.organizationId = event['node']['organizationId']
    this.divisionId = event['node']['divId']
    this.locationId = event['node']['locationId']
    this.entityId = event['node']['entityId']
    console.log(this.mainvalue)
    //Tree node selected on Organization
    if (this.organizationId != null) {
      this.organizationform.controls['organizationName'].setValue(event['node']['organizationName']);
      this.organizationform.controls['organizationDescription'].setValue(event['node']['organizationDescription']);
      this.organizationform.controls['organizationId'].setValue(event['node']['organizationId']);
      this.allforms = 'updateorganization';
    }
    //Tree node selected on Division
    if (this.divisionId != null) {
      this.divisionform.controls['divId'].setValue(event['node']['divId']);
      this.divisionform.controls['divName'].setValue(event['node']['divName']);
      this.divisionform.controls['phoneNumber'].setValue(event['node']['phoneNumber']);
      this.divisionform.controls['address'].setValue(event['node']['address']);
      this.divisionform.controls['organizationId'].setValue(event['node']['organizationId']);
      this.allforms = 'updatedivision';
    }

    //Tree node selected on Location
    if (this.locationId != null) {
      this.getCountries(event['node']['divisionId'],event['node']['countryId']);
      this.locationform.controls['locationId'].setValue(event['node']['locationId']);
      this.locationform.controls['countryId'].setValue(event['node']['countryId']);
      this.locationform.controls['description'].setValue(event['node']['description']);
      this.locationform.controls['divisionId'].setValue(event['node']['divisionId']);
      this.allforms = 'updatelocation';
    }
    //Tree node selected on Entity
    if (this.entityId != null) {
      this.onCountrySelect(event['node']['countryId']);
      this.onStateSelect(event['node']['stateId'])
      this.getDimensionEntity(event['node']['entityId'])
      this.entityform.controls['entityId'].setValue(event['node']['entityId']);
      this.entityform.controls['entityName'].setValue(event['node']['entityName']);
      this.entityform.controls['phoneNumber'].setValue(event['node']['phoneNumber']);
      this.entityform.controls['countryId'].setValue(event['node']['countryId']);
      this.entityform.controls['stateId'].setValue(event['node']['stateId']);
      this.entityform.controls['cityId'].setValue(event['node']['cityId']);
      this.entityform.controls['address'].setValue(event['node']['address']);
      this.entityform.controls['locationId'].setValue(event['node']['locationId']);
      this.allforms = 'updateentity';
    }
  }

  getDimensionEntity(entityId){
    this.structureservice.getDimensionEntity(entityId).subscribe(
      data=>{
        this.dimensionsEntityBased = data['data'];
      }
    )
  }

  //For Updating Organization values (value >> Service >> API)
  public onSubmitOrganization(value: object) {
    this.structureservice.updateOrganization(value).subscribe(
      data => {
        this.getStructure();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass :['greenSnackbar']
        });
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }

    )
  }

  //For Division Upsert values (value >> Service >> API)  
  public onSubmitDivision(value: object) {
    this.structureservice.upsertDivision(value).subscribe(
      data => {
        if(data['error'] == true){
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass:['redSnackbar']
          });
        }
        else{
        this.getStructure();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass:['greenSnackbar']
        });
      }
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Deleting Division 
  public onDeleteDivision(value: object) {
    this.structureservice.deleteDivision(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getStructure();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Location Upsert values (value >> Service >> API)  
  public onSubmitLocation(value: object) {
    if(value['locationId'] != null){
    if(value['countryId'] == this.mainvalue['countryId']){
    this.structureservice.upsertLocation(value).subscribe(
      data => {
        this.getStructure();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass:['greenSnackbar']
        });
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
    }
    else{
      this.snackBar.open("Sorry, You couldn't change Country for this Dimension", 'OK', {
        duration: 7000,
      });
    }
  }
  else{
    this.structureservice.upsertLocation(value).subscribe(
      data => {
        this.getStructure();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass:['greenSnackbar']
        });
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }
  }

  //For Deleting Location 
  public onDeleteLocation(value: object) {
    this.structureservice.deleteLocation(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getStructure();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Entity Upsert values (value >> Service >> API)    
  public onSubmitEntity(value: object) {
    this.structureservice.upsertEntity(value).subscribe(
      data => {
        if(this.cities == 0){
          this.entityform.controls['cityId'].setValue('null');
        }
        if(data['error'] == true){
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass:['redSnackbar']
          });
        }
        else{
        this.getStructure();
        this.snackBar.open(data['message'], 'OK', {
          duration: 7000,
          panelClass:['greenSnackbar']
        });
      }
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Deleting Entity 
  public onDeleteEntity(value: object) {
    this.structureservice.deleteEntity(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['redSnackbar']
          });
        }
        else {
          this.getStructure();
          this.snackBar.open(data['message'], 'OK', {
            duration: 7000,
            panelClass: ['greenSnackbar']
          });
        }
      },
      error => {
        console.log(error);
        if(error.status==401){
          sessionStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  //For Structure Tree Starts here
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
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

  unselectFile() {
    this.files = null;
  }
  //Structure tree Ends Here//
}
