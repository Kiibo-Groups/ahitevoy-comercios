import { Component, OnInit } from '@angular/core'; 
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service'; 
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IonContent,Platform, IonIcon, IonButton, IonMenuButton, AlertController, NavController, MenuController, LoadingController, IonHeader, IonToolbar, IonTitle, IonButtons, IonCard, IonSegmentButton, IonCardHeader, IonCardSubtitle, IonCardContent, IonRow, IonCol, IonBadge, IonLabel, IonCardTitle, IonFab, IonFabButton, IonGrid } from '@ionic/angular/standalone';

// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonGrid, IonFabButton, IonFab, IonCardTitle, IonLabel, IonBadge, IonCol, IonRow, IonCardContent, IonCardSubtitle, IonCardHeader, IonSegmentButton, IonCard, IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  IonContent,
  IonButton,
  IonMenuButton, 
  IonIcon ]

})
export class HomePage implements OnInit {

  data: any;
  text: any;
  store: any;
  complete: any;
  pet: number = 1;
  segmentValue: string = "nuevos";
  pedidosNuevos:any;
  pedidosEnCurso:any;
  overview: any;
  count_orders: any = 0;
  timeLoadData: any;
  constructor(
    public alertController: AlertController,
    public server: ServerService,
    public platform: Platform,
    private nav: NavController,
    public menu: MenuController,
    public events: EventsService,
    public swiper : Swiper,
    public loadingController: LoadingController) {
    this.timeLoadData = interval(2000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnInit() {
  }

  
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.menu.enable(true);

      this.swiper = new Swiper('.swiper', {
        modules: [Navigation, Pagination],
        speed: 400,
        spaceBetween: 100,
        simulateTouch: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });

      if (localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined) {
        const appText = localStorage.getItem('app_text');
        this.text = appText ? JSON.parse(appText) : null;
      }

      this.loadData();
    });
  }



  /**
   * 
   * Al salir del componente nos desubscribimos de los timers
   */
  ionViewDidLeave() {
    clearInterval(this.timeLoadData);
    (this.timeLoadData) ? this.timeLoadData.unsubscribe() : [];
    clearInterval(this.timeLoadData);
    console.log("Unsubscribe....");
  }

  async reCharge() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.loadData();
    loading.dismiss();
  }

  async loadData() {
    this.server.homepage(localStorage.getItem('user_id') || '', 0).subscribe((response: any) => {
      console.log(response)
      this.count_orders = response.data.length;

      this.data = response.data;
      this.store = response.store;
      this.text = response.text;
      this.complete = response.complete;

      this.events.publish('text', this.text);

      localStorage.setItem('dboy', JSON.stringify(response.dboy));
      localStorage.setItem('app_text', JSON.stringify(response.text));
      localStorage.setItem('admin', JSON.stringify(response.admin));
      localStorage.setItem('app_type', response.app_type);
      localStorage.setItem('store_id', response.store.id);
      localStorage.setItem('p_staff', response.store.p_staff);
      localStorage.setItem('store_data', JSON.stringify(response.store));

      this.events.publish('store_data', response.store);
    });

    // Obtenemos estadisticas de ganancias y pedidos...
    this.server.overview(localStorage.getItem('user_id')).subscribe((data:any) => {
      this.overview = data.data;
    });
  }

  detail(odata: []) {
    localStorage.setItem('odata', JSON.stringify(odata));
    this.nav.navigateForward('/detail');
  }

  viewListFinish() {
    this.nav.navigateForward('/order');
  }
}
