import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from 'src/app/shared/_constants.data';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //URL's for API to send and recieve data
  loginAPI = url + "login";
  forgotpasswordAPI = url + "forgotpassword";
  setpasswordAPI = url + "setpassword";

  sessiontoken: string;
  sessionuser: string;

  constructor(private http: HttpClient) {
  }


  //Login Service to send the values to API
  loginAuth(values) {
    return this.http.post(this.loginAPI, values)
  }

  //Forgot Password Service
  forgotPassword(emailId) {
    return this.http.post(this.forgotpasswordAPI, emailId)
  }

  //For Reset Password
  setPassword(values) {
    console.log(values);
    return this.http.post(this.setpasswordAPI + '?verificationToken=' + values.verificationToken + "&password=" + values.password, {})
  }


}
