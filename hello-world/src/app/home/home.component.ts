import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { LoginserviceService } from '../login/service/loginservice.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
  load(){
    this.http.get<ResponseAPi>(`${this.apiUrl}/predict`, { headers: this.headers }).subscribe(
      (response : ResponseAPi) => {
        this.data = response.data;
    });
  }

  getForecastSum(item: Data): number {
    return item.predictions.reduce((sum, prediction) => sum + prediction.forecast, 0);
  }

  checkFile(){
    this.http.get<CheckFile>(`${this.apiUrl}/check`, { headers: this.headers }).subscribe((res : CheckFile) => {
      if (res.success) {
        this.load();
        this.displayFile = true;
      }
    }) 
  }

  toggleFormVisibility() {
    this.displayFile = !this.displayFile;
  }

  uploadFile(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    const file: File | null = fileInput.files?.[0] || null;
    const formData: FormData = new FormData();
    
    if (file) {
      formData.append('file', file);

      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        
    
      const options = { headers: headers };

      this.http.post(`${this.apiUrl}/upload`, formData , options).subscribe(
        (response: any) => {
          // Handle the response
          window.location.reload();
        },
        (error: any) => {
          // Handle the error
          console.error(error);
        }
      );
    }else {
      console.log("NO file Selected")
    }
  }

  ngOnInit(): void {
    this.checkFile();
  }

}
