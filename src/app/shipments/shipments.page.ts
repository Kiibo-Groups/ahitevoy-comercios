import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServerService } from '../service/server.service';
import { Geolocation } from '@capacitor/geolocation';
import { SetaddressPage } from './setaddress/setaddress.page';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonList,
  IonCard,
  IonListHeader,
  IonItem,
  IonAvatar,
  IonLabel,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonButton,
  IonFooter,
  AlertController,
  NavController,
  LoadingController,
  ModalController,
  ToastController,
  IonItemOption,
  IonCardTitle,
  IonSkeletonText,
  IonItemSliding,
  IonItemOptions,
  IonSpinner,
  IonRow,
  IonCol,
  IonCardContent,
  IonTextarea,
  IonInput
} from '@ionic/angular/standalone';

declare var google: any;

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.page.html',
  styleUrls: ['./shipments.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonButtons,
    IonList,
    IonCard,
    IonListHeader,
    IonItem,
    IonAvatar,
    IonLabel,
    IonCardHeader,
    IonCardSubtitle,
    IonIcon,
    IonButton,
    IonFooter,
    IonItemOption,
    IonCardTitle,
    IonSkeletonText,
    IonItemSliding,
    IonItemOptions,
    IonSpinner,
    IonRow,
    IonCol,
    IonCardContent,
    IonTextarea,
    IonInput
  ]


})
export class ShipmentsPage implements OnInit {

  @ViewChild("searchad", { static: false }) 'searchad': IonSearchbar;

  store_data: any;
  title_text!: string;
  resumen_text: string = "Resumen de tu servicio";
  resumen_subtext: string = "Envia y recibe lo que necesites, Si cabe en nuestra maleta, te lo llevamos...";
  user: any;
  admin: any;
  data: any;
  searchQuery: any;
  hasSearch: any;
  address: any;
  set_type_address: any;
  address_origin: any;
  lat_orig: any;
  lng_orig: any;
  address_destin: any;
  lat_dest: any;
  lng_dest: any;
  LocationNow: any;
  GoogleAutocomplete: any;
  // autocomplete!: { input: string; };
  autocomplete = {
    input: 'ingresa un valor'
  };
  autocompleteItems!: any[];
  lat: any;
  lng: any;
  MyLocation = new Array();

  step_comm: number = 0;
  text_address: String = "Punto de recolección";

  first_instr: String = "";
  second_instr: String = "";
  name_client: String = "";
  phone_client: String = "";
  cost_order: String  = "";
  pay_client:String = "";

  ready: Boolean = false;
  store_id: any;
  chargeInProcess: boolean = false;
  
  cost_ship: any;
  total_amount:any;
  constructor(
    public modalController: ModalController,
    public nav: NavController,
    public server: ServerService,
    public zone: NgZone,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) { }


  ngOnInit() {
  }

  ionViewWillEnter() {
    this.store_id = localStorage.getItem('store_id');
    const store_data = localStorage.getItem('store_data');
    this.store_data = store_data ? JSON.parse(store_data) : null;
    const admin = localStorage.getItem('admin');
    this.admin = admin ? JSON.parse(admin) : null;

    this.autocomplete = { input: '' };
    this.searchQuery = null;
    this.hasSearch = false;
    this.autocompleteItems = [];
    this.title_text = "Solicita tu servicio personalizado";
    this.loadData();

    this.address_origin = this.store_data.address;
    this.chargeMap(this.address_origin, 'address_origin');
  }

