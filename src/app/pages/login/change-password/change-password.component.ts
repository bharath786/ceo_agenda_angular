import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Settings } from 'src/app/app.settings.model';
import { AppSettings } from 'src/app/app.settings';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})




export class ChangePasswordComponent implements OnInit {

  public form:FormGroup;
  public settings: Settings;
  encryptedId : any


  constructor(public appSettings:AppSettings, public fb: FormBuilder, public router:Router, private activatedRoute: ActivatedRoute, public loginservice: LoginService, public snackBar: MatSnackBar){
    this.settings = this.appSettings.settings; 
    
    //For taking the parameters through URL for change password
    this.activatedRoute.queryParams.subscribe(params => {
      this.encryptedId = params['id'];
  });

    //Change Password Form
    this.form = this.fb.group({
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirmPassword': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
  });
  }

  //For Change Password Form
  public onSubmit(values:Object):void {
    if (this.form.valid) {
      //To check the password and confiem password matching
      if(values['password'] == values['confirmPassword']){
      var token = this.encryptedId;
      var pwrd = values['password'];
      let formvalues = {verificationToken: token, password: pwrd}
    this.loginservice.setPassword(formvalues).subscribe(
      data=>{
        console.log(data);
              this.router.navigate(['/login'])

                //Sending message to Snackbar
                this.snackBar.open(data['message'], '', {
                  duration: 2000,
                });
      },
      error=>{
        console.log(error)
      }
    )
    }
    else{
      this.snackBar.open('Password and Confirm Password do not match', '', {
        duration: 2000,
      });
    }
     
    }
  }

  ngAfterViewInit(){
    this.settings.loadingSpinner = false; 
  }
  ngOnInit() {
    //To check the current URL
    this.router.events.subscribe((res) => {
    })
    //If the current Url pointing to change password without parameter 
    //then redirecting to login
    if(this.encryptedId == null){
      if (this.router.url == '/login/changepw') {
        this.router.navigate(['/login'])
      }
    }
  }
}
