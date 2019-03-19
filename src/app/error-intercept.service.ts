import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from './pages/login/login.service';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster/src/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptService implements HttpInterceptor {

  constructor(private authenticationService: AppService, private router: Router, public toasterService: ToasterService,) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        if (err.status === 401) {
            // auto logout if 401 response returned from api
            var session_values = JSON.parse(localStorage['Session_name'])
            var value = { userId: session_values.user_id }
            this.authenticationService.logOut(value).subscribe(
                data => {
                    localStorage.clear()
                    this.router.navigateByUrl("/login"); 
                    window.location.reload();
                    this.toasterService.pop('success','',data['message']);
                }, error => {
                    console.log(error);
                }
            )
            location.reload(true);
        }
        const error = err.error.message || err.statusText;
        console.log(error)
        return throwError(error);
    }))
}
}