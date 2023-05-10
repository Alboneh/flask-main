import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import { HttpHeaders } from '@angular/common/http';
import { ColDef, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  public apiUrl = 'http://localhost:3030';
  private gridApi!: GridApi;
  public columnDefs: ColDef[];
  public rowData: any[];

  public token: string | null;
  public headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Name', field: 'name' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Password', field: 'password' }
    ];
    this.rowData = [];

    this.token = localStorage.getItem('access_token');
    this.headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  reload() {
    this.http.get<any>(`${this.apiUrl}/users`, { headers: this.headers }).subscribe(
      (response) => {
        this.rowData = response;
      }
    );
  }

  ngOnInit(): void {
    this.reload();
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
  }
}