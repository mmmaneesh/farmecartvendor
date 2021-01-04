import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { UtilityService } from '../../jIonic/utility.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient, private httpNative: HTTP, private platform: Platform, private utility: UtilityService) { }

  domain = environment.domain;
  courier = environment.courierApi;

  url(endpoint = '') {
    return this.domain+"/api/v1/user-app" + endpoint;
  }

  courierUrl(endpoint = '') {
    return this.courier + endpoint;
  }

  get(endpoint, defaultUrl=true) {
    let url = (defaultUrl) ? this.url(endpoint) : endpoint;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Accept": 'application/json' });
    let options = { headers: headers };
      return this.http.get<any>(url, options );
  }

  getCourierUrl(endpoint) {
    let url = this.courierUrl(endpoint);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Accept": 'application/json' });
    let options = { headers: headers };
      return this.http.get<any>(url, options );
  }

  post(endpoint, data, defaultUrl=true) {
    let url = (defaultUrl) ? this.url(endpoint) : endpoint;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "Accept": 'application/json' });
    let options = { headers: headers };
    
      return this.http.post<any>(url, data, options);
  }

  postFile(fileToUpload: File, endpoint): Observable<any> {
    let url = this.url(endpoint);
    const formData: FormData = new FormData();
    formData.append('file-to-upload', fileToUpload, fileToUpload.name);
    return this.http.post(url, formData);
  }
}