  loadData() {
    // Obtenemos la ubicación actual

    Geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log("Errir => ", error);
    });
  }

  /**
   * Obtenemos Direccion en base a coordenadas
   * @param lattitude 
   * @param longitude 
   */
  getAddressFromCoords(lattitude: any, longitude: any) {
    this.server.GeocodeFromCoords(lattitude, longitude, this.admin.ApiKey_google).subscribe((data: any) => {
      let formatted_address = data.results[0].formatted_address;
      this.LocationNow = formatted_address;
      this.MyLocation.push({
        "lat": data.results[0].geometry.location.lat,
        "lng": data.results[0].geometry.location.lng,
        "address": this.LocationNow
      });

      console.log(this.MyLocation)
    });
  }

  /**
   * Funcion para busqueda de elemento
   * @param ev 
   * @returns 
   */
  search(ev: any) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    var val = ev.target.value;
    if (val && val.length > 0) {
      this.data = null;
      this.hasSearch = val;
      if (this.autocomplete.input == '') {
        this.autocompleteItems = [];
        return;
      }
      this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, location: new google.maps.LatLng(this.lat, this.lng), radius: 10 },
        (predictions: any, status: any) => {
          this.autocompleteItems = [];
          this.zone.run(() => {
            predictions.forEach((prediction: any) => {
              this.autocompleteItems.push(prediction);
            });
          });
        });
    }
    else {
      this.ngOnInit();
      this.hasSearch = false;
    }
  }

  SelectSearchResult(item: any) {
    if (this.set_type_address == 'origin') {
      this.address_origin = item.description;
      this.step_comm = 2;
    } else {
      this.address_destin = item.description;
      this.step_comm = 3;
    }

    this.server.GeocodeFromPlace(item.place_id, this.admin.ApiKey_google).subscribe((data: any) => {
      if (data.status != 'ZERO_RESULTS') {
        if (this.set_type_address == 'origin') {
          this.lat_orig = data.results[0].geometry.location.lat;
          this.lng_orig = data.results[0].geometry.location.lng;
        } else {
          this.lat_dest = data.results[0].geometry.location.lat;
          this.lng_dest = data.results[0].geometry.location.lng;
        }
      } else {
        this.server.presentToast({ text: "No se encontraro resultado de busqueda", color: 'danger', position: "top" });
        this.step_comm = 1;
      }
    });
  }

  async saveAddress(item: any) {
    if (this.set_type_address == 'origin') {
      this.address_origin = item.address;
      this.step_comm = 2;
      this.chargeMap(this.address_origin, 'address_origin');
    } else {
      this.address_destin = item.address;
      this.step_comm = 3;
      this.chargeMap(this.address_destin, 'address_destin');
    }
  }

  next_step(step: any) {

    if (step == 'back') {
      this.step_comm = 0;
    }

    if (step == "add_origin") {
      this.step_comm = 1;
      this.set_type_address = "origin";
      this.text_address = "Punto de recolección";
      this.clearSearch();

      setTimeout(() => {
        this.searchad.setFocus();
      }, 400);
    } else if (step == "add_destin") {
      this.set_type_address = "destination";
      this.text_address = "Punto de entrega";
      this.step_comm = 1;
      this.clearSearch();
      setTimeout(() => {
        this.searchad.setFocus();
      }, 400);

    } else if (step == 'ready') {
      if (
        !this.name_client ||
        !this.phone_client ||
        !this.cost_order ||
        !this.pay_client
      ) {
        this.server.presentToast({
          text: "Por favor completa todos los campos obligatorios.",
          color: "warning",
          position: "top"
        });
        this.step_comm = 3;
        return;
      }


      // Verificamos que existan ambas direcciones
      if (!this.address_destin) {
        this.server.presentToast({ text: "Agrega un destino para tu servicio", color: "warning", position: "top" });
        this.next_step("add_destin");
      } else if (!this.address_origin) {
        this.server.presentToast({ text: "Agrega un punto de partida para tu servicio", color: "warning", position: "top" });
        this.next_step("add_origin")
      } else {
        this.step_comm = 0;
        // this.ready = true;
        // Todo Listo
        setTimeout(() => {
          // Cargamos costos de envio
          this.ViewCostShipCommanded();
        }, 500);
      }
    }
  }

  next_step_btn(step: any) {
    if (step == "add_origin") {
      this.set_type_address = "origin";
      this.text_address = "Punto de recolección";
    } else if (step == "add_destin") {
      this.set_type_address = "destination";
      this.text_address = "Punto de entrega";
    }

    this.step_comm = 1;
    this.clearSearch();
    setTimeout(() => {
      this.searchad.setFocus();
    }, 400);
  }

  chargeMap(address: any, type: any) {
    // Obtenemos las coordenadas de la direccion de recoleccion
    this.server.GeocodeFromAddress(address, this.admin.ApiKey_google).subscribe((data: any) => {
      if (data.status != 'ZERO_RESULTS') {
        if (type == 'address_origin') {
          this.lat_orig = data.results[0].geometry.location.lat;
          this.lng_orig = data.results[0].geometry.location.lng;
        } else {
          this.lat_dest = data.results[0].geometry.location.lat;
          this.lng_dest = data.results[0].geometry.location.lng;
        }
      } else {
        this.server.presentToast({ text: "No se encontraro resultado de busqueda", color: 'danger', position: "top" });
        this.step_comm = 1;
      }
    });
  }

  async selectAddressMap() {
    const modal = await this.modalController.create({
      component: SetaddressPage,
      animated: true,
      mode: 'ios',
      cssClass: 'my-custom-class',
      backdropDismiss: false,
      showBackdrop: true,
    });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data.role == 'setAdd') {
        if (this.set_type_address == 'origin') {
          this.address_origin = data.data;
          this.step_comm = 2;
          this.chargeMap(this.address_origin, 'address_origin');
        } else {
          this.address_destin = data.data;
          this.step_comm = 3;
          this.chargeMap(this.address_destin, 'address_destin');
        }
      } else {
        this.step_comm = 1;
      }
    });

    return await modal.present();
  }

  /**
   * Cotizamos el servicio
   */
  async ViewCostShipCommanded() {
    const loading = await this.loadingController.create({
      message: "Calculando rutas....",
      mode: 'ios'
    });
    await loading.present();

    let allData = {
      lat_orig: this.lat_orig,
      lng_orig: this.lng_orig,
      lat_dest: this.lat_dest,
      lng_dest: this.lng_dest, 
      store_id: this.store_id
    }

    console.log('Data a enviar: ', allData)

    this.server.ViewCostShipCommanded(allData).subscribe((data: any) => {
      loading.dismiss();
      console.log(data);
      if (data.data.service == 1) {
        this.ready = true;
        this.cost_ship = data.data;
        // console.log(data.data.costs_ship, data.data.service_fee, Number(this.shipping_insurance));
        this.total_amount = (data.data.costs_ship + data.data.service_fee);
      } else {
        this.server.presentToast({text: "No se ha podido calcular los cargos de envio", color : 'danger', position:"top"});
      }
    });
  }

  /**
   * Retrocedemos
   */
  closeComm() {
    this.nav.navigateRoot('/home');
  }

  /**
   * Limpiamos
   */
  clearSearch() {
    this.searchQuery = null;
    this.hasSearch = false;
    this.autocompleteItems = [];
    this.autocomplete = { input: '' };
  }

  /**
   * Creacion del pedido
   */
  async makeOrder() {
    const loading = await this.loadingController.create({
      mode: 'ios'
    });
    await loading.present();

    let allData = {
      address_origin: this.address_origin,
      lat_orig: this.lat_orig,
      lng_orig: this.lng_orig,
      address_destin: this.address_destin,
      lat_dest: this.lat_dest,
      lng_dest: this.lng_dest,
      first_instr: this.first_instr,
      second_instr: this.second_instr,
      user_id: null,
      store_id: this.store_id,
      price_comm: 0,
      payment_id: null,
      d_charges: this.cost_ship['costs_ship'],
      payment_method: 1,
      propina: 0,
      add_cash: 0,
      total: this.total_amount,
      declared_value:0,
      shipping_insurance: 0,

      // New Data
      name_client : this.name_client,
      phone_client : this.phone_client,
      cost_order : this.cost_order,
      pay_client : this.pay_client
    }

    this.server.OrderComm(allData).subscribe((data: any) => {
      loading.dismiss();
      
      if (data.data == 'done') {
        this.server.presentToast({ text: "La solicitud ha sido enviada.", color: "success", position: "top" });
      } else {
        this.server.presentToast({ text: "Ha ocurrido un problema, por favor intente mas tarde.", color: "danger", position: "top" });
      }
      this.nav.navigateForward('/done-comm');
    });
  }

}
