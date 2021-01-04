import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private restApi: RestApiService) { }

  signin(data) {
    return this.restApi.post('/signin', data);
  }

  syncUser(data) {
    return this.restApi.post('/sync-vendor', data);
  }

  updateOneSignalId(data) {
    return this.restApi.post('/updateOneSignalId', data);
  }

  changeOnlineStatus(data) {
    return this.restApi.post('/changeOnlineStatus', data);
  }

  getProducts(data) {
    return this.restApi.post('/get-products', data);
  }

  getSpotlightBanners() {
    return this.restApi.get('/get-spotlight-banners');
  }

  getProductsByCats(data) {
    return this.restApi.post('/get-products-by-cats', data);
  }

  getCategories() {
    return this.restApi.get('/get-categories');
  }
  checkout(data) {
    return this.restApi.post('/checkout', data);
  }

  isVaildPincode(data) {
    return this.restApi.post('/isVaildPincode', data);
  }

  saveComments(data) {
    return this.restApi.post('/save-comments', data);
  }

  updateComments(data) {
    return this.restApi.post('/update-comments', data);
  }

  getComments(data) {
    return this.restApi.post('/get-comments', data);
  }

  updateProfile(data) {
    return this.restApi.post('/update-profile', data);
  }

  updateBillingAddress(data) {
    return this.restApi.post('/update-billing-address', data);
  }

  updateShippingAddress(data) {
    return this.restApi.post('/update-shipping-address', data);
  }

  getOrders(data) {
    let customer = data.customer;
    return this.restApi.get('/getOrders?customer='+ customer);
  }

  getPincodes() {
    return this.restApi.get('/get-pincodes');
  }

  getPincodeProducts(data) {
    return this.restApi.post('/get-pincode-products', data);
  }

  getOrderCourierDetails(data) {
    return this.restApi.get('/courier-status?bookingId='+data);
  }

  // getSlotes() {
  //   return this.restApi.get('/get-slotes');
  // }

  contactus(data) {
    return this.restApi.post('/contactus', data);
  }

  validateCoupon(data) {
    return this.restApi.post('/validateCoupon', data);
  }

  cancelOrder(data) {
    return this.restApi.post('/cancelOrder', data);
  }
}
