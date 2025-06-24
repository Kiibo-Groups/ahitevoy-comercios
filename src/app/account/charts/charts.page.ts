import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsService } from '../../service/events.service';
import { ServerService } from '../../service/server.service';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonText, IonRow, IonCol, IonCardContent, LoadingController } from '@ionic/angular/standalone';


declare var Chart:any;

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCol, IonRow, IonText, IonCardSubtitle, IonCardHeader, IonCard, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChartsPage implements OnInit {

  @ViewChild('barChartDays', { static: false }) barChartDays!: ElementRef;
  @ViewChild('barChartMonths', { static: false }) barChartMonths!: ElementRef;
  barsMonth: any;
  barsDays: any;
  cargaCharts: boolean = false;
  ViewCharts: boolean = false;
  colorArray: any;

  overview: any;
  loading: any;
  constructor(
    public loadingController: LoadingController,
    public server: ServerService
  ) { }


  async ionViewWillEnter() {
    this.loading = await this.loadingController.create({
      message: 'Cargando Estadisticas...',
      mode: 'ios'
    });

    await this.loading.present();

    this.loading.dismiss();
    this.server.overview(localStorage.getItem('user_id')).subscribe((data: any) => {
      console.log(data);
      this.overview = data.data;
      this.createBarChart();
    });
  }

  ngOnInit() {
  }

  createBarChart() {
    if (!this.ViewCharts) {
      this.ViewCharts = true;
      setTimeout(() => {
        this.barsMonth = new Chart(this.barChartMonths.nativeElement, {
          type: 'bar',
          data: {
            labels: [this.overview.month.month_1, this.overview.month.month_2, this.overview.month.month_3],
            datasets: [
              {
                label: 'Pedidos Completos ' + this.overview.complete,
                data: [this.overview.complet.complet_1, this.overview.complet.complet_2, this.overview.complet.complet_3],
                backgroundColor: '#20c997', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                borderWidth: 1
              },
              {
                label: 'Pedidos Cancelados ' + this.overview.canceled,
                data: [this.overview.cancel.cancel_1, this.overview.cancel.cancel_2, this.overview.cancel.cancel_3],
                backgroundColor: '#19b5fe', // array should have same number of elements as number of dataset
                borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        this.barsDays = new Chart(this.barChartDays.nativeElement, {
          type: 'line',
          data: {
            labels: [this.overview.day_data.day_1.day, this.overview.day_data.day_2.day, this.overview.day_data.day_3.day],
            datasets: [
              {
                label: 'Pedidos Completos ',
                data: [this.overview.day_data.day_1.data.order, this.overview.day_data.day_2.data.order, this.overview.day_data.day_3.data.order],
                // backgroundColor: '#20c997', // array should have same number of elements as number of dataset
                borderColor: 'rgb(29, 216, 9)',// array should have same number of elements as number of dataset
                borderWidth: 1
              },
              {
                label: 'Pedidos Cancelados ',
                data: [this.overview.day_data.day_1.data.cancel, this.overview.day_data.day_2.data.cancel, this.overview.day_data.day_3.data.cancel],
                // backgroundColor: '#19b5fe', // array should have same number of elements as number of dataset
                borderColor: 'rgb(219, 16, 16)',// array should have same number of elements as number of dataset
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });

        if (this.barsMonth) {
          this.cargaCharts = true;
          this.loading.dismiss();
        }
      }, 800);
    } else {
      this.ViewCharts = false;
    }
  }

}
