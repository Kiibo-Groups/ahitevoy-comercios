import { Component, OnInit,ViewChild } from '@angular/core';
import { ServerService } from '../service/server.service';
import { NavController,Platform,LoadingController,IonSlides,Events,AlertController,ToastController, MenuController } from '@ionic/angular';
import { interval } from 'rxjs';
 
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	
  data:any;
  text:any;
  store:any;
  complete:any;
  pet:number = 1;
  overview:any;

  count_orders: any = 0;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public server : ServerService,
    private nav: NavController,
    public menu: MenuController ,
    public events: Events,
    public loadingController : LoadingController)
  {
    interval(2000).subscribe(() => {
      this.loadData();
    });
  }

  ionViewWillEnter()
  {
    this.menu.enable(true);
    if(localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined)
    {
      this.text = JSON.parse(localStorage.getItem('app_text'));
    }

    this.loadData();
  }

  ngOnInit()
  {
    
  }

  async reCharge()
  {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.loadData();
    loading.dismiss();
  }

  async loadData()
  {
    this.server.homepage(localStorage.getItem('user_id'),0).subscribe((response:any) => {
      
      this.count_orders = response.data.length;

      this.data      = response.data;
      this.store     = response.store;
      this.text      = response.text;
      this.overview  = response.overview;
      this.complete  = response.complete;

      this.events.publish('text', this.text);

      localStorage.setItem('dboy', JSON.stringify(response.dboy));
      localStorage.setItem('app_text', JSON.stringify(response.text));
      localStorage.setItem('admin', JSON.stringify(response.admin));
      localStorage.setItem('app_type', response.app_type);
      localStorage.setItem('store_id', response.store.id);
      localStorage.setItem('p_staff', response.store.p_staff);
      localStorage.setItem('store_data', JSON.stringify(response.store));

      this.events.publish('store_data',response.store);

      console.log(this.data);
    });
  }


  async presentToast(txt,color) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'bottom',
      mode:'ios',
      color:color,
      buttons: [
       {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  detail(odata)
  {
    localStorage.setItem('odata', JSON.stringify(odata));

    this.nav.navigateForward('/detail');
  }
}
