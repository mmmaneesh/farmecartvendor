import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourierService {
  url = environment.courierApiUrl;
  constructor(private http: HttpClient) { }

  getCourierToken(): any {
    // let reqHeader = {
    //     Content-Type: 'application/x-www-form-urlencoded'
    // };

    let request = {
        CompanyCode: 'CL0XX',
        CustomerCode: '500XXX',
        Password: 'XXXXX'
    }; 
    
    //http://adlinks.websmsc.com/api/sendhttp.php?authkey=1743AlodLGqTRw55de39c5c&mobiles=9946500456&message=test&sender=FRMCRT&route=4&country=91
    let courierUrl= this.url+'/apiv.1/Auth/GetToken';

    return this.http.post(courierUrl, request, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
  }
}
