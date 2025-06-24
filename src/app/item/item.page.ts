import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonSegmentButton, IonSegmentView, IonSegmentContent, IonCard, IonCardContent, IonRow, IonCol, IonToggle, AlertController, NavController, LoadingController, IonSegment } from '@ionic/angular/standalone';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  standalone: true,
  imports: [IonSegment, IonToggle, IonCol, IonRow, IonCardContent, IonCard, IonSegmentButton, IonSegmentView, IonBackButton, IonSegmentContent, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ItemPage implements OnInit {

  data: any;
  text: any;
  pet: number = 0;
  store: any;
  constructor(
    public alertController: AlertController,
    public server: ServerService,
    private nav: NavController,
    public events: EventsService,
    public loadingController: LoadingController
  ) {

  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    if (localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined) {
      const appText = localStorage.getItem('app_text');
      this.text = appText ? JSON.parse(appText) : null;
      const storeData = localStorage.getItem('store_data');
      this.store = storeData ? JSON.parse(storeData) : null;
    }

    this.loadData();
  }


  async loadData() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.getItem(localStorage.getItem('user_id') || '', this.store.c_type, this.store.c_value).subscribe((response: any) => {
      console.log(response);
      this.data = response.data;
      loading.dismiss();
    });
  }

  changeStatus(id: string, status: number) {
    this.server.changeStatus(id, status).subscribe((response: any) => {
      this.loadData();
    });
  }

  detail(odata: any) {
    localStorage.setItem('odata', JSON.stringify(odata));
    this.nav.navigateForward('/detail');
  }
}
