import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { AdminsettingsService } from '../adminsettings.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


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
  selectAllDimensions: any;
  dimensionArray: any =[];

  @ViewChild('dimensionsModal') public dimensionsModal: ModalDirective;

  //For Confirmation
  popoverTitle: string = 'Delete?';
  popoverMessage: string = "Are You Sure ? You want to delete record, this action can't be undone.";
  confirmText: string = 'Delete <i class="glyphicon glyphicon-ok"></i>';
  cancelText: string = 'No <i class="glyphicon glyphicon-remove"></i>';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;
  dimensionsEntityBased: any;
  previousvalue: any;
  dimensionForm: any;
  checkedValueDimension: any[] = [];
  arrayForBinding: any[] = [];
  finaldimensionId: any[] = [];
  country: any;
  filteredCountriesSingle: any[];
  filteredCountriesMultiple: any[];
  
  constructor(private structureservice: AdminsettingsService, 
              public router: Router, 
              public fb: FormBuilder, 
              public snackBar: MatSnackBar,
              public toasterService: ToasterService) {

    this.sessionUser = JSON.parse(localStorage['Session_name'])
    //Organization Update Form
    this.organizationform = this.fb.group({
      'organizationId': null,
      'organizationName': [null, Validators.compose([Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'organizationDescription': [null],
      'modifiedBy': this.sessionUser['user_id']
    });
   
    //Division Update Form
    this.divisionform = this.fb.group({
      'divId': null,
      'divName': [null, Validators.compose([Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'phoneNumber': [null, Validators.compose([Validators.minLength(6)])],
      'address': [null],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'organizationId': null
    });

    //Location Upsert Form
    this.locationform = this.fb.group({
      'locationId': null,
      'countryId': [null, Validators.compose([Validators.required])],
      'description': [null],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'divisionId': null,
      'CountryName': null
    });

    //Entity Update Form
    this.entityform = this.fb.group({
      'entityId': null,
      'entityName': [null, Validators.compose([Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'entityCode':[null, Validators.compose([Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'countryId': [null],
      'stateId': [null, Validators.compose([Validators.required])],
      'cityId': [null, Validators.compose([Validators.required])],
      'phoneNumber': [null],
      'address': [null, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      'modifiedBy': this.sessionUser['user_id'],
      'createdBy': this.sessionUser['user_id'],
      'locationId': null
    });
  }

  fnDimensionsModal(){
    console.log("Close Modal")
    this.dimensionsModal.hide();
  }

  ngOnInit() {
    //Get Structure Tree
    this.getStructure();
    
  }

  // checkingfunction(){
  //   this.finaldimensionId=[];
  //     for (let key in this.dimensionArray) {
  //       if(this.dimensionArray[key] == true){
  //       this.finaldimensionId.push(key)
  //       }
  //   }
  //    console.log(this.finaldimensionId)

  //   this.dimensionsModal.hide();
  //   return this.finaldimensionId
  // }
  
  //For Phone Number Validation
  keyPress(event: any) {
    const pattern = /[0-9\+\-\a-z\ ]/;
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
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }
    )
  }

  filterCountrySingle(event) {
    let query = event.query;
  //   this.countries.then(countries => {
  //     this.filteredCountriesSingle = this.filterCountry(query, countries);
  // });
    this.filteredCountriesSingle = this.filterCountry(query, this.countries);
}

filterCountry(query, countries: any[]):any[] {
  console.log(query, countries)
  //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
  let filtered : any[] = [];
  for(let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if(country.countryName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }
  console.log(filtered)
  return filtered;
}

  //For Getting states based on country id
  onCountrySelect(countryId) {
    this.structureservice.getStates(countryId).subscribe(
      data => {
        this.states = data['data']
      },
      error => {
        console.log(error)
        if (error.status == 401) {
          localStorage.clear();
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
        if (error.status == 401) {
          localStorage.clear();
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
          if (error.status == 401) {
            localStorage.clear();
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

  selectDimension(e) {
    if (e == 1) {
      this.dimensionsModal.show();
    }
    if (e == 2) {
      this.dimensionsModal.hide()
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
      this.getCountries(event['node']['divisionId'], event['node']['countryId']);
      this.locationform.controls['locationId'].setValue(event['node']['locationId']);
      this.locationform.controls['countryId'].setValue(event['node']['countryId']);
      this.locationform.controls['description'].setValue(event['node']['description']);
      this.locationform.controls['divisionId'].setValue(event['node']['divisionId']);
      this.country = [101,'India'];
      this.allforms = 'updatelocation';
    }
    //Tree node selected on Entity
    if (this.entityId != null) {
      this.onCountrySelect(event['node']['countryId']);
      this.onStateSelect(event['node']['stateId'])
      this.getDimensionEntity(event['node']['entityId'])
      this.entityform.controls['entityId'].setValue(event['node']['entityId']);
      this.entityform.controls['entityName'].setValue(event['node']['entityName']);
      this.entityform.controls['entityCode'].setValue(event['node']['entityCode']);
      this.entityform.controls['phoneNumber'].setValue(event['node']['phoneNumber']);
      this.entityform.controls['countryId'].setValue(event['node']['countryId']);
      this.entityform.controls['stateId'].setValue(event['node']['stateId']);
      this.entityform.controls['cityId'].setValue(event['node']['cityId']);
      this.entityform.controls['address'].setValue(event['node']['address']);
      this.entityform.controls['locationId'].setValue(event['node']['locationId']);
      this.allforms = 'updateentity';
    }
  }

  getDimensionEntity(entityId) {
    this.structureservice.getDimensionEntity(entityId).subscribe(
      data => {
        this.dimensionsEntityBased = data['data'];
        this.getcheckedDimensionId();
      }
      
    )
  }


  dimensionSelect(e){
  console.log(e,'EVENT')  
  }

  getcheckedDimensionId() {
    this.dimensionArray = [];
    let filtereddimensions = this.dimensionsEntityBased.filter(el => el['value'] == true)
    filtereddimensions.forEach(element => {
      this.dimensionArray[element['dimensionId']]=true;
    //  this.dimensionArray.push(element['dimensionId'] )
    });
    console.log(this.dimensionArray)
    return this.dimensionArray
  }
  //For Updating Organization values (value >> Service >> API)
  public onSubmitOrganization(value: object) {
    this.structureservice.updateOrganization(value).subscribe(
      data => {
        this.getStructure();
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

  //For Division Upsert values (value >> Service >> API)  
  public onSubmitDivision(value: object) {
    this.structureservice.upsertDivision(value).subscribe(
      data => {
        if (data['error'] == true) {
        this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getStructure();
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

  //For Deleting Division 
  public onDeleteDivision(value: object) {
    this.structureservice.deleteDivision(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getStructure();
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

  //For Location Upsert values (value >> Service >> API)  
  public onSubmitLocation(value: object) {
    console.log(value,'nnn')
    if (value['locationId'] != null) {
      if (value['countryId'] == this.mainvalue['countryId']) {
        this.structureservice.upsertLocation(value).subscribe(
          data => {
            this.getStructure();
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
      else {
        this.toasterService.pop('error','',"Sorry, You couldn't change Country for this Dimension");

      }
    }
    else {
      this.structureservice.upsertLocation(value).subscribe(
        data => {
          this.getStructure();
          this.toasterService.pop('error','',data['message']);
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
  }

  //For Deleting Location 
  public onDeleteLocation(value: object) {
    this.structureservice.deleteLocation(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getStructure();
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

  //For Entity Upsert values (value >> Service >> API)    
  public onSubmitEntity(value) {
    console.log(value)
    // if(value.entityName == ""){
    //   this.snackBar.open("this is required", 'OK', {
    //     duration: 7000,
    //     panelClass: ['redSnackbar']
    //   });
    // }
    // else if(value.entityCode == ""){
    //   this.snackBar.open("this is required", 'OK', {
    //     duration: 7000,
    //     panelClass: ['redSnackbar']
    //   });
    // }
    // //value['dimensions'] = this.checkingfunction();
    // else{
      this.structureservice.upsertEntity(value).subscribe(
        data => {
          if (this.cities == 0) {
            this.entityform.controls['cityId'].setValue('null');
          }
          if (data['error'] == true) {

        this.toasterService.pop('error','',data['message']);
          }
          else {
            this.getStructure();
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
    //}
    
  }

  //For Deleting Entity 
  public onDeleteEntity(value: object) {
    this.structureservice.deleteEntity(value).subscribe(
      data => {
        if (data['error'] == true) {
          this.toasterService.pop('error','',data['message']);
        }
        else {
          this.getStructure();
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
