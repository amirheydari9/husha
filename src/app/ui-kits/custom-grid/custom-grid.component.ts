import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ColDef, GridOptions, RowClickedEvent} from "ag-grid-community";
import {AG_GRID_LOCALE_FA} from "../../constants/ag-grid-locale-fa";
import {AgGridModule} from "ag-grid-angular";

@Component({
  selector: 'app-custom-grid',
  template: `
    <ag-grid-angular
      style="width:100%;height: 310px"
      class="ag-theme-alpine"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [enableRtl]="true"
      [gridOptions]="gridOptions"
      [pagination]="pagination"
      [paginationPageSize]="5"
      (rowClicked)="rowClicked.emit($event)"
    ></ag-grid-angular>
  `,
  styles: []
})
export class CustomGridComponent implements OnInit {

  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد',
    rowSelection: 'single',
    localeText: AG_GRID_LOCALE_FA
  }

  @Input() columnDefs: ColDef[] = []
  @Input() rowData: any[] = []
  @Input() pagination: boolean = true

  @Output() rowClicked: EventEmitter<RowClickedEvent<any>> = new EventEmitter<RowClickedEvent<any>>()

  constructor() {
  }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [CustomGridComponent],
  imports: [
    AgGridModule
  ],
  exports: [CustomGridComponent]
})
export class CustomGridModule {

}
