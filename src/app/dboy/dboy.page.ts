import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from './../service/server.service';
import { ToastController,NavController,Platform,LoadingController,AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dboy',
  templateUrl: './dboy.page.html',
  styleUrls: ['./dboy.page.scss'],
})

export class DboyPage implements OnInit {

  oid:any;
  data:any;
  dataExt:any;
  realData = [];
  staffInUse = [];
  text:any;
  staffExt = [];
  staffExtInUse = [];
  p_staff: any;
  odata: any;
  constructor(public alertcontroller: AlertController, public loadingController : LoadingController,private route: ActivatedRoute,public server : ServerService,public toastController: ToastController,private nav: NavController,public platform:Platform) {

    this.oid    = this.route.snapshot.paramMap.get('id');
    this.odata 	= JSON.parse(localStorage.getItem('odata'));
    this.data   = JSON.parse(localStorage.getItem('dboy'));
    this.text   = JSON.parse(localStorage.getItem('app_text'));
    this.p_staff = localStorage.getItem('p_staff');

    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      if (element.store_id == localStorage.getItem('store_id')) {
        if (element.status_send == 1) {
          this.staffInUse.push(element);
        }else {
          this.realData.push(element);
        }
      }
    }
  }

  ngOnInit() {
  }

  async assign_ext(type_staff)
  {
    const loading = await this.loadingController.create({
      message: 'Enviando Notificación...',
    });
    await loading.present();

    this.server.orderProcess(this.oid,'1.5&dboy_Ext=true&type_staff='+type_staff.type_staff).subscribe((response:any) => {
      loading.dismiss();
      if (response.data_deli.listdboy > 0) {
        this.presentToast("Se ha enviado la solicitud de servicio.",'success');
        this.nav.navigateRoot('home');  
      }else {
        this.presentToast("No hay repartidores disponibles, por favor selecciona otro tipo de entrega.",'danger');
      }
      
    });
  }

  async presentToast(txt,color) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      color: color
    });
    toast.present();
  }

}
