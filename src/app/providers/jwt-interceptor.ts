import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AppService } from '../../jApp/app/app.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(public app: AppService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('validateUser');
        if (token && (request.url.indexOf(environment.domain) !== -1)) {
            // const headers = {
            //     'Authorization': `Bearer ${token}`
            // };
            // if (request.responseType === 'json') {
            //     headers['Content-Type'] = 'application/json';
            // }
            // let customHeaders = new HttpHeaders().set('Author-Mob', this.app.state.user.mobile);
            request = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'application/json'),
                params: request.params.set(
                    "authorMob", this.app.state.user.mobile
                )
            })
        }

        return next.handle(request);
    }
}