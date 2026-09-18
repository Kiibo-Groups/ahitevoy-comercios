import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventsService } from '../service/events.service';
import { ServerService } from '../service/server.service';
import { interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  IonContent, Platform,
  IonIcon,
  IonButton,
  IonMenuButton,
  AlertController,
  NavController,
  MenuController,
  LoadingController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonCard,
  IonSegmentButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonRow,
  IonCol,
  IonBadge,
  IonLabel,
  IonCardTitle,
  IonFab,
  IonFabButton,
  IonGrid,
  IonSegment,
  IonSegmentView,
  IonSegmentContent
} from '@ionic/angular/standalone';

// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSegment, IonSegmentView,
    IonSegmentContent, IonLabel, IonBadge, IonCol, IonRow, IonCardContent, IonSegmentButton, IonCard, IonButtons, IonTitle, IonToolbar, IonHeader, CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonButton,
    IonMenuButton,
    IonIcon,
    IonFabButton
  ]

})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('swiperContainerNews') swiperContainerNews!: ElementRef;
  @ViewChild('swiperContainerInRoute') swiperContainerInRoute!: ElementRef;
  private swiperInstanceNews: any = null;
  private swiperInstanceInRoute: any = null;

  data: any;
  text: any;
  store: any;
  complete: any;
  pet: number = 1;
  segmentValue: string = "nuevos";
  pedidosNuevos: any;
  pedidosEnCurso: any;
  overview: any;
  count_orders: any = 0;
  timeLoadData: any;
  order_news: Array<any> = [];
  order_inrute: Array<any> = [];
  serviceComm = [];
  constructor(
    public alertController: AlertController,
    public server: ServerService,
    public platform: Platform,
    private nav: NavController,
    public menu: MenuController,
    public events: EventsService,
    public loadingController: LoadingController) {
  }

  ngOnInit() {
  }

  private initSwiper() {
    if (!this.swiperContainerNews) return;

    try {
      console.log("Inicializamos Swiper para news")
      this.swiperInstanceNews = new Swiper(this.swiperContainerNews.nativeElement, {
        modules: [Navigation, Pagination],
        speed: 400,
        spaceBetween: 100,
        simulateTouch: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    } catch (error) {
      console.error('Error inicializando Swiper:', error);
    }

    if (!this.swiperContainerInRoute) return;

    try {
      console.log("Inicializamos swiper para InRoute")
      this.swiperInstanceInRoute = new Swiper(this.swiperContainerInRoute.nativeElement, {
        modules: [Navigation, Pagination],
        speed: 400,
        spaceBetween: 100,
        simulateTouch: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    } catch (error) {
      console.error('Error inicializando Swiper:', error);
    }

  }

  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.menu.enable(true);


      if (localStorage.getItem('app_text') && localStorage.getItem('app_text') != undefined) {
        const appText = localStorage.getItem('app_text');
        this.text = appText ? JSON.parse(appText) : null;
      }

      this.loadData();
      this.chkEvents_comm();
    });
  }



  ionViewWillEnter() {
    this.loadData();
    // Inicializa Swiper después de que la vista esté lista
    this.initSwiper();
    this.timeLoadData = interval(2000).subscribe(() => {
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

    if (this.swiperInstanceNews) {
      try {
        this.swiperInstanceNews.destroy();
        this.swiperInstanceNews = null;
      } catch (error) {
        console.error('Error destruyendo Swiper:', error);
      }
    }

    if (this.swiperInstanceInRoute) {
      try {
        this.swiperInstanceInRoute.destroy();
        this.swiperInstanceInRoute = null;
      } catch (error) {
        console.error('Error destruyendo Swiper:', error);
      }
    }
  }

  async reCharge() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.loadData();
    loading.dismiss();
  }

  private hasDataChanged(newData: any[]): boolean {
    if (!this.data) return true;
    if (this.data.length !== newData.length) return true;

    // Compara los IDs o algún identificador único
    return newData.some((item, index) =>
      item.id !== this.data[index].id ||
      item.status !== this.data[index].status
    );
  }

  async loadData() {
    this.server.homepage(localStorage.getItem('user_id') || '', 0).subscribe((response: any) => {
      this.count_orders = response.data.length;

      if (response.data && response.data.length > 0) {
        if (this.hasDataChanged(response.data)) {
          console.log("Actualizando datos...");
          this.data = response.data;
          this.PrepareOrders(this.data);

          // Solo actualizamos Swiper si ya está inicializado
          if (this.swiperInstanceNews) {
            try {
              this.swiperInstanceNews.destroy();
              this.swiperInstanceNews = null;
            } catch (error) {
              console.error('Error destruyendo Swiper:', error);
            }
          }

          if (this.swiperInstanceInRoute) {
            try {
              this.swiperInstanceInRoute.destroy();
              this.swiperInstanceInRoute = null;
            } catch (error) {
              console.error('Error destruyendo Swiper:', error);
            }
          }



          this.initSwiper();
        }
      } else {
        this.data = [];
      }


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
      this.events.publish('admin', response.admin);
    });

    // Obtenemos estadisticas de ganancias y pedidos...
    this.server.overview(localStorage.getItem('user_id')).subscribe((data: any) => {
      this.overview = data.data;
    });
  }

  PrepareOrders(data: Array<any>) {
    console.log("Data principal : ", data)
    this.order_news = [];
    this.order_inrute = [];


    data.forEach((ev) => {
      console.log(ev.status)
      if (ev.status == 0) {
        this.order_news.push(ev);
      } else {
        if(ev.status != 5) {
          this.order_inrute.push(ev);
        }
      }
    });


    console.log("Pedidos nuevos...", this.order_news);
    console.log("Pedidos en ruta", this.order_inrute);
  }

  detail(odata: []) {
    localStorage.setItem('odata', JSON.stringify(odata));
    this.nav.navigateForward('/detail');
  }

  chkEvents_comm() {
    console.log("Verificamos lo servicios activos")
    this.server.chkEvents_comm(localStorage.getItem('user_id')).subscribe((data: any) => {
      console.log(data)
      this.serviceComm = data.data;
    });
  }

  viewListFinish() {
    this.nav.navigateForward('/order');
  }
}
