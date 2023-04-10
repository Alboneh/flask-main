import { Component,ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import {
  ColDef,
  GridReadyEvent,
  IServerSideDatasource,
  IServerSideGetRowsRequest,
  RowModelType,
  GridApi
} from 'ag-grid-community';
import {interData} from './interface'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements OnInit {
  public genderFilter:any;
  public universityFilter:any;
  private gridApi!: GridApi;


  constructor(private http: HttpClient) {

  }
  // For accessing the Grid's API
  @ViewChild('serverside') agGrid!: AgGridAngular;

public columnDefs: ColDef[] = [
  { field: 'Id', filter: 'agNumberColumnFilter'},
  { field: 'First_name', filter: 'agTextColumnFilter'},
  { field: 'Last_name',filter: 'agTextColumnFilter' },
  { field: 'Email' ,filter: 'agTextColumnFilter'},
  { field: 'Gender' ,filter: 'agMultiColumnFilter', 
  filterParams: {
   filters: [
    {
      filter: 'agSetColumnFilter',
      filterParams: {
         // provide all days, even if days are missing in data!
    values: (params : any) => {
      setTimeout(() => {
                    // fetch values from server
                    const values = this.genderFilter;
                    // supply values to the set filter
        params.success(values);
      }, 200);
    },
      }
    },
    {
      filter: "agTextColumnFilter",
      floatingFilterComponent: "customTextFloatingFilter",
      display: "subMenu",
    },
   ]
  }},
  { field: 'Address' ,filter: 'agTextColumnFilter'},
  { field: 'University' ,filter: 'agTextColumnFilter'},
];

public defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: true,
};
public rowModelType: RowModelType = 'serverSide';
public rowData!: interData[];
  hallo(){
    this.http.get('https://192.53.116.40/api/serverside/filter1').subscribe((response : any) => {
      let obj = response;
      let myset = new Set();
      for (let i = 0; i < obj.length; i++) {
        myset.add(obj[i].Gender)
    }
    let array = Array.from(myset);
    this.genderFilter=array
    });
  }
  hallo2(){
    this.http.get('https://192.53.116.40/api/serverside/filter2').subscribe((response : any) => {
      let obj = response;
      let myset = new Set();
      for (let i = 0; i < obj.length; i++) {
        myset.add(obj[i].University)
    }
    let array = Array.from(myset);
    this.universityFilter = array;
    });
  }
   onGridReady(params: GridReadyEvent<interData>) {
    this.hallo();
    this.hallo2();
    params.api.sizeColumnsToFit({
      columnLimits: [{key: 'Id', maxWidth: 100},{key: 'University', minWidth: 400},{key: 'Gender', maxWidth: 200}],
    }); 
    this.gridApi = params.api;
    this.http
      .get<interData[]>(
        'https://192.53.116.40/api/serverside'
      )
      .subscribe((data) => {
        // setup the fake server with entire dataset
        var fakeServer = createFakeServer(data);
        // create datasource with a reference to the fake server
        var datasource = createServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setServerSideDatasource(datasource);
      });
  }

  ngOnInit(): void {
  }



  
}

function createServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      // get data for request from our fake server
      var response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(function () {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({ rowData: response.rows });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}
function createFakeServer(allData: any[]) {
  
  return {
    getData: (request: IServerSideGetRowsRequest) => {
      // take a copy of the data to return to the client
      var requestedRows = allData.slice();
      return {
        success: true,
        rows: requestedRows,
      };
    },
  };
}