import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ColDef, GridOptions, RowClickedEvent} from "ag-grid-community";
import {AG_GRID_LOCALE_FA} from "../../constants/ag-grid-locale-fa";
import {AgGridModule} from "ag-grid-angular";

@Component({
  selector: 'app-custom-grid',
  template: `
    <ag-grid-angular
      style="width:100%"
      class="ag-theme-alpine"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [gridOptions]="gridOptions"
      (rowClicked)="rowClicked.emit($event)"
    ></ag-grid-angular>
  `,
  styles: []
})
export class CustomGridComponent implements OnInit {

  @Input() columnDefs: ColDef[] = []
  @Input() rowData: any[] = []

  private _gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1, minWidth: 150, resizable: true
    },
    overlayNoRowsTemplate: 'رکوری جهت نمایش یافت نشد',
    rowSelection: 'single',
    localeText: AG_GRID_LOCALE_FA,
    domLayout: 'autoHeight',
    enableRtl: true,
    pagination: true,
    paginationPageSize: 5,
  }
  @Input() set gridOptions(data: GridOptions) {
    if (data) {
      this._gridOptions = {
        ...this._gridOptions,
        ...data,
        defaultColDef: {...this._gridOptions.defaultColDef, ...data.defaultColDef},
      }
    }
  }

  get gridOptions(): GridOptions {
    return this._gridOptions
  }

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
