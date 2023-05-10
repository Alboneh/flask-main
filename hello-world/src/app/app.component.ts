import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hello-world';

  constructor(private router: Router) {}

  logout(): void {
    // Remove the local token
    localStorage.removeItem('access_token');

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
