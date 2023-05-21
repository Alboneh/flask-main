import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { ModalDismissReasons, NgbModal,NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


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
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss']
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

  public selectedFilter : number = 3 ;

  public previousFilter : number

  public chart: Chart;

  public detailData : any[];

  closeResult: string;

  constructor(private http: HttpClient, private formBuilder: UntypedFormBuilder, private modalService: NgbModal) {
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

  load(){
    this.http.get<ResponseAPi>(`${this.apiUrl}/predict`, { headers: this.headers }).subscribe(
      (response : ResponseAPi) => {
        this.data = response.data;

        // Call the method to generate the chart
        if (this.previousFilter != this.selectedFilter) {
          this.generateChart(this.selectedFilter);
        }
    });
  }

  getForecastSum(item: Data): number {
    return item.predictions.reduce((sum, prediction) => sum + prediction.forecast, 0);
  }

  // checkFile(){
  //   this.http.get<CheckFile>(`${this.apiUrl}/check`, { headers: this.headers }).subscribe((res : CheckFile) => {
  //     if (res.success) {
  //       this.load();
  //       this.displayFile = true;
  //     }
  //   }) 
  // }

  // toggleFormVisibility() {
  //   this.displayFile = !this.displayFile;
  // }

  // uploadFile(event: any): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   const file: File | null = fileInput.files?.[0] || null;
  //   const formData: FormData = new FormData();
    
  //   if (file) {
  //     formData.append('file', file);

  //     const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        
    
  //     const options = { headers: headers };

  //     this.http.post(`${this.apiUrl}/upload`, formData , options).subscribe(
  //       (response: any) => {
  //         // Handle the response
  //         window.location.reload();
  //       },
  //       (error: any) => {
  //         // Handle the error
  //         console.error(error);
  //       }
  //     );
  //   }else {
  //     console.log("NO file Selected")
  //   }
  // }

  
  generateChart(filterValue: number): void {
    const supplyCanvas = document.getElementById('supplyChart') as HTMLCanvasElement;
    const ctx = supplyCanvas.getContext('2d');
    
    const filteredData = this.data.map(item => ({
      product_name: item.product_name,
      predictions: item.predictions.slice(0, filterValue).filter(prediction => {
        const predictionDate = new Date(prediction.date);
        return predictionDate
      }),
    }));
  
    const labels = filteredData[0].predictions.map(prediction => prediction.date);
    const forecastData = filteredData.map((item, index) => ({
      label: item.product_name,
      data: item.predictions.map(prediction => prediction.forecast),
      fill: false,
      borderColor: this.getRandomColor(),
      backgroundColor: this.getRandomColor(),
      pointBorderColor: this.getRandomColor(),
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    }));
  
    const supplyData = {
      labels: labels,
      datasets: forecastData,
    };
  
    const chartOptions = {
      legend: {
        display: true,
        position: 'bottom',
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Customize the step size for y-axis labels
          },
        },
      },
    };
  
    if (this.chart) {
      // If the chart already exists, update its data and options
      this.chart.data = supplyData;
      this.chart.options = chartOptions;
      this.chart.update();
    } else {
      // Create a new chart instance if it doesn't exist
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: supplyData,
        options: chartOptions,
      });
    }

    this.previousFilter = filterValue
  }
  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  closeOverlay(): void {
    this.detailData = null;
  }

  open(content , item: any) {
    console.log(content);
    this.detailData = item;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-detail',
     backdrop: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

    ngOnInit(){
      this.load();
    }
}
