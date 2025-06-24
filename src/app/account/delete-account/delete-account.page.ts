import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServerService } from '../../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonCard, IonCardHeader, IonCardContent, IonList, IonItem, IonLabel, IonButton, NavController, LoadingController, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonList, IonCardContent, IonCardHeader, IonCard, IonIcon, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DeleteAccountPage implements OnInit {

  data: any;

  constructor(
    public nav: NavController,
    public server: ServerService,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    if (!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null') {
      this.nav.navigateRoot('/login');
      this.server.presentToast({ text: "Por favor, Ingresa a tu cuenta primero.", color: 'danger', position: "top" });
    }
    else {
      this.loadData();
    }
  }

  ngOnInit() {
  }


  async loadData() {
    const loading = await this.loadingController.create({
      message: 'Obteniendo tus datos...',
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response: any) => {
      this.data = response.data;
      console.log(this.data)
      loading.dismiss();
    });
  }

  async ConfirmDelete(form: FormData) {

    const loading = await this.loadingController.create({
      message: 'Enviando solictud...',
    });
    await loading.present();

    setTimeout(() => {
      loading.dismiss();
      this.server.presentToast({text : "Tu solicitud ha sido enviada y sera revisada por un administrador. ",color : 'success', position: "top"});
      this.modalController.dismiss();
    }, 3000);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
