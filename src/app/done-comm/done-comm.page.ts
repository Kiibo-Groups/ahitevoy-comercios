import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServerService } from '../service/server.service';
import { Geolocation } from '@capacitor/geolocation';   
import { interval } from 'rxjs';

import {
  Platform,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, 
  IonButtons, 
  IonCard, 
  IonIcon,
  IonButton, 
  NavController,
  LoadingController,
  ModalController,
  ToastController, 
  IonSpinner
} from '@ionic/angular/standalone';

declare var google:any;

@Component({
  selector: 'app-done-comm',
  templateUrl: './done-comm.page.html',
  styleUrls: ['./done-comm.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonButton,
    IonIcon, 
    IonCard, 
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,  
  ]
})
export class DoneCommPage implements OnInit {

  @ViewChild('map', { static: true }) 'mapElement': ElementRef;

  pet: any = 1;
  data: any;
  text: any;
  currency: any;

  chkData: any;

  viewRate: boolean = false;
  constructor(
    public toastController: ToastController,
    private nav: NavController,
    public server: ServerService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public platform: Platform
  ) { }

  ngOnInit() {
    const app_text = localStorage.getItem('app_text')
    this.text = app_text ? JSON.parse(app_text) : [];
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.getCart();
      // Inicializamos Timer
      this.chkData = interval(3000).subscribe(() => {
        this.getCart();
      });
    });
  }

  ionViewWillLeave() {
    // Detenemos el Timer
    clearInterval(this.chkData);
    this.chkData.unsubscribe();
  }

  getCart() {
    this.server.chkEvents_comm(localStorage.getItem('user_id')).subscribe((response: any) => {
      console.log(response);
      if (response.data == 0) {
        clearInterval(this.chkData);
        this.chkData.unsubscribe();
        this.server.presentToast({text: "No tienes pedidos en ruta", color :'danger', position:"top"});
        this.nav.navigateRoot('/home');
      } else {
        this.data = response.data;

        // Verificamos si algun servicio ha terminado
        this.data.forEach((element:any) => {
          const dat = element.event;

          if (dat.status == 5) {
            clearInterval(this.chkData);
            this.chkData.unsubscribe();
            if (this.viewRate == false) {
              this.viewRate = true;
              // this.viewRateTrip(element);
            }
          }
        });
      }
    });
  }

  async resendComm(item:any) {
    // const loading = await this.loadingController.create({
    //   mode: 'ios'
    // });
    // await loading.present();

    // let alldata = {
    //   id_order: item
    // };

    // this.server.chkEvents_staffs(alldata).subscribe((data) => {
    //   loading.dismiss();
    //   this.presentToast("Se ha vuelto a enviar la solicitud de servicio...", 'secondary');
    // });
  }

  async cancelComm(item:any) {
    // const loading = await this.loadingController.create({
    //   mode: 'ios'
    // });
    // await loading.present();
    // this.server.cancelComm_event(item).subscribe((data) => {
    //   loading.dismiss();
    //   this.presentToast("El Pedido #" + item + " ha sido cancelado...", 'success');
    //   this.nav.navigateRoot('/home');
    // });
  }

  async viewRateTrip(item:any) {
    // const modal = await this.modalController.create({
    //   component: RateTripPage,
    //   animated: true,
    //   mode: 'ios',
    //   cssClass: 'my-custom-rate-css',
    //   backdropDismiss: false,
    //   showBackdrop: true,
    //   componentProps: {
    //     'data_post': JSON.stringify(item)
    //   }
    // });

    // modal.onDidDismiss().then((data) => {
    //   clearInterval(this.chkData);
    //   this.chkData.unsubscribe();
    //   this.nav.navigateRoot('/home');
    // });

    // return await modal.present();
  }

  backPage() {
    this.nav.navigateRoot('/home');
  }

}
