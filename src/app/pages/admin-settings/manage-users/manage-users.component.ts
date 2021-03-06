import { AdminsettingsService } from './../adminsettings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from 'src/app/app.settings.model';
import { ModalDirective } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import * as _ from 'lodash';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})

export class ManageUsersComponent implements OnInit {
  deleteId: number;
  public users: any;
  public settings: Settings;
  public form: FormGroup;
  status: boolean;
  myModel = true;
  disabled = true;
  startDate = new Date(1990, 0, 1);
  public filterQuery = "";
  todaysdate: any;
  maxDate: any;
  emailchange: any;
  //For Tree
  entitiesList: any[] = [];
  //For Default Selection

  entityform: any;

  //For Confirmation
  popoverTitle: string = 'Resend verification Mail';
  popoverMessage: string = "Do you want to resend verification mail";
  confirmText: string = 'Yes Resend';
  cancelText: string = 'No';
  confirmClicked: boolean = false;
  cancelClicked: boolean = false;
  divisiondata: any = [];
  entityarray: any = [];
  locationdata: any = [];
  userId: any;
  isUnassignEntities: boolean = false;
  locationIds: any = [];
  readCheckbox: boolean;
  writeCheckbox: boolean;
  allPermissions: any;
  permissionForm: FormGroup;
  isReadPerm: any = [];
  isWritePerm: any = [];
  Permissions: any[];
  data1: any[];
  isRead: boolean = false;
  isWrite: boolean = false; 
  userEmail: any;


  constructor(public appSettings: AppSettings, public fb: FormBuilder,
    public router: Router, private adminsettingsservice: AdminsettingsService,
    public snackBar: MatSnackBar,
    public toasterService: ToasterService) {

    this.settings = this.appSettings.settings;

    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate());

