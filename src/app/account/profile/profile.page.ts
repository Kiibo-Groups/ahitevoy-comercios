import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteAccountPage } from '../delete-account/delete-account.page';
import { ServerService } from '../../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonCard, IonBackButton, IonCardHeader, IonCardTitle, IonListHeader, IonList, IonLabel, IonToggle, IonItem, IonIcon, IonCardSubtitle, IonButton, NavController, LoadingController, ModalController, IonBadge, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UpdateUserRequest } from 'src/app/service/interfaces';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonInput, IonBadge, IonButton, IonCardSubtitle, IonIcon, IonItem, IonToggle, IonLabel, IonList, IonListHeader, IonCardTitle, IonCardHeader, IonBackButton, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {

  @ViewChild('content', { static: false }) private content: any;

  data: any;
  action: any;
  text: any;
  order: any;

  constructor(
    private route: ActivatedRoute,
    public server: ServerService,
    private nav: NavController,
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    const appText = localStorage.getItem('app_text');
    this.text = appText ? JSON.parse(appText) : null;
    
    if (!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null') {
      this.nav.navigateRoot('/login');
      this.server.presentToast({text : "Inicie sesión para acceder a su perfil.", color :"danger", position: "top"});
    }
    else {
      this.loadData();
    }
  }


  ngOnInit() {
  }


  ionViewWillEnter() {
    
  }

  async takeAction(type:number) {
    this.action = type;
  }

  async loadData() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response: any) => {
      console.log(response)
      this.data = response.data;
      this.order = response.order;

      loading.dismiss();

    });
  }

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: DeleteAccountPage,
      animated: true,
      mode: 'ios',
      cssClass: 'my-custom-delete-account-modal-css',
      backdropDismiss: true,
    });

    modal.onDidDismiss().then(data => {
      this.takeAction(0);
    });

    return await modal.present();
  }

  async update(data: UpdateUserRequest) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    var allData = {
      id: localStorage.getItem('user_id') || '',
      password: data.password,
      min_cart_value: data.min_cart_value,
      delivery_charges_value: data.delivery_charges_value
    }

    this.server.updateInfo(allData).subscribe((response: any) => {

      this.action = 0;
      this.data = response.data;

      this.server.presentToast({text : "Actualizado con éxito.", color : "success", position : "top"});

      loading.dismiss();

    });
  }

  logout() {
    this.storeOpen(0);
    localStorage.setItem('user_id', 'null');
    localStorage.removeItem('user_id');
    this.nav.navigateRoot('/login');
  }

  async storeOpen(type:number) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.storeOpen(type + "?user_id=" + localStorage.getItem('user_id')).subscribe((response: any) => {
      loading.dismiss();
      if (response.data == 'error') {
        this.server.presentToast({text : "Ha ocurrido un problema por favor, intente de nuevo mas tarde", color: "danger", position : "top"});
      }
    });
  }

}
