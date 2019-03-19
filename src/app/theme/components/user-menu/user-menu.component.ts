import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AuthGuard } from 'src/app/pages/login/auth.guard';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import { AppService } from 'src/app/app.service';
import { AdminsettingsService } from 'src/app/pages/admin-settings/adminsettings.service';
import { ToasterService } from 'angular2-toaster/src/toaster.service';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class UserMenuComponent implements OnInit {
  public userImage = '../assets/img/users/nm.jpg';
  public form: FormGroup;
  public changepwform: FormGroup;
  userId: any;
  userEmail: any;
  name :any;


  @ViewChild('changepasswordModal') public changepasswordModal: ModalDirective;
  @ViewChild('profileModal') public profileModal: ModalDirective;

  constructor(private router: Router,public toasterService: ToasterService,  public fb: FormBuilder, public snackBar: MatSnackBar, public appservice: AppService, public adminsettingsservice: AdminsettingsService) {
   
    //Update Profile Form
    this.form = this.fb.group({
      'userId': null,
      'firstName': [null, Validators.compose([Validators.required])],
      'lastName': [null, Validators.compose([Validators.required])],
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'phoneNo': [null],
      'dateOfBirth': [null, Validators.compose([Validators.required])],
      'status': false,
      'createdBy': null,
      'modifiedBy': null
    });

    //Change Password Form
    this.changepwform = this.fb.group({
      'userId': null,
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'password': [null, Validators.compose([Validators.required])],
      'newPassword': [null, Validators.compose([Validators.required])],
      'modifiedBy': [null]
    });
  }

  //For Phone Number Validation
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  //For Profile Update Form
  public onSubmit(values: Object): void {
    let sessionUser = JSON.parse(localStorage['Session_name'])
    if (this.form.valid) {
      if (values['userId'] == null) {
        values['createdBy'] = sessionUser.user_id
      }
      else {
        values['modifiedBy'] = sessionUser.user_id
      }
      console.log(values)
      this.adminsettingsservice.userUpsert(values).subscribe(
        data => {
          this.toasterService.pop('success','',data['message']);
          this.profileModal.hide();
        },
        error => {
          console.log(error);
          if(error.status==401){
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

  //For Profile Details
  userDetailsToggle(e){
    if (e == 1) {
      var session_values = JSON.parse(localStorage['Session_name'])
      var value = { userId: session_values.user_id }
      this.appservice.profileUpdate(value).subscribe(
        data => {
          this.name = data['Data'][0]['firstName']+' '+data['Data'][0]['lastName'];
        },
        error => {
          console.log(error);
          if(error.status==401){
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      )

    }
  }

  //For Change Password Form Submission
  public onSubmitPassword(values: Object): void {
    let sessionUser = JSON.parse(localStorage['Session_name'])
    if (this.changepwform.valid) {
      values['modifiedBy'] = sessionUser.user_id;
      values['userId'] = sessionUser.user_id;
      this.appservice.changePassword(values).subscribe(
        data => {
          this.toasterService.pop('success','',data['message']);
          this.changepasswordModal.hide();
        },
        error => {
          console.log(error)
          if(error.status==401){
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      )
    }
  }

  //For Change Password Modal Popup
  changepasswordModalToggle(e) {
    if (e == 1) {
      var session_values = JSON.parse(localStorage['Session_name'])
      var value = { userId: session_values.user_id }
      this.appservice.profileUpdate(value).subscribe(
        data => {
          console.log(data)
          this.changepwform.controls['email'].setValue(data['Data'][0]['email']);
          this.changepasswordModal.show();
        },
        error => {
          console.log(error);
          if(error.status==401){
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      )
    }
    else {
      this.changepasswordModal.hide();
      this.changepwform.reset();
    }
  }

  //For Logout 
  logOut(e) {
    if (e == 1) {
      var session_values = JSON.parse(localStorage['Session_name'])
      var value = { userId: session_values.user_id }
      this.appservice.logOut(value).subscribe(
        data => {
          window.location.reload();
          this.toasterService.pop('success','',data['message']);
        },
        error=>{
          console.log(error);
        }
      )
      localStorage.clear();
    }
  }

  //For Edit Profile 
  //Assigning values to form controls from service API
  profileModalToggle(e) {
    if (e == 1) {
      var session_values = JSON.parse(localStorage['Session_name'])
      var value = { userId: session_values.user_id }
      this.appservice.profileUpdate(value).subscribe(
        data => {
          console.log(data)
          this.form.controls['userId'].setValue(data['Data'][0]['userId']);
          this.form.controls['firstName'].setValue(data['Data'][0]['firstName']);
          this.form.controls['dateOfBirth'].setValue(data['Data'][0]['dateOfBirth']);
          this.form.controls['lastName'].setValue(data['Data'][0]['lastName']);
          this.form.controls['email'].setValue(data['Data'][0]['email']);
          this.form.controls['phoneNo'].setValue(data['Data'][0]['phoneNo']);
          this.profileModal.show();
        },
        error => {
          console.log(error);
          if(error.status==401){
            localStorage.clear();
            this.router.navigate(['/login'])
          }
        }
      )
    }
    else if (e == 2) {
      this.profileModal.hide();
    }
  }

  ngOnInit() {
  }

}
