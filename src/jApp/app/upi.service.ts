import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UpiService {

  payeeVPA: string;
  payeeName: string;
  transactionNote: string = 'nadeenin';
  payAmount: string;
  currency: string = 'INR';
  transactionReference: string;
  mc: string;

  constructor() { }

  getUrl(amount, transactionReference) {
    this.payeeVPA = '9809248886@okbizaxis';
    this.payeeName = 'FARMECART.IN';
    this.payAmount = amount;
    this.mc =  'Grocery%20Stores,%20Supermarkets';
    this.transactionReference = transactionReference; //ORDER ID or Something similar

    let url = 'upi://pay?pa=' + this.payeeVPA 
    + '&pn=' + this.payeeName 
    + '&mc=' + this.mc
    + '&tr=' + this.transactionReference 
    + '&tn=' + this.transactionNote 
    + '&am=' + this.payAmount 
    + '&mam' +  this.payAmount 
    + '&cu=' + this.currency;

    //url = "upi://pay?pa=9809248886@okbizaxis&pn=NAADEN.IN&mc=5411&tid=uGICAgICjq-uzJg&tr=GroceryShopping&tn=payforshop&am=100&mam=null&cu=INR&mode=05"

    return url;
  }

  getRandomStr(length: number) {
    var letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var str = '';
    for (var i = 0; i < length; i++) {
      str += letters[Math.floor(Math.random() * 16)];
    }
    return str;
  }
}
