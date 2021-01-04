import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from "@angular/common/http";
import { from, Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { UtilityService } from '../../jIonic/utility.service';
@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  showLoader = true;
  constructor(public loadingController: LoadingController, public utility: UtilityService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
      if (req.url.indexOf('http') !== 0) {
        return next.handle(req);
      }

      return from(this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Please Wait...'
      }))
        .pipe(
          tap((loading) => {
            return loading.present();
          }),
          switchMap((loading) => {
            return next.handle(req).pipe(
              finalize(() => {
                loading.dismiss();
              })
            );
          })
        );
    
    
      
            // this.utility.loader('Please Wait...');
          
            // return next.handle(req).pipe(
            //   finalize(() => {
            //     this.utility.loaderDismiss();
            //   })
            // );
    }
}