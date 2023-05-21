import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { log } from 'console';


interface httpResp {
    success? : boolean;
    message? : string;
}

@Component({
  selector: 'app-csvdata',
  templateUrl: './csvdata.component.html',
  styleUrls: ['./csvdata.component.css']
})

export class CsvdataComponent implements OnInit {
  public apiUrl = 'http://localhost:3030';
  public gridApi: GridApi;
  public columnDefs: ColDef[];
  public defaultColDef : ColDef;
  public rowData: any[];

  public token: string | null;
  public headers: HttpHeaders;

  public selectedRowData: any;


  public dialogVisible: boolean;
  public dialogHeader: string;
  public formEditId: number;
  public formSubmitted: boolean;
  public formGroup: UntypedFormGroup;

  public productList : any[];


  public dialogMode: 'create' | 'detail' | 'edit';


  constructor(
        private http: HttpClient,
        private formBuilder: UntypedFormBuilder,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private datePipe: DatePipe,
      ){
    this.columnDefs = [
      { headerName: 'ID', field: 'id' , valueGetter: "node.rowIndex + 1" },
      { headerName: 'Name', field: 'product_name', filter: 'text' },
      { 
        headerName: 'Date',
        field: 'date',
        sort: 'desc' ,
        filter: 'date',     valueGetter: function (params) {
          const dateString = params.data.date;
          const parsedDate = dateString.split('-');
          const year = Number(parsedDate[2]);
          const month = Number(parsedDate[1]) - 1;
          const day = Number(parsedDate[0]);
          return new Date(year, month, day);
      },
      valueFormatter: function (params) {
        const date = params.value;
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
      }
     },
      { headerName: 'Count', field: 'count', filter: 'number' }
    ];
    this.token = localStorage.getItem('access_token');
    this.headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });

    this.defaultColDef = {
      sortable : true,
      filter: true,
    };


    this.productList = [
      { name: "beef" },
      { name: "berries" },
      { name: "brown bread" },
      { name: "chicken" },
      { name: "citrus fruit" },
      { name: "condensed milk" },
      { name: "fish" },
      { name: "fruit/vegetable juice" },
      { name: "grapes" },
      { name: "ham" },
      { name: "hamburger meat" },
      { name: "herbs" },
      { name: "honey" },
      { name: "meat" },
      { name: "onions" },
      { name: "rice" },
      { name: "spices" },
      { name: "turkey" },
      { name: "waffles" },
      { name: "white bread" },
      { name: "yogurt" }
    ];
  }
  addAction() {
    this.dialogMode = "create"
    this.formEditId = null;
    this.formGroup.reset();
    this.formGroup.enable();
    this.dialogHeader = "Create";
  }
  editAction() {
    // Get selected AG Grid rows
    let rows: any[] = this.gridApi.getSelectedRows();

    // Boolean coercion, to parse any variable to boolean, like 0 and 1 will be false and true
    if (coerceBooleanProperty(rows?.length)) {
        
        let row = rows[0];
        console.log(row)
        this.formEditId = row.id;

        this.dialogMode = "edit";
        
        row.name = row.product_name;
        const parsedDate = row.date.split('-');
        const year = Number(parsedDate[2]);
        const month = Number(parsedDate[1]) - 1; // Subtract 1 from the month since it is zero-based in JavaScript Date
        const day = Number(parsedDate[0]);
        const dateObject = new Date(year, month, day);
        const newdate = this.datePipe.transform(dateObject, 'yyyy-MM-dd');

        row.date = newdate

        // Patch subscribed data to reactive form data
        this.formGroup.patchValue(row);

        // Enable reactive form
        this.formGroup.enable();

        // Set dialog header
        this.dialogHeader = "Edit";
    } else {
      // Call message dialog
      this.toastr.warning('Select Row FIrst!', 'Alert');
    }
  }

  deleteAction() {
    let rows: any[] = this.gridApi.getSelectedRows();
    if (coerceBooleanProperty(rows?.length)) {
      let row = rows[0];
      const message = 'Are you sure you want to delete this data?';

      this.toastr.warning(message, 'Delete Confirmation', {
        closeButton: true,
        timeOut: 5000, // Display the toast for 5 seconds
        extendedTimeOut: 2000, // Extend the toast timeout when hovered over
        progressBar: true,
        tapToDismiss: true,
      }).onTap.subscribe(() => {      
        row.name = row.product_name;
        console.log(row.date);
        this.http.request("delete",`${this.apiUrl}/crudcsv`,{ headers: this.headers, body:row })
        .subscribe(res => {
          this.toastr.success('Data Deleted!', 'Success');
          this.reload();
        },
        (error: any) => {
          this.toastr.error(error.error.message, 'Delete Failed');
          // Handle the error, e.g., show an error message
        }
        
        );
      });
    }
  }

  open(content , dialogMode: string) {
    if (dialogMode == 'create') {
      this.addAction();
    }else if (dialogMode == 'edit'){
      this.editAction()
    }
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-detail',
     backdrop: false
    });
  }

  closeDialog() {
    this.dialogVisible = false;
  }

  getRowId(rows: any) {
    return rows.data.id
  }

  submitAction(){
    this.formSubmitted = true;
    if (this.formGroup.invalid) {
      this.toastr.error('Some field are not set!', 'Error');
      return
    };

    let data = this.formGroup.getRawValue();

    const formattedDate = this.datePipe.transform(data.date, 'dd-MM-yyyy');
    data.date = formattedDate

    if (!coerceBooleanProperty(this.formEditId)) {
      this.http
        .post(`${this.apiUrl}/crudcsv`,data, { headers: this.headers })
        .subscribe((res: httpResp) => {
            this.toastr.success('Data Created!', 'Success');

            this.dialogVisible = false;
            this.formEditId = null;
            this.formSubmitted = false;

            this.reload();
        },
        (error: any) => {
          this.toastr.error(error.error.message, 'Create Failed');
          // Handle the error, e.g., show an error message
        }
        
        );
    } else {
      this.http
        .put(`${this.apiUrl}/crudcsv`, data,{ headers: this.headers })
        .subscribe((res: httpResp) => {

            this.toastr.success('Data Updated!', 'Success');
            this.dialogVisible = false;
            this.formEditId = null;
            this.formSubmitted = false;
            this.reload();
        },
        (error: any) => {
          this.toastr.error(error.error.message, 'Update Failed');
          // Handle the error, e.g., show an error message
        }
        
        );
    }
  }

  reload() {
    this.http.get<any>(`${this.apiUrl}/readcsv`, { headers: this.headers }).subscribe(
      (response) => {
        this.rowData = response.map((item, index) => ({ ...item, id: index + 1 }));;
      }
    );
  }

  ngOnInit(): void {
    this.reload();
    this.formGroup = this.formBuilder.group({
      name: [null,Validators.required],
      date: [null,Validators.required],
      count: [null,Validators.required]
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }
  


}
