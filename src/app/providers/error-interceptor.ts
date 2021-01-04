import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppService } from '../../jApp/app/app.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public app: AppService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.app.logout();
            }
            const error = err.error.message || err.error.detail || err.statusText;
            return throwError(error);
        }));
    }
}