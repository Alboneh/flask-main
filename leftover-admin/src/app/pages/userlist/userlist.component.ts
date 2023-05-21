import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { coerceBooleanProperty } from '@angular/cdk/coercion';


interface httpResp {
  success? : boolean;
  message? : string;
}

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  public apiUrl = 'http://localhost:3030';
  public gridApi: GridApi;
  public columnDefs: ColDef[];
  public rowData: any[];

  public token: string | null;
  public headers: HttpHeaders;
  

  public dialogVisible: boolean;
  public dialogHeader: string;
  public formEditId: number;
  public formSubmitted: boolean;
  public formGroup: UntypedFormGroup;


  public dialogMode: 'create' | 'detail' | 'edit';


  constructor(
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService
    ) {
    this.columnDefs = [
      { headerName: 'ID', field: 'id' },
      { headerName: 'Name', field: 'name' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Password', field: 'password' }
    ];
    this.token = localStorage.getItem('access_token');
    this.headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }


  getRowId(rows: any) {
    return rows.data.id
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
        this.http.request("delete",`${this.apiUrl}/register/${row.id}`,{ headers: this.headers, body:row })
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

  reload() {
    this.http.get<any>(`${this.apiUrl}/users`, { headers: this.headers }).subscribe(
      (response) => {
        this.rowData = response;
      }
    );
  }


  submitAction(){
    this.formSubmitted = true;
    if (this.formGroup.invalid) {
      this.toastr.error('Some field are not set!', 'Error');
      return
    };

    let data = this.formGroup.getRawValue();
    if (!coerceBooleanProperty(this.formEditId)) {
      this.http
        .post(`${this.apiUrl}/register`,data, { headers: this.headers })
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
        .put(`${this.apiUrl}/register/${this.formEditId}`, data,{ headers: this.headers })
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

  ngOnInit(): void {
    this.reload();
    this.formGroup = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      password: [null,Validators.required]
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
  }
}
