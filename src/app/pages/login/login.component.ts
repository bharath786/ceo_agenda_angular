import { Component ,ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { LoginService } from './login.service';
import { MatSnackBar} from '@angular/material';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent {

  public form: FormGroup;
  public settings: Settings;
  rememberMe: boolean;

  constructor(public appSettings: AppSettings, public fb: FormBuilder, 
            public router: Router, public login: LoginService,
             public _cookieService: CookieService, public toasterService : ToasterService,
             public _appService: AppService,
             public snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  
    //Login Form
    this.form = this.fb.group({
      'email': [null, Validators.compose([Validators.required, emailValidator])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'rememberMe': false
    });

    //Setting the values to the input form the cookie service (cookie service => input type)
    if (_cookieService.get('rememberMe') || this.rememberMe) {
      this.form.controls['email'].setValue(this._cookieService.get('email'));
      this.form.controls['password'].setValue(this._cookieService.get('password'));
      this.form.controls['rememberMe'].setValue(this._cookieService.get('rememberMe'));
      this.rememberMe = true
    }
  }

  //Login Form after submit
  public onSubmit(values: Object): void {
    if (this.form.valid) {
      //sending credentials to loginAuth service
      this.login.loginAuth(values)
        .subscribe(
          data => {
            console.log(data,'Main Login details')
            if (data['responseType']['error'] == false) {
              //Storing user values in session
              localStorage.setItem('Session_name', JSON.stringify({ token: data['loginData']['accessToken'], user_id: data['loginData']['userId'], email: data['loginData']['email'] }));
              localStorage.setItem('EntityDetails', 
              JSON.stringify({ 
              assignedEntities: data['AssignedEntitesCount'], 
              defaultCountryId: data['DefaultCountryId'], 
              defaultDivisionId: data['DefaultDivisionId'], 
              defaultEntityId: data['DefaultEntityId'],
              defaultEntityYear: data['DefaultYear'] }));              
              //Sending message to Snackbar
              this._appService.getUserPermissions(data['loginData']['userId']).subscribe(
                data=>{
                  localStorage.setItem('userPermissions', JSON.stringify({ PermissionArray: data['UserPermissions'] }));
                },
                error=>{
                  console.log(error)
                }
              )
              this.toasterService.pop('success','',data['responseType']['message']);
              this.router.navigate(['/dashboard']);
              //  location.reload();
            }
            else {
              //Sending message to Snackbar
              this.toasterService.pop('error','',data['responseType']['message']);

            }
          },
          error => {
            console.log(error);
          }
        )

    //Remember Password
    if (values['rememberMe'] == true) {
      //Sending the values to cookieservice (input values => cookie service)
      this._cookieService.put('email', values['email']);
      this._cookieService.put('password', values['password']);
      this._cookieService.put('rememberMe', values['rememberMe']);
    }

    //deleting values if unselected for remember password
    if (values['rememberMe'] == false) {
      this._cookieService.remove('email', values['email']);
      this._cookieService.remove('password', values['password']);
      this._cookieService.remove('rememberMe', values['rememberMe']);
    }
    console.log(values['rememberMe'], 'form REM')
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner = false;

    //redirecting to dashboard if the session is not null when the user enters back
    if (localStorage != null) {

      //To check the url of the current page
      this.router.events.subscribe((res) => {
      })
      
      if (this.router.url == '/login') {
        this.router.navigate(['/dashboard'])
      }
    }

  }
}