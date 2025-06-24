import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service'; 

import { Platform, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonItem, IonLabel, IonButton, IonSelect, IonSelectOption, AlertController, LoadingController, NavController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dboy',
  templateUrl: './dboy.page.html',
  styleUrls: ['./dboy.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem,IonTitle, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonSelect, IonSelectOption, IonToolbar, CommonModule, FormsModule]
})
export class DboyPage implements OnInit {


  oid: any;
  data: any;
  dataExt: any;
  realData: any[] = [];
  staffInUse: any[] = [];
  text: any;
  staffExt = [];
  staffExtInUse = [];
  p_staff: any;
  odata: any;
  type_staff:any;
  constructor(
    public alertcontroller: AlertController, 
    public loadingController: LoadingController, 
    private route: ActivatedRoute, 
    public server: ServerService, 
    private nav: NavController, 
    public platform: Platform) {

    this.oid = this.route.snapshot.paramMap.get('id');
    const odataStr = localStorage.getItem('odata');
    this.odata = odataStr ? JSON.parse(odataStr) : null;

    const dboyStr = localStorage.getItem('dboy');
    this.data = dboyStr ? JSON.parse(dboyStr) : [];

    const appTextStr = localStorage.getItem('app_text');
    this.text = appTextStr ? JSON.parse(appTextStr) : null;

    this.p_staff = localStorage.getItem('p_staff');

    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      if (element.store_id == localStorage.getItem('store_id')) {
        if (element.status_send == 1) {
          this.staffInUse.push(element);
        } else {
          this.realData.push(element);
        }
      }
    }
  }

  ngOnInit() {
  }

  async assign_ext(type_staff:any)
  {
    const loading = await this.loadingController.create({
      message: 'Enviando Notificación...',
    });
    await loading.present();

    this.server.orderProcess(this.oid,'1.5&dboy_Ext=true&type_staff='+type_staff.type_staff).subscribe((response:any) => {
      loading.dismiss();
      if (response.data_deli.listdboy > 0) {
        this.server.presentToast({text : "Se ha enviado la solicitud de servicio.",color : 'success', position:"top"});
        this.nav.navigateRoot('home');  
      }else {
        this.server.presentToast({text : "No hay repartidores disponibles, por favor selecciona otro tipo de entrega.",color : 'danger', position:"top"});
      }
      
    });
  }
}
