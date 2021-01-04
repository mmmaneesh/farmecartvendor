import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentAuthTokenSubject = new BehaviorSubject('abc');

  constructor() { }

  public get currentAuthTokenValue() {
    return this.currentAuthTokenSubject.value;
  }
}
