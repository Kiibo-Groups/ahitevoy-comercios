import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { CommonModule } from '@angular/common'; 
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder, ReverseOptions } from '@capgo/nativegeocoder';


import {
  Platform,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonTextarea,
  IonFooter,
  IonButton,
  ToastController,
  NavController,
  LoadingController,
  ModalController, IonIcon } from "@ionic/angular/standalone";

declare var google: any;

@Component({
  selector: 'app-setaddress',
  templateUrl: './setaddress.page.html',
  styleUrls: ['./setaddress.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonButton, IonFooter, IonTextarea, IonLabel, IonItem, IonList, CommonModule]
})
export class SetaddressPage implements OnInit {

  @ViewChild('map', { static: true }) 'mapElement': ElementRef;

  map: any;
  lat: any;
  lng: any;
  location: any;
  address!: string;
  type_add: any;
  text: any;
  marker: any;
  admin:any;
  constructor(
    public platform: Platform,
    public server: ServerService,
    public toastController: ToastController,
    public nav: NavController,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    const app_text = localStorage.getItem('app_text');
    this.text = app_text ? JSON.parse(app_text) : [];
    
    const admin_data = localStorage.getItem('admin');
    this.admin = admin_data ? JSON.parse(admin_data) : [];
  }

  ngOnInit() {

  }

  async pedirPermisoUbicacion() {
    const perm = await Geolocation.requestPermissions();
    console.log('Permiso de geolocalización:', perm);
  }

  async ionViewWillEnter() {
    const loading = await this.loadingController.create({
      message: 'Cargando mapa...',
      mode: 'ios'
    });

    await loading.present();

    // const status = await Geolocation.checkPermissions();
    // console.log('Estado de permisos:', status);
    
    this.platform.ready().then(() => {   
      Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000, // 20 segundos
        maximumAge: 0}
      ).then(async (resp) => {
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        console.log("Coordenadas : ", resp);
        
        await this.loadMap();
        await this.getAddressFromCoords(this.lat, this.lng);
        
        loading.dismiss();
      }).catch((error) => {
        this.server.presentToast({ text: "Ha ocurrido un problema.", color: "danger", position: "top" });
        console.log(error)
        loading.dismiss();
      });
    });
  }

  async loadMap() { 

    let latLng = new google.maps.LatLng(this.lat, this.lng);

    let mapOptions = {
      center: latLng,
      zoom: 17,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      position: latLng
    });
    this.marker.setVisible(true);
  
    google.maps.event.addListener(this.marker, 'dragend', (evt: any) => {
      this.getAddressFromCoords(evt.latLng.lat(), evt.latLng.lng());
    }); 
  }

  async getAddressFromCoords(lattitude: any, longitude: any) {
      this.server.GeocodeFromCoords(lattitude, longitude, this.admin.ApiKey_google).subscribe((address:any) => {
        if(address.status == "OK")
        {
          this.address = address.results[0].formatted_address.slice(0, 25) + '...';
        }
      });
  }

  async saveAddress() {
    this.modalController.dismiss(this.address, 'setAdd');
  }

  cancelAdd() {
    this.modalController.dismiss();
  }

}
