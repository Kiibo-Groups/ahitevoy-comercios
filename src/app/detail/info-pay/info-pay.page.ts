import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsService } from '../../service/events.service';
import { ServerService } from '../../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, ModalController, IonButtons, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-info-pay',
  templateUrl: './info-pay.page.html',
  styleUrls: ['./info-pay.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InfoPayPage implements OnInit {

  @Input() odata: any;
  @Input() payment_type: any;

  data: any;
  payment: any;
  constructor(
    public modalController: ModalController,
    public server: ServerService
  ) { }


  ngOnInit() {
  }


  ionViewWillEnter() {
    if (this.odata) {
      this.data = JSON.parse(this.odata);
      this.payment = this.payment_type;
    } else {
      this.server.presentToast({text : "Por favor ingresa la información necesaria.",color: 'danger', position:"top"});
      this.modalController.dismiss();
    }
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
