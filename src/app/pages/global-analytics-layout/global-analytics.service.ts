import { Injectable } from '@angular/core';
import { url } from 'src/app/shared/_constants.data'
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalAnalyticsService {
  constructor(private http: HttpClient) { }

  getKPIMonthsWeeks(data) {
    return this.http.post(url + "get-kpi-months-weeks", data[0], this.getHeaders())
  }

  saveKPIData(data) {
    return this.http.post(url + "save-kpi-data", data, this.getHeaders())
  }

  deleteKPIData(data) {
    return this.http.post(url + 'delete-kpi-data', data, this.getHeaders())
  }
  //For Headers
  getHeaders() {
    let sessionUser = JSON.parse(localStorage['Session_name'])
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorisation': sessionUser.token,
        'Userid': sessionUser.user_id
      })
    }
    return httpOptions;
  }

  getDimensionSummary(dimensionId){
    return this.http.get(url+'get-dimension-summary'+'/?DimensionId='+dimensionId);
  }

}
