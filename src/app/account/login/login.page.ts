import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IonContent,IonInput, IonIcon, IonButton, NavController, MenuController, LoadingController } from '@ionic/angular/standalone';
import { ServerService } from '../../service/server.service';
import { EventsService } from '../../service/events.service';
import { LoginRequest } from 'src/app/service/interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  IonContent, IonInput, IonButton, IonIcon]
})
export class LoginPage implements OnInit {


  email = "";
  password = "";

  constructor(
    public server: ServerService,
    private nav: NavController,
    public menu: MenuController,
    public loadingController: LoadingController,
    public events: EventsService) {
    this.menu.enable(false);
  }

  ngOnInit() {
  }

  async login(data: LoginRequest) {
    const loading = await this.loadingController.create({
      message: 'Porfavor espere...',
    });
    await loading.present();

    console.log(data);

    this.server.login(data).subscribe((response: any) => {
      console.log(response);
      if (response.msg != "done") {
        this.server.presentToast({ text: response.msg, color: "danger",position:"top" });
      }
      else {
        this.server.presentToast({ text: "Bienvenido(a) de nuevo", color: "success",position:"top" });
        localStorage.setItem('user_id', response.user_id);
        this.events.publish('user_login', response.user_id);
        this.nav.navigateRoot('home');
      }

      loading.dismiss();

    });
  }

  register() {
    this.nav.navigateForward('signup');
  }

}

