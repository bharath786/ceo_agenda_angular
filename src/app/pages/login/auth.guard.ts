import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    //Assigning Session values to sessionid
    let sessionid = JSON.parse(localStorage.getItem("Session_name"));

    //Redirecting to logout page if session is null
    if (sessionid == null) {
      this.router.navigate(['/login']);
      return false;
    }

      //giving permissions if the access token is not equal to null
      if (sessionid['accessToken'] != '') {
        return true;

      }

      //redirecting to login page if the access token is null
      else {
        this.router.navigate(['/login']);
        return false;
      }
  }

  exports: [AuthGuard]
}
