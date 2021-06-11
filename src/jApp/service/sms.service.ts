import { Injectable } from '@angular/core';
import { RestApiService } from '../server/rest-api.service';
import { HttpClient } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs/internal/Observable';

let apiKey="1743AlodLGqTRw55de39c5c";
let sender = {
  //name: 'NAADEN'
  name: 'FRMCRT'
}
let country = '91';
let dltTeId='1207161882785837879';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

 
  constructor(private http: HttpClient, private httpNative: HTTP, private platform: Platform) { }


  send(mobile:string, message: string) 
  {
    //http://adlinks.websmsc.com/api/sendhttp.php?authkey=1743AlodLGqTRw55de39c5c&mobiles=9946500456&message=test&sender=FRMCRT&route=4&country=91&DLT_TE_ID=1207161822139083307
    let url = "http://adlinks.websmsc.com/api/sendhttp.php?authkey="+ apiKey + "&mobiles="+ mobile +"&message="+message+"&sender="+ sender.name+"&route=4&country="+country+"&DLT_TE_ID="+dltTeId;
    
    if(this.platform.is('desktop'))
    {
      return this.http.get(url);
    } else {
      return new Observable<any>(subscribe => {
        this.httpNative.get(url, {}, null).then(res => {
            subscribe.next({});
            subscribe.unsubscribe();
        });
      })
    }
  }
}
