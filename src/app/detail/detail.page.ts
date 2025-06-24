import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InfoPayPage } from './info-pay/info-pay.page';
import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service';
import { StatusBar } from '@capacitor/status-bar';

import { Platform, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonCard, IonListHeader, IonItem, IonAvatar, IonLabel, IonCardHeader, IonCardSubtitle, IonCardContent, IonRow, IonCol, IonIcon, IonButton, IonFooter, AlertController, NavController, LoadingController, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [IonFooter, IonButton, IonIcon, IonCol, IonRow, IonCardContent, IonCardSubtitle, IonCardHeader, IonLabel, IonAvatar, IonItem, IonListHeader, IonCard, IonList, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RouterModule]
})
export class DetailPage implements OnInit {


  data: any;
  text: any;
  status: number;
  admin: any;
  constructor(
    public platform: Platform,
    public alertController: AlertController,
    public server: ServerService,
    private nav: NavController,
    public events: EventsService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    const odata = localStorage.getItem('odata');
    this.data = odata ? JSON.parse(odata) : null;
    const admin = localStorage.getItem('admin');
    this.admin = admin ? JSON.parse(admin) : null;
    this.status = this.data ? this.data.status : null;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      
      if ((window as any).cordova) {
        // this.statusBar.styleDefault();
        StatusBar.setBackgroundColor({ color: "#009933" });
      } else {
        console.warn('Cordova no está disponible. OneSignal solo funciona en dispositivo/emulador.');
      }
      
      const appText = localStorage.getItem('app_text');
      if (appText && appText !== undefined) {
        this.text = JSON.parse(appText);
      } else {
        this.text = null;
      }
    });
  }

  async startRide(id: string, type: number) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.orderProcess(id, type).subscribe((response: any) => {

      if (type == 5) {
        this.server.presentToast({text : "Orden completada con éxito.", color: "success", position: "top"});

        this.nav.navigateRoot('home');
      }
      else if (type == 2) {
        this.server.presentToast({text : "Pedido cancelado con éxito.", color: "success", position: "top"});

        this.nav.navigateRoot('home');
      }
      else if (type == 7) {
        this.server.presentToast({text : "Notificación enviada al cliente", color: "success", position: "top"});
        this.nav.navigateRoot('home');
      }
      else {
        this.server.presentToast({text : "Estado del pedido actualizado correctamente.", color: "success", position: "top"});
        this.nav.navigateRoot('home');
      }

      this.status = response.data;

      loading.dismiss();

    });
  }

  async infoPage() {
    const modal = await this.modalController.create({
      component: InfoPayPage,
      animated: true,
      mode: 'ios',
      cssClass: 'my-custom-info-modal-css',
      backdropDismiss: true,
      componentProps: {
        'odata': JSON.stringify(this.data.GetTaxes),
        'payment_type': this.data.pay
      }

    });
    return await modal.present();
  }

}
