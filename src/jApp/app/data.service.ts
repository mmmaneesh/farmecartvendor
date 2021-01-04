import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  getLocal(name: string) {
    let res = localStorage.getItem(name); 
    if(res == null) return null;

    try {
      return JSON.parse(res);
    } catch {
      return res;
    }
  }

  setLocal(name, obj: string | object) {
    if(typeof obj == 'string') {
      return localStorage.setItem(name, obj);
    } else {
      let stringify = JSON.stringify(obj);
      return localStorage.setItem(name, stringify);
    }
  }

  clearAll() {
    localStorage.clear();
  }
}
