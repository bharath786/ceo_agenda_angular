import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { url } from '../app/shared/_constants.data';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  public headers: any;
  sessiontoken: string;
  sessionuser: string;


  getProfileAPI = url + "get-profile";
  changePasswordAPI = url + "changepassword";
  logOutAPI = url + "logout";


  constructor(private http: HttpClient) {

  }

  //For Sending headers to API
  getHeaders() {
    let sessionUser = JSON.parse(sessionStorage['Session_name'])
    this.sessiontoken = sessionUser.token;
    this.sessionuser = sessionUser.user_id;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json;  charset=UTF-8',
        'Authorisation': this.sessiontoken,
        'Userid': this.sessionuser
      })
    }
    return this.headers = httpOptions
  }

  //For Update Profile API
  profileUpdate(values) {
    return this.http.post(this.getProfileAPI, values, this.getHeaders())
  }

  //For Change Password API
  changePassword(values) {
    return this.http.post(this.changePasswordAPI, values, this.getHeaders())
  }

  //For logout API
  logOut(user_id) {
    return this.http.post(this.logOutAPI, user_id)
  }


}