    //Add User Form
    this.form = this.fb.group({
      'userId': null,
      'firstName': [null, Validators.compose([Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'lastName': [null, Validators.compose([Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")])],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'phoneNo': [null],
      'dateOfBirth': [null, Validators.compose([Validators.required])],
      'status': null,
      'createdBy': null,
      'modifiedBy': null
    });

    this.entityform = this.fb.group({
      'divId': [null, Validators.compose([Validators.required])],
      'locationId': [null, Validators.compose([Validators.required])],
      'entityId': [null, Validators.compose([Validators.required])]
    });

    this.permissionForm = this.fb.group({
      'screenId': [null],
      'isRead': [null],
      'isWrite': [null]
    });

    let PermsissionDetails = [];
    PermsissionDetails = JSON.parse(localStorage.getItem('userPermissions'));
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
     permissionlist =  PermsissionDetails.filter(x=>x.screen_name == 'Manage Users');
     if(permissionlist.length > 0){
       this.isRead = permissionlist[0]['bt_isRead'];
       this.isWrite = permissionlist[0]['bt_isWrite'];
     }
     else{
      this.isRead = false;
      this.isWrite = false;
     }
    }

    let sessionUser = JSON.parse(localStorage.getItem('Session_name'))
    this.userEmail = sessionUser.email;
  }

  onSubmitPermissions(readArray,writeArray) {
    let ReadArray = [];
    let WriteArray = [];
    ReadArray.push();
    WriteArray.push();


    console.log(this.allPermissions)
    for (let n = 0; n <= this.allPermissions.length;n++){
       ReadArray.push(false);
      WriteArray.push(false);
    }
   

    for(var i in ReadArray){
      for(var j in readArray){
        if(i == j){
          ReadArray[i] = readArray[j];
        }
      }
    }

    for(var i in WriteArray){
      for(var j in writeArray){
        if(i == j){
          WriteArray[i] = writeArray[j];
        }
      }
    }
    this.Permissions = [];
    let values;
    for(var i in ReadArray){
      var readKey = i;
      var readval = ReadArray[i];
     for(var j in WriteArray){
       var i = j;
       var writeval = WriteArray[j];
       var writeKey = j;
      if(readKey == writeKey && (readKey != '0' || writeKey != '0') && readval == true){  
        this.Permissions.push({Permission_screen_id:readKey, isRead:readval,isWrite:writeval})
        // values['userId'] = parseInt(this.userId);
        // values['Permissions'] = this.Permissions
        // values ={userId:this.userId, Permissions:this.Permissions}]
      }
     }
     values = new Object({
      userId : parseInt(this.userId),
      Permissions: this.Permissions
    });
    

  }
  this.permissionsUpsert(values);
  }

  permissionsUpsert(values){
    console.log(values,'Permissions')
    this.adminsettingsservice.permissionsUpsert(values).subscribe(
      data=>{
        console.log(data);
        this.toasterService.pop('success', '', data['message']);
        this.permissionModal1.hide();
        this.isWritePerm = [];
        this.isReadPerm = [];
      },
      error=>{
        console.log(error);
      }
    )
  }

  ngOnInit() {
    //Users List
    this.userslist();
    this.getEntitiesList();
    this.getAllPermissions();

  }

  autoSelectPermissions(val,id) {
    console.log(val)
    if(val == true){
      this.isReadPerm[id]=true ;
    }
  }
  autoDeselectPermissions(val, id){
    if(val == false){
      this.isWritePerm[id]=false;
    }
  }

  getAllPermissions() {
    this.adminsettingsservice.getPermissions().subscribe(
      data => {
        this.allPermissions = data['AllPermissions']
      }
    )
  }


  @ViewChild('addUserModal') public addUserModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;
  @ViewChild('permissionModal') public permissionModal: ModalDirective;
  @ViewChild('permissionModal1') public permissionModal1: ModalDirective;
  @ViewChild('entitiesModal') public entitiesModal: ModalDirective;


  entitiesnModalToggle(data) {
    if (data == null) {
      this.entitiesModal.hide();
      this.entityform.reset();
    }
    else {
      if (data['AssignedEntitiesCount'] > 0) {
        this.isUnassignEntities = true;
      }
      else {
        this.isUnassignEntities = false;
      }
      this.userId = data['userId'];
      this.adminsettingsservice.getUserRelatedEntities(data['userId']).subscribe(
        data => {
          let selectedDivisions = data['DivisionIds'];
          selectedDivisions = Array.from(new Set(selectedDivisions));
          let selectedLocations = data['CountryIds'];
          selectedLocations = Array.from(new Set(selectedLocations));
          let selectedEntities = data['EntityIds'];
          selectedEntities = Array.from(new Set(selectedEntities));

          if (selectedDivisions != null) {
            console.log(selectedDivisions, 'select div')
            this.onDivisionSelect(selectedDivisions)
          }
          if (selectedLocations != null) {
            this.onLocationSelect(selectedLocations)
          }

          this.entityform.controls['divId'].setValue(selectedDivisions);
          this.entityform.controls['locationId'].setValue(selectedLocations);
          this.entityform.controls['entityId'].setValue(selectedEntities);
          this.getEntitiesList();
        }
      )
      this.entitiesModal.show();
    }
  }

  onEntitySubmit(formvalues) {
    if (this.entityform.valid) {
      console.log(formvalues, 'Ennn')
      if (formvalues['divId'].length == 0) {
        formvalues['entityId'] = [];
      }
      else if (formvalues['locationId'].length == 0) {
        formvalues['entityId'] = [];
      }
      this.assignEntities(formvalues['entityId'])
      console.log(formvalues, 'Ennn')
    }
  }


  getstatus(e) {
    this.status = e;
  }

  //For Phone Number Validation
  keyPress(event: any) {
    const pattern = /[0-9\+\-\a-z\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  //For Phone Number Validation
  keyPressforDob(event: any) {
    const pattern = /[]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  //For delete confirmation modal
  deleteModalToggle(id) {
    if (id == 2) {
      this.deleteModal.hide();
    }
    else {
      this.deleteId = id['userId'];
      console.log(this.deleteId)
      this.deleteModal.show();
    }
  }

  getEntitiesList() {
    this.adminsettingsservice.getAllEntities().subscribe(
      data => {
        this.divisiondata = []
        this.entitiesList = data['data']
        console.log(this.entitiesList)
        this.entitiesList.forEach(element => {
          this.divisiondata.push({ divisonId: element.divisionId, divisionName: element.divisionName })
        }
        )
        this.divisiondata = this.multiDimensionalUnique(this.divisiondata)
      },
      error => {
        console.log(error)
      }
    )
  }

  onDivisionSelect(divisionId) {
    // this.entityform.controls['entityId'].setValue(null);
    console.log(divisionId, 'DivisionIds')
    this.locationdata = []
    this.locationIds = []
    divisionId.forEach(element => {
      this.entitiesList.filter((x) => {
        if (x.divisionId == element) {
          console.log('fff')
          this.locationdata.push({ countryId: x.countryId, countryName: x.countryName })
          this.locationIds.push(x.countryId)
        }
      })
    });

    this.onLocationSelect(this.locationIds)
    this.locationdata = this.multiDimensionalUnique(this.locationdata)
    console.log(this.locationdata, 'Location Data')
    if (this.locationdata.length > 0) {
    }
    else {
      this.onLocationSelect([])
    }

  }

  onLocationSelect(countryId) {
    console.log(countryId, 'COUNTR')
    this.entityarray = []
    countryId.forEach(element => {
      this.entitiesList.filter((x) => {
        if (x.countryId == element) {
          this.entityarray.push({ entityId: x.entityId, entityName: x.entityName })
        }
      })
    });
    this.entityarray = this.multiDimensionalUnique(this.entityarray)
    console.log(this.entityarray, 'Entity Data')
  }

  multiDimensionalUnique(arr) {
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

  //For User delete
  deleteUser() {
    let deleteuser = { userId: this.deleteId }
    this.adminsettingsservice.deleteUser(deleteuser).subscribe(
      data => {
        this.deleteModal.hide();
        this.userslist();
        this.toasterService.pop('success', '', data['message']);
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

  //For Add user modal popup
  addUserModalToggle(e) {
    if (e == 1) {
      this.emailchange = null
      this.addUserModal.show();
    }
    if (e == 2) {
      this.addUserModal.hide();
      this.form.reset();
    }
  }

  //For Permission Modal Popup
  permissionModalToggle(e) {
    if (e == 1) {
      this.permissionModal.show();
    }
    else {
      this.permissionModal.hide();
    }
  }

  permissionModal1Toggle(e) {
    this.userId = e;
    if (e != null) {
      this.permissionModal1.show();
      this.getUserPermission(this.userId)
    }
    else {
      this.isWritePerm = [];
      this.isReadPerm = [];
      this.permissionModal1.hide();
    }
  }

  getUserPermission(userId){
    this.adminsettingsservice.getuserPermissions(userId).subscribe(
      data=>{
        console.log(data['UserPermissions']);
        this.data1 = [];
        let maindata = data['UserPermissions'];
        this.isReadPerm =[]
        maindata.forEach(element => {
          if(element.bt_isRead == true){
            this.isReadPerm[element.int_permission_screen_id] = true;
          }
        });
        maindata.forEach(element => {
          if(element.bt_isWrite == true){
            this.isWritePerm[element.int_permission_screen_id] = true;
          }
        });
        console.log(this.isReadPerm)

      },
      error=>{
        console.log(error);
      }
    )
  }
  //Status Update
  changeStatus(values) {
    let userValue = this.users.filter(x => x.userId == values["userId"]);
    if (userValue[0]['verified'] === true) {
      let sessionUser = JSON.parse(localStorage['Session_name'])
      values.status = !values.status;
      values.modifiedBy = sessionUser.user_id
      this.adminsettingsservice.userStatus(values).subscribe(
        data => {
          this.userslist();
          this.toasterService.pop('success', '', data['message']);
        },
        error => {
          console.log(error);
          if (error.status == 401) {
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      )
    } else {
      this.toasterService.pop('error', '', 'Please verify email to change status');
    }
  }

  //Update Profile values setting to form
  updateProfile(data) {
    this.emailchange = data
    let sessionUser = JSON.parse(localStorage.getItem('Session_name'))
    this.form.controls['userId'].setValue(data.userId);
    this.form.controls['firstName'].setValue(data.firstName);
    let newDate = new Date(data.dateOfBirth);
    this.form.controls['dateOfBirth'].setValue(newDate);
    this.form.controls['lastName'].setValue(data.lastName);
    this.form.controls['email'].setValue(data.email);
    this.form.controls['phoneNo'].setValue(data.phoneNo);
    this.form.controls['modifiedBy'].setValue(sessionUser.user_id);
    console.log(data)
    this.addUserModal.show();
  }

  resendMail(values) {
    let sessionUser = JSON.parse(localStorage['Session_name'])
    if (values['userId'] == null) {
      values['createdBy'] = sessionUser.user_id
    }
    else {
      values['modifiedBy'] = sessionUser.user_id
    }
    this.adminsettingsservice.resendMail(values).subscribe(
      data => {
        this.toasterService.pop('success', '', data['message']);
      }
    )
  }

  //Assign the entities to the user
  assignEntities(entityIds) {
    let data = {
      EntityIds: entityIds, userId: this.userId,
      createdBy: JSON.parse(localStorage['Session_name']).user_id,
      modifiedBy: JSON.parse(localStorage['Session_name']).user_id
    }
    this.adminsettingsservice.insertUserEntities(data).subscribe(
      data => {
        this.toasterService.pop('success', '', data['responseType']['message']);
        this.entitiesModal.hide();
        this.userslist();
      },
      error => {
        console.log(error)
      }
    )
  }


  //User Update and Create Form
  public onSubmit(values: Object): void {
    let sessionUser = JSON.parse(localStorage['Session_name'])
    if (this.form.valid) {
      if (values['userId'] == null) {
        values['createdBy'] = sessionUser.user_id
      }
      else {
        values['modifiedBy'] = sessionUser.user_id
      }
      this.adminsettingsservice.userUpsert(values).subscribe(
        data => {
          this.toasterService.pop('success', '', data['message']);
          this.userslist();
          this.addUserModal.hide();
          this.form.reset();
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
      console.log('error');
    }
  }

  //For User list manage Users
  userslist() {
    this.adminsettingsservice.getUsersList()
      .subscribe(
        data => {
          this.users = data['Data'];
          console.log(this.users);
        },
        error => {
          if (error.status == 401) {
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      );
  }



}
