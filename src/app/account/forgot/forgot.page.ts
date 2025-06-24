import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, LoadingController, NavController, IonInput } from '@ionic/angular/standalone';
import { ServerService } from '../../service/server.service';
import { EventsService } from '../../service/events.service';
import {
	ForgotRequest,
	UpdatePasswordRequest,
	VerifyRequest
} from '../../service/interfaces';


@Component({
	selector: 'app-forgot',
	templateUrl: './forgot.page.html',
	styleUrls: ['./forgot.page.scss'],
	standalone: true,
	imports: [IonInput, IonLabel, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, CommonModule, FormsModule]
})
export class ForgotPage implements OnInit {


	user_id: any;
	newPassword = false;
	email: any;
	text: any;
	constructor(
		public server: ServerService,
		private nav: NavController,
		public loadingController: LoadingController
	) {

		const appText = localStorage.getItem('app_text');
		this.text = appText ? JSON.parse(appText) : null;

	}

	ngOnInit() {
	}


	async forgot(data: ForgotRequest, type = "new") {
		if (type == "new" && data.email.length == 0) {
			this.server.presentToast({ text: 'Por favor introduzca su correo electrónico ', color: "warning", position: "bottom" });
		}
		else {
			const loading = await this.loadingController.create({
				mode: 'ios'
			});
			await loading.present();

			this.server.forgot(data).subscribe((response: any) => {

				if (response.msg == "error") {
					this.server.presentToast({ text: response.error, color: "danger", position: 'top' });
				}
				else {
					this.server.presentToast({ text: "OTP enviado con éxito en su correo electrónico ", color: "success", position: "top" });
					this.user_id = response.user_id;
					this.email = data.email;
				}

				loading.dismiss();

			});
		}
	}

	async verify(data: VerifyRequest) {
		if (data.otp.length == 0) {
			this.server.presentToast({ text: 'Ingrese su OTP ', color: "danger", position: 'top' });
		}
		else {
			const loading = await this.loadingController.create({
				duration: 3000,
				mode: 'ios'
			});
			await loading.present();

			var allData = { otp: data.otp, user_id: this.user_id }

			this.server.verify(allData).subscribe((response: any) => {

				if (response.msg == "error") {
					this.server.presentToast({ text: response.error, color: "danger", position: "top" });
				}
				else {
					this.user_id = response.user_id;
					this.newPassword = true;

					this.server.presentToast({ text: "Correo electrónico verificado correctamente.", color: "success", position: "top" });
				}

				loading.dismiss();

			});
		}
	}

	async new_password(data: UpdatePasswordRequest) {
		if (data.password.length == 0) {
			this.server.presentToast({ text: 'Por favor ingrese su nueva contraseña', color: "warning", position: "top" });
		}
		else if (data.password != data.new_password) {
			this.server.presentToast({ text: 'Confirme que la contraseña no coincide.', color: "warning", position: "top" });
		}
		else {
			const loading = await this.loadingController.create({
				duration: 3000,
				mode: 'ios'
			});
			await loading.present();

			var allData = { user_id: this.user_id, password: data.password, new_password: data.new_password }

			this.server.updatePassword(allData).subscribe((response: any) => {

				if (response.msg == "error") {
					this.server.presentToast({ text: response.error, color: "danger", position: "top" });
				}
				else {
					this.nav.navigateForward('/login');
					this.server.presentToast({ text: "Nueva contraseña actualizada correctamente.", color: "success", position: "top" });

				}

				loading.dismiss();

			});
		}
	}

	resend()
	{
		this.forgot({email : this.email});
	}
}
