import { Injectable } from '@angular/core';

interface  StackType {
  store: Array<any>,
  api: any,
  isFetching: boolean,
  fetchInbackground: boolean,
  current_page: number,
  last_page: number,
  loadFromApi: Function
}

@Injectable({
  providedIn: 'root'
})
export class StackerService {

  stackList:Object = {};

  constructor() { }

  getStack(name: string, api = {}) {

    if(typeof this.stackList[name] != 'undefined') {
      return this.stackList[name];
    }

    let stack : StackType = {
      store: [],
      api: api,
      isFetching: false,
      fetchInbackground: false,
      current_page: 1,
      last_page: 9999,
      loadFromApi : function(more: boolean = false) {
        this.isFetching = true;
        this.api({page: this.current_page}).subscribe(res => {
          this.isFetching = false;
          if(res &&  res.status && res.status == 'success') {
            this.current_page = res.data.products.current_page;
            this.last_page = res.data.products.last_page;
            if(more === false) {
              this.store = res.data.products.data;
            } else {
              this.store = this.store.concat(res.data.products.data);
            }
          }
        }, error => {
          this.isFetching = false;
        });
      }
    };

    this.stackList[name] = stack;
    return this.stackList[name];
  }
}
