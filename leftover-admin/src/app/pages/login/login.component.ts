import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { Router  } from '@angular/router';
import { LoginserviceService } from '../service/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formGroup: UntypedFormGroup;

  constructor(private http: HttpClient , private router: Router,  private formBuilder: UntypedFormBuilder, private loginService: LoginserviceService) {
    this.formGroup = this.formBuilder.group({
      name: [null],
      password: [null],
    });
  }

  ngOnInit(): void {}

  loginAction(event: Event): void {
    event.preventDefault();
    let name = this.formGroup.get('name')?.value;
    console.log(name);
    let password = this.formGroup.get('password')?.value;
    this.loginService.login(name, password).subscribe(
      res => {
        this.loginService.handleLoginResponse(res);
      },
    );
  }

  get form() {
    return this.formGroup.controls
  }

}
