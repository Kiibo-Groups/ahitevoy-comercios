
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { EventsService } from './service/events.service';
import { ServerService } from './service/server.service';
import { Platform, NavController, MenuController, LoadingController } from '@ionic/angular';
import { IonApp,IonSplitPane, IonMenu, IonHeader, IonContent,IonList,IonListHeader, IonMenuToggle, IonIcon,IonLabel, IonItem, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import OneSignal from 'onesignal-cordova-plugin';
import { StatusBar, Style } from '@capacitor/status-bar'; 
@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp,IonSplitPane,IonMenu,IonHeader,IonContent,IonList,IonListHeader,IonMenuToggle,IonIcon,IonLabel,IonItem,IonRouterOutlet, CommonModule, FormsModule, RouterModule]
})
export class AppComponent {

  appType: number = 0;
  dir: string = "ltr";
  text: any;
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

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Solo inicializa OneSignal si Cordova está disponible
      if ((window as any).cordova) {
        // this.statusBar.styleDefault();
        SplashScreen.hide();
        StatusBar.setBackgroundColor({color: '#33000000'});
        this.subPush();
      } else {
        console.warn('Cordova no está disponible. OneSignal solo funciona en dispositivo/emulador.');
      }
    });

  }

  assginAppType(ty:number)
  {
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

  async storeOpen(type: number)
  {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.storeOpen(type+"?user_id="+localStorage.getItem('user_id')).subscribe((response:any) => {
      loading.dismiss();
      if (response.data == 'error') {
        this.server.presentToast({text:"Ha ocurrido un problema por favor, intente de nuevo mas tarde",color:"danger", position:"top"});
      }
    });
  }

  logout()
  {
    this.storeOpen(0);
    localStorage.setItem('user_id','null');
    localStorage.removeItem('user_id');
    this.menu.close();
    this.nav.navigateRoot('login');
  }
}
