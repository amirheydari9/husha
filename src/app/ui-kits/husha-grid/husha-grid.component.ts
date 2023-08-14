import {Component, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
// import 'ag-grid-enterprise';
import {ColDef} from "ag-grid-community";

@Component({
  selector: 'app-husha-grid',
  templateUrl: './husha-grid.component.html',
  styleUrls: ['./husha-grid.component.scss']
})
export class HushaGridComponent implements OnInit {

  @Input() columnDefs: ColDef[]
  @Input() rowData: any[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [HushaGridComponent],
  imports: [
    AgGridModule
  ],
  exports: [HushaGridComponent]
})
export class HushaGridModule {

}
