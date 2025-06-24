import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ServerService } from '../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardSubtitle, IonCardHeader, IonCol, IonRow, NavController, LoadingController, AlertController, IonBadge, IonCardContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
  standalone: true,
imports: [IonButton, IonIcon, IonCardContent, IonBadge, IonRow, IonCol, IonCardHeader, IonCardSubtitle, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AllOrdersPage implements OnInit {


  data: any;
  text: any;

  constructor(
    private route: ActivatedRoute,
    public server: ServerService,
    private nav: NavController,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {
    const appText = localStorage.getItem('app_text');
    this.text = appText ? JSON.parse(appText) : null;
  }
  ngOnInit() {
  }
  ionViewWillEnter() {
    if (!localStorage.getItem('user_id') || localStorage.getItem('user_id') == 'null') {
      this.nav.navigateRoot('/login');
      this.server.presentToast({ text: "Por favor inicie sesión para acceder a su perfil.", color: "danger", position: "top" });
    }
    else {
      this.loadData();
    }
  }

  async loadData() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.homepage(localStorage.getItem('user_id') || '', 5).subscribe((response: any) => {
      console.log(response);
      this.data = response.data;
      loading.dismiss();
    });
  }

  detail(odata: any) {
    localStorage.setItem('odata', JSON.stringify(odata));

    this.nav.navigateForward('/detail');
  }
}
