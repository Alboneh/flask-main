import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup , Validators } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  constructor(public fb: FormBuilder,private http: HttpClient, private login: LoginComponent , private router: Router) {
    this.form = fb.group({
      inputBookTitle: '',
      editidbuku: '',
      editjudulbuku: ''
    });
    console.log(this.login.gettoken())
    this.checklogin()
    this.load()
  }
  checklogin(){
    if (this.login.token == "" || this.login.token == undefined) {
      this.router.navigate(['login']);
    }
    
  }   
  submit(){
    const formData = new FormData();
    // formData.append('file', this.myForm.get('fileSource'));
   
    this.http.post('http://localhost:8001/upload.php', formData)
      .subscribe(res => {
        console.log(res);
        alert('Uploaded Successfully.');
      })
  }

  data :any[] = []
  load(){
    console.log(this.login.token)
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.login.token}`
    })
    this.http.get('http://localhost/api/predict', { headers: headers }).subscribe((response : any) => {
     this.data = response;
     console.log(response);
    });
  }
  addData(){
    const headers = { 'Content-Type': 'application/json'};
    const body = { item: this.form.value.inputBookTitle };
    this.http.post('https://192.53.116.40/api/',body,{headers}).subscribe((response) => {
      alert(response);
      this.load()
    });
  }
  editData(){
    const id = {params: new HttpParams().set('id', this.form.value.editidbuku)}
    const body = { item: this.form.value.editjudulbuku };
    this.http.put('https://192.53.116.40/api/update',body,id).subscribe((response) => {
      alert(response);
      this.load()
    });
  }
  deleteData(data : any){
    const id = {params: new HttpParams().set('id', data)}
    this.http.delete('https://192.53.116.40/api/delete',id).subscribe((response) => {
      alert(response);
      this.load()
    });
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      inputBookTitle: new FormControl(''),
      editjudulbuku: new FormControl(''),
      editidbuku: new FormControl(''),
    });
  }

}
