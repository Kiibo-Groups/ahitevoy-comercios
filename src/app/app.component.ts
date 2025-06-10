import { Component } from '@angular/core';

import { Platform, NavController, Events, MenuController, LoadingController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx'; 
import { ServerService } from './service/server.service';


// import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  appType:number = 0;
  dir:string = "ltr";
  text:any;
  public appPages:any = [];

  geoLatitude = null;
  geoLongitude=null;

  store:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, 
    public nav : NavController,
    public menu: MenuController, 
    public events: Events,
    public server : ServerService,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {

    this.text = JSON.parse(localStorage.getItem('app_text'));
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
          icon: 'stats'
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

    if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null')
    {
      this.nav.navigateRoot('/home');
    }
    else
    {
      this.nav.navigateRoot('/login');
    }

    this.initializeApp();

    this.events.subscribe('user_login', (id) => {
      this.subPush(id);
    });

    this.events.subscribe('store_data', (user) => {
      this.store = user;
    });
  }

  assginAppType(ty)
  {
    this.dir = ty == 0 ? "ltr" : "rtl";
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#33000000');
      this.statusBar.styleLightContent();
      this.subPush();
    });

  }

  subPush(id = 0)
  {
    /*
    OneSignal.setAppId("c41d3e93-68e5-4b01-9dfd-eb898b272e5b");
    OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });

    if(localStorage.getItem('user_id') && localStorage.getItem('user_id') != 'null')
    {
      OneSignal.setExternalUserId(localStorage.getItem('user_id'));
      OneSignal.sendTags({store_id: localStorage.getItem('user_id')});
    }

    if(id > 0)
    {
      OneSignal.setExternalUserId(JSON.stringify(id));
      OneSignal.sendTags({store_id: id})
    }
      */
  }

  async storeOpen(type)
  {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    this.server.storeOpen(type+"?user_id="+localStorage.getItem('user_id')).subscribe((response:any) => {
      loading.dismiss();
      if (response.data == 'error') {
        this.presentToast("Ha ocurrido un problema por favor, intente de nuevo mas tarde","danger");
      }
    });
  }

  logout()
  {
    // this.storeOpen(0);
    localStorage.setItem('user_id',null);
    localStorage.removeItem('user_id');
    this.menu.close();
    this.nav.navigateRoot('login');
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
