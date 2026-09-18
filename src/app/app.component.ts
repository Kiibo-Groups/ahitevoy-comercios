import { Component, Renderer2, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { EventsService } from './service/events.service';
import { ServerService } from './service/server.service';
import { Platform, NavController, MenuController, LoadingController } from '@ionic/angular';
import { IonApp, IonSplitPane, IonMenu, IonHeader, IonContent, IonList, IonListHeader, IonMenuToggle, IonIcon, IonLabel, IonItem, IonRouterOutlet, IonFooter } from '@ionic/angular/standalone';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import OneSignal from 'onesignal-cordova-plugin';
import { StatusBar, Style } from '@capacitor/status-bar'; 
// import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonFooter, IonApp, IonSplitPane, IonMenu, IonHeader, IonContent, IonList, IonListHeader, IonMenuToggle, IonIcon, IonLabel, IonItem, IonRouterOutlet, CommonModule, FormsModule, RouterModule]
})
export class AppComponent {

  appType: number = 0;
  dir: string = "ltr";
  text: any;
  apiKey: any;
  public appPages: any = [
    {
      title: "Inicio",
      url: '/home',
      icon: 'home'
    },
    {
      title: "Estadisticas",
      url: '/charts',
      icon: 'stats-chart'
    },
    {
      title: "Historial",
      url: '/order',
      icon: 'cart'
    },
    {
      title: "Cuenta",
      url: '/profile',
      icon: 'person'
    },
    {
      title: "Menú",
      url: '/item',
      icon: 'bookmark'
    },
  ];

  geoLatitude = null;
  geoLongitude = null;

  store: any;

  constructor(
    private platform: Platform,
    public nav: NavController,
    public menu: MenuController,
    public events: EventsService,
    public server: ServerService,
    public loadingController: LoadingController,
    public renderer: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {

    const appText = localStorage.getItem('app_text');
    this.text = appText ? JSON.parse(appText) : {};

    this.events.subscribe('text', (text) => {
      this.text = text;
      this.appPages = [
        {
          title: text.home,
          url: '/home',
          icon: 'home'
        },
        {
          title: "Servicios",
          url: '/shipments',
          icon: 'rocket-sharp'
        },
        {
          title: "Estadisticas",
          url: '/charts',
          icon: 'stats-chart'
        },
        {
          title: "Historial",
          url: '/order',
          icon: 'cart'
        },
        {
          title: text.account,
          url: '/profile',
          icon: 'person'
        },
        {
          title: text.s_menu_title,
          url: '/item',
          icon: 'bookmark'
        },
      ];
    });

    if (localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null') {
      this.nav.navigateRoot('/home');
    }
    else {
      this.nav.navigateRoot('/onboarding');
    }

    this.initializeApp();

    this.events.subscribe('user_login', (id) => {
      this.subPush(id);
    });

    this.events.subscribe('store_data', (user) => {
      this.store = user;
    });

    this.events.subscribe('admin', (admin) => {
      localStorage.setItem('admin', JSON.stringify(admin));
    });

  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      // Solo inicializa OneSignal si Cordova está disponible
      if(localStorage.getItem('admin'))
      {
        const admin_data = localStorage.getItem('admin');
        let admin = admin_data ? JSON.parse(admin_data) : [];
        this.apiKey = admin.ApiKey_google;
        
        this.injectSDK().then((res) => {});
      }
      if (this.platform.is('android')) {
        // en Android es más sencillo dejar que el SO reserve espacio
        // await StatusBar.setOverlaysWebView({ overlay: false });
        // await StatusBar.setStyle({ style: Style.Dark });
      } else {
        // iOS: dejar overlay true y usar safe-area env()
        // await StatusBar.setOverlaysWebView({ overlay: true });
        // await StatusBar.setStyle({ style: Style.Dark });
      }

      // SplashScreen.hide();
      // this.subPush();
      
      // if ((window as any).cordova) {
      //   SplashScreen.hide();
      //   this.subPush();
      // } else {
      //   console.warn('Cordova no está disponible. OneSignal solo funciona en dispositivo/emulador.');
      // }
    });
  }


  assginAppType(ty: number) {
    this.dir = ty == 0 ? "ltr" : "rtl";
  }

  subPush(id = 0) {

    // Initialize with your OneSignal App ID
    OneSignal.initialize("c41d3e93-68e5-4b01-9dfd-eb898b272e5b");
    //  We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
    OneSignal.Notifications.requestPermission(false).then((accepted: boolean) => {
      console.log("User accepted notifications: " + accepted);
    });

    if (localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null') {
      OneSignal.login(JSON.stringify(localStorage.getItem('user_id')));
      OneSignal.User.addTag("store_id", JSON.stringify(localStorage.getItem('user_id')));
    }

    if (id > 0) {
      OneSignal.login(JSON.stringify(id));
      OneSignal.User.addTag("store_id", JSON.stringify(id));
    }
  }

  async storeOpen(type: number) {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.storeOpen(type + "?user_id=" + localStorage.getItem('user_id')).subscribe((response: any) => {
      loading.dismiss();
      if (response.data == 'error') {
        this.server.presentToast({ text: "Ha ocurrido un problema por favor, intente de nuevo mas tarde", color: "danger", position: "top" });
      }
    });
  }

   private injectSDK(): Promise<any> {

    return new Promise((resolve, reject) => {
        (window as any)['mapInit'] = () => {
          resolve(true);
        };

        let script = this.renderer.createElement('script');
        script.id = 'googleMaps';

        if(this.apiKey){
            script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit&libraries=places&key=' + this.apiKey;
        } else {
            script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit&libraries=places';       
        }

        this.renderer.appendChild(this._document.body, script);

    });
  }

  logout() {
    this.storeOpen(0);
    localStorage.setItem('user_id', 'null');
    localStorage.removeItem('user_id');
    this.menu.close();
    this.nav.navigateRoot('login');
  }
}
