import { Injectable } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DeviceAccounts } from '@ionic-native/device-accounts/ngx';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
// import { File } from '@ionic-native/file';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    private deviceAccounts: DeviceAccounts
  ) { }

  url(endpoint = '') {
    return environment.domain+"/api/v1/user-app" + endpoint;
  }

  toast(message: string, position: 'top' | 'bottom' | 'middle' = 'middle', duration: number = 2000 ) {
      this.toastController.create({
        // header: 'Toast header',
        message,
        position: position,
        duration
      }).then((toast) => {
        toast.present();
      });
  }

  loaderInstance: HTMLIonLoadingElement;

  loader(message: string = 'Please Wait...', duration: number = 0) {
      this.loadingController.create({
        // spinner: null,
        duration,
        message,
        translucent: true,
      }).then(loading => {
        this.loaderInstance = loading;
        this.loaderInstance.present();
      })
  }

  loaderDismiss() {
    if(typeof this.loaderInstance != 'undefined') {
      this.loaderInstance.dismiss();
    }
  }

  // image upload
    presentActionSheet(title: any, buttons: any) {
      this.actionSheetCtrl.create({
        header: title,
        buttons: buttons
      }).then(actionSheet => {
        actionSheet.present();
      });
    }

    // Camera
    takeCameraPhoto(returnType = 'FILE_URI', quality = 70) {
      const options: CameraOptions = {
        quality: quality,
        //destinationType: this.camera.DestinationType.FILE_URI,DATA_URL
        destinationType: this.camera.DestinationType[returnType],
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        //sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }
      return this.camera.getPicture(options);
    }
  
    takeGalPhoto(returnType = 'FILE_URI', quality = 70) {
      const options: CameraOptions = {
        quality: quality,
        //destinationType: this.camera.DestinationType.FILE_URI,DATA_URL
        destinationType: this.camera.DestinationType[returnType],
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }
      return this.camera.getPicture(options);
    }
  
    uploadFile(fileurl: any, api: any, data = {}) {
      const headers = new HttpHeaders();
      headers.set('Content-Type', 'application/form-data; charset=utf-8');
      // headers.set("Accept", 'application/json');
  
      let options: FileUploadOptions = {
        fileKey: 'image',
        fileName: 'Photo.jpg',
        //headers: {},
        headers: headers,
        chunkedMode: false,
        //mimeType: "image/jpeg",
        mimeType: "multipart/form-data",
        params: data
      }
      const fileTransfer: FileTransferObject = this.transfer.create();
      return fileTransfer.upload(fileurl, api, options);
    }
  
    uploadCameraPic(api: any, data = {}) {
      return new Promise((resolve, reject) => {
        let camerarespone: any = this.takeCameraPhoto();
        camerarespone.then((fileurl) => {
          this.loader('Uploading...');
          this.uploadFile(fileurl, this.url(api), data).then((res) => {
            this.loaderDismiss();
            resolve(res.response);
          }, (err) => {
            this.loaderDismiss();
            reject(err);
          }).catch((e) => {
            this.loaderDismiss();
            this.toast("Internet Error");
          })
        },
          (err) => {
            this.toast("May, No Photo Clicked");
          });
      });
    }
  
    uploadGalPic(api: any, data = {}) {
      return new Promise((resolve, reject) => {
        let camerarespone: any = this.takeGalPhoto();
        camerarespone.then((fileurl) => {
          this.loader('Uploading...');
          this.uploadFile(fileurl, this.url(api), data).then((res) => {
            this.loaderDismiss();
            resolve(res.response);
          }, (err) => {
            this.loaderDismiss();
            reject(err);
          }).catch((e) => {
            this.loaderDismiss();
            this.toast("Internet Error");
          })
        },
          (err) => {
            this.toast("Please select at least a photo");
          });
      });
    }
  
    uploadPicCamGal() {
      return new Promise((resolve, reject) => {
        this.presentActionSheet("Take Picture", [
          {
            text: 'Gallery',
            handler: () => {
              resolve('Gallery');
            }
          },
          {
            text: 'Camera',
            handler: () => {
              resolve('Camera');
            }
          },
        ]);
      });
    }

    getDeviceAccounts() {
      return this.deviceAccounts.get()
    }
}
