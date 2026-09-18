import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { IonApp, IonSplitPane, IonMenu, IonHeader, IonButton, IonContent, IonList, IonListHeader, IonMenuToggle, IonIcon, IonLabel, IonItem, IonRouterOutlet, MenuController, NavController } from '@ionic/angular/standalone';

// core version + navigation, pagination modules:
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonContent,IonButton, CommonModule, FormsModule]

})
export class OnboardingPage implements OnInit {

  slides = [
    {
      image: 'assets/onboarding1.png',
      title: 'Bienvenido(a) al negocio',
      description: 'Administra tu restaurante de forma inteligente y desde cualquier lugar.',
      last: false
    },
    {
      image: 'assets/onboarding2.png',
      title: 'Gestióna tus pedidos en tiempo real',
      description: 'Visualiza, acepta y organiza cada pedido que entra en tu negocio.',
      last: false
    },
    {
      image: 'assets/onboarding3.png',
      title: 'Crece tu negocio',
      description: 'Accede a reportes de ventas, estadísticas y herramientas para hacer crecer tu restaurante.',
      last: true
    }
  ];
  constructor(
    public platform: Platform,
    public menu: MenuController,
    public nav: NavController,
    public swiper : Swiper
  ) { }

  ngOnInit() {
  }

  
  ngAfterViewInit() {
    this.platform.ready().then(() => {
      this.menu.enable(false);
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

      const ViewOnboarding = localStorage.getItem('viewOnboarding');
      if(ViewOnboarding) this.nav.navigateRoot('login');
    });
  }

  GoToLogin()
  {
    localStorage.setItem('viewOnboarding', 'true');
    this.nav.navigateRoot('login');
  }

}
