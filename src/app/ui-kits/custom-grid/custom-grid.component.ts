import {Component, EventEmitter, Input, NgModule, OnInit, Output} from '@angular/core';
import {ColDef, GridApi, GridOptions, GridReadyEvent, RowClickedEvent} from "ag-grid-community";
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
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
  `,
  styles: []
})
export class CustomGridComponent implements OnInit {

  gridApi: GridApi

  @Input() columnDefs: ColDef[] = []
  @Input() rowData: any[] = []

  private _gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1, minWidth: 150, resizable: true
    },
    overlayNoRowsTemplate: 'رکوردی جهت نمایش یافت نشد',
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
  @Output() gridReady: EventEmitter<GridReadyEvent<any>> = new EventEmitter<GridReadyEvent<any>>()

  constructor() {
  }

  ngOnInit(): void {
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api
    this.gridReady.emit($event)
    $event.api.sizeColumnsToFit()
  }


  get allRows() {
    const allRowNodes = [];
    this.gridApi.forEachNode(node => allRowNodes.push(node));
    return allRowNodes
  }

  get rowDataCount(): number {
    return this.gridApi.getDisplayedRowCount()
  }

  get selectedRows() {
    return this.gridOptions.rowSelection === "single" ? this.gridApi?.getSelectedRows()[0] : this.gridApi?.getSelectedRows()
  }

  clearData() {
    const rowData: any[] = [];
    this.gridApi.forEachNode((node) => rowData.push(node.data))
    this.gridApi.applyTransaction({remove: rowData})
  }

  removeSelectedRows() {
    const selectedData = this.gridApi.getSelectedRows();
    this.gridApi.applyTransaction({remove: selectedData});
  }

  addRows(data) {
    this.gridApi.applyTransaction({add: data})
    this.gridApi.paginationGoToLastPage()
  }

  updateRow(data) {
    const itemsToUpdate: any[] = [];
    this.gridApi.forEachNodeAfterFilterAndSort((rowNode, index) => {
      if (rowNode.data.id === data.id) rowNode.data = data
      itemsToUpdate.push(data);
    });
    this.gridApi.applyTransaction({update: itemsToUpdate})
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
