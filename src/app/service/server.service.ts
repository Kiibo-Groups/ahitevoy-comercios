import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ToastController } from '@ionic/angular/standalone';
import {
  LoginRequest,
  UpdateUserRequest,
  ForgotRequest,
  VerifyRequest,
  UpdatePasswordRequest,
  ToastRequest
} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  url = "https://dash.ahitevoy.com/api/store/"; // PROD
  // url = "http://127.0.0.1:8000/api/store/"; // LOCAL

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) { }


  login(data: LoginRequest) {
    return this.http.post(this.url + 'login', data).pipe(map(results => results));
  }

  signup(data: LoginRequest) {
    return this.http.post(this.url + 'signup', data).pipe(map(results => results));
  }

  homepage(id: string, status: any) {
    return this.http.get(this.url + 'homepage?id=' + id + '&lid=' + localStorage.getItem('lid') + '&status=' + status)
      .pipe(map(results => results));
  }


  userInfo(id: any) {
    return this.http.get(this.url + 'userInfo/' + id)
      .pipe(map(results => results));
  }

  updateInfo(data: UpdateUserRequest) {
    return this.http.post(this.url + 'updateInfo', data)
      .pipe(map(results => results));
  }

  forgot(data: ForgotRequest) {
    return this.http.post(this.url + 'forgot', data)
      .pipe(map(results => results));
  }

  verify(data: VerifyRequest) {
    return this.http.post(this.url + 'verify', data)
      .pipe(map(results => results));
  }

  updatePassword(data: UpdatePasswordRequest) {
    return this.http.post(this.url + 'updatePassword', data)
      .pipe(map(results => results));
  }

  storeOpen(type: string) {
    return this.http.get(this.url + 'storeOpen/' + type)
      .pipe(map(results => results));
  }

  orderProcess(id: string, status: any) {
    return this.http.get(this.url + 'orderProcess?id=' + id + '&status=' + status)
      .pipe(map(results => results));
  }

  getItem(id: string, type: string, value: string) {
    return this.http.get(this.url + 'getItem?id=' + id + '&type=' + type + '&value=' + value + '&lid=' + localStorage.getItem('lid'))
      .pipe(map(results => results));
  }

  changeStatus(id: string, status: number) {
    return this.http.get(this.url + 'changeStatus?id=' + id + '&status=' + status)
      .pipe(map(results => results));
  }


  overview(id: any) {
    return this.http.get(this.url + 'overview?id=' + id)
      .pipe(map(results => results));
  }

  GeocodeFromCoords(lat: any, lng: any, apikey: any) {
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?key=" + apikey + "&latlng=" + lat + "," + lng)
      .pipe(map(results => results));
  }

  GeocodeFromPlace(address: any, apikey: any) {
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?key=" + apikey + "&place_id=" + address)
      .pipe(map(results => results));
  }

  GeocodeFromAddress(address: any, apikey: any) {
    return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?key=" + apikey + "&address=" + address)
      .pipe(map(results => results));
  }

  /**
   * 
   * Servicios
   * 
   */

  OrderComm(data: any) {
    return this.http.post(this.url + 'OrderComm', data)
      .pipe(map(results => results));
  }

  ViewCostShipCommanded(data:any) {
    return this.http.post(this.url + 'ViewCostShipCommanded', data).pipe(
      map(results => results)
    );
  }

  chkEvents_comm(id:any) {
    return this.http.get(this.url + 'chkEvents_comm/' + id).pipe(
      map(results => results)
    );
  }

  /**
   * 
   * @param txt 
   * @param color 
   */
  async presentToast(ToastOptions: ToastRequest) {
    const toast = await this.toastController.create({
      message: ToastOptions.text,
      duration: 3000,
      position: ToastOptions.position,
      mode: 'ios',
      color: ToastOptions.color,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
