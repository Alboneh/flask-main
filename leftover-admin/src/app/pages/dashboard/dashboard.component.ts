import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { LoginserviceService } from '../service/loginservice.service';
import { Router } from '@angular/router';


interface Prediction {
  date: string;
  forecast: number;
  real: string;
}

interface Data {
  predictions: Prediction[];
  product_name: string;
}

interface ResponseAPi {
  data: Data[];
  success: string;
}

interface CheckFile {
  success : boolean;
  message : string;
}

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  public canvas : any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;

  public data :any[] = [];
  public apiUrl = 'http://localhost:3030';
  public displayFile : boolean;
  public token : string | null;
  public headers : HttpHeaders;
  public formGroup: UntypedFormGroup;

  constructor(private http: HttpClient, private loginService: LoginserviceService , private router: Router,  private formBuilder: UntypedFormBuilder) {
    if (!this.loginService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.displayFile = false;
    this.token = localStorage.getItem('access_token');
    this.headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    this.formGroup = this.formBuilder.group({
      file: [null],
    });
  }

    ngOnInit(){
      this.chartColor = "#FFFFFF";

      var supplyCanvas = document.getElementById("supplyChart");

      var forecastData = {
        data: [0, 1, 1, 0], // Replace with your forecast data
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };
      
      var supplyData = {
        labels: ["2023/05/14", "2023/05/15", "2023/05/16", "2023/05/17"], // Replace with your date labels
        datasets: [forecastData]
      };
      
      var chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };
      
      var lineChart = new Chart(supplyCanvas, {
        type: 'line',
        hover: false,
        data: supplyData,
        options: chartOptions
      });
    }
}
