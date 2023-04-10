import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup , Validators } from '@angular/forms';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public token: any;
  form: FormGroup;
  constructor(public fb: FormBuilder,private http: HttpClient , private router: Router) {
    this.form = fb.group({
      name: '',
      password: ''
    });
   }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(''),
      password: new FormControl(''),
    });
  }

  submit(){
    const headers = { 'Content-Type': 'application/json'};
    const body = { name: this.form.value.name, password: this.form.value.password };
    this.http.post('http://localhost:3030/login',body,{headers}).subscribe((response : any) => {
      this.token = response['access_token']
      if(this.token != "" || this.token != undefined) {
        this.router.navigate(['home']);
      }
    });
  }

  gettoken(){
    return this.token
  }

}
