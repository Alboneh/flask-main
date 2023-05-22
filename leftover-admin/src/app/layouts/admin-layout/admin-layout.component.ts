import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/shared/loading/loading.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }
}