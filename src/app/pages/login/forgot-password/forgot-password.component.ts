import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public form:FormGroup;
  public settings: Settings;
  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, public forgotpwservice: LoginService, public snackBar: MatSnackBar){
    this.settings = this.appSettings.settings; 
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, emailValidator])]
    });
  }

  //For Forgot Password
  public onSubmit(emailId:Object):void {
    if (this.form.valid) {
     this.forgotpwservice.forgotPassword(emailId).subscribe(
       data=>{
         console.log(data['message']);
         
            //Sending message to Snackbar
            this.snackBar.open(data['message'], 'OK'
            );
            this.router.navigate(['/login'])
       },
       error=>{
         console.log(error)
       }
     )
    }
  }
  

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
  ngOnInit() {
  }

}
