import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,Events,AlertController,ToastController, ModalController } from '@ionic/angular';
import { InfoPayPage } from './info-pay/info-pay.page';
@Component({
  selector: 'app-detail',
  templateUrl: 'detail.page.html',
  styleUrls: ['detail.page.scss'],
})
export class DetailPage {
	
  data:any;
  text:any;
  status:number;
  admin: any;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public server : ServerService,
    private nav: NavController,
    public events: Events,
    public loadingController : LoadingController,
    public modalController: ModalController
  )
  {
      this.data 	= JSON.parse(localStorage.getItem('odata'));
      this.admin  = JSON.parse(localStorage.getItem('admin'));
      this.status	= this.data.status;
  }

  ionViewWillEnter()
  {
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }
  }

  ngOnInit()
  {
    
  }

  async presentAlertConfirm(id,status) {
    
    this.startRide(id,status);
  }

  async startRide(id,type)
  {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.orderProcess(id,type).subscribe((response:any) => {
    
    if(type == 5)
    {
    	this.presentToast("Orden completada con éxito.");

    	this.nav.navigateRoot('home');
    }
    else if(type == 2)
    {
      this.presentToast("Pedido cancelado con éxito.");

      this.nav.navigateRoot('home');
    }
    else if(type == 7)
    {
      this.presentToast("Notificación enviada al cliente");
      this.nav.navigateRoot('home');
    }
    else
    {
      this.presentToast("Estado del pedido actualizado correctamente.");
      this.nav.navigateRoot('home');
    }

    this.status = response.data;

    loading.dismiss();

    });
  }

  async infoPage()
  {
    const modal = await this.modalController.create({
      component: InfoPayPage,
      animated:true,
      mode:'ios',
      cssClass: 'my-custom-info-modal-css',
      backdropDismiss:true,
      componentProps: {
        'odata' : JSON.stringify(this.data.GetTaxes),
        'payment_type' : this.data.pay
      }
      
    });
    return await modal.present();
  }

  async presentToast(txt) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:'dark'
    });
    toast.present();
  }
}
