import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { IonContent,IonInput, IonIcon, IonButton, NavController, MenuController, LoadingController } from '@ionic/angular/standalone';
import { ServerService } from '../../service/server.service';
import { EventsService } from '../../service/events.service';
import { SignupRequest } from 'src/app/service/interfaces';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonInput, IonButton, IonContent, CommonModule, FormsModule]
})
export class SignupPage implements OnInit {

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

  async signup(data: SignupRequest) {
    const loading = await this.loadingController.create({
      message: 'Creando cuenta, Porfavor espere...',
    });
    await loading.present();

    this.server.signup(data).subscribe((response: any) => {
      console.log(response);
      if (response.msg != "done") {
        this.server.presentToast({ text: response.error, color: "danger",position:"top" });
      }
      else {
        this.server.presentToast({ text: "En Espera de revisión...", color: "warning",position:"top" });
        this.nav.navigateBack('login');
      }

      loading.dismiss();

    });
  }

  login(){
    this.nav.navigateBack('login');
  }

}
