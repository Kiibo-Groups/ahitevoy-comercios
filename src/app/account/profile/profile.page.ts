import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { ToastController, NavController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { DeleteAccountPage } from '../delete-account/delete-account.page';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
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
    public toastController: ToastController, 
    private nav: NavController, 
    public loadingController: LoadingController,
    public modalController: ModalController
  ) {
    this.text = JSON.parse(localStorage.getItem('app_text'));
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null') {
      this.nav.navigateRoot('/login');
      this.presentToast("Inicie sesión para acceder a su perfil ");
    }
    else {
      this.loadData();
    }
  }

  async takeAction(type) {
    this.action = type;
  }

  async loadData() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.userInfo(localStorage.getItem('user_id')).subscribe((response: any) => {

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


  async update(data) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    var allData = { id: localStorage.getItem('user_id'), password: data.password, min_cart_value: data.min_cart_value, delivery_charges_value: data.delivery_charges_value }

    this.server.updateInfo(allData).subscribe((response: any) => {

      this.action = 0;
      this.data = response.data;

      this.presentToast("Actualizado con éxito.");

      loading.dismiss();

    });
  }

  logout() {
    this.storeOpen(0);
    localStorage.setItem('user_id', null);
    localStorage.removeItem('user_id');
    this.nav.navigateRoot('/login');
  }

  async storeOpen(type) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.storeOpen(type + "?user_id=" + localStorage.getItem('user_id')).subscribe((response: any) => {
      loading.dismiss();
      if (response.data == 'error') {
        this.presentToast("Ha ocurrido un problema por favor, intente de nuevo mas tarde");
      }
    });
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position: 'top',
      mode: 'ios',
      color: 'dark'
    });
    toast.present();
  }
}
