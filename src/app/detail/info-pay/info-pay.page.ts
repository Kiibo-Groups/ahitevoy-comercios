import { ModalController, ToastController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-pay',
  templateUrl: './info-pay.page.html',
  styleUrls: ['./info-pay.page.scss'],
})
export class InfoPayPage implements OnInit {

  @Input() odata : any;
  @Input() payment_type : Number;
  
  data: any;
  payment: Number;
  constructor(
    public modalController: ModalController,
    public toastController: ToastController  
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter(){
    if (this.odata) {
      this.data = JSON.parse(this.odata);
      this.payment = this.payment_type;
    }else {
      this.presentToast("Por favor ingresa la información necesaria.",'danger');
      this.modalController.dismiss();
    }
  }

  async presentToast(txt,color) {
    const toast = await this.toastController.create({
      message: txt,
      duration: 3000,
      position : 'top',
      mode:'ios',
      color:color
    });
    toast.present();
  }
}
