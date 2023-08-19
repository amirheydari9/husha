import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
// import 'ag-grid-enterprise';
import {ColDef, RowClickedEvent} from "ag-grid-community";

@Component({
  selector: 'app-husha-grid',
  templateUrl: './husha-grid.component.html',
  styleUrls: ['./husha-grid.component.scss']
})
export class HushaGridComponent implements OnInit {

  @Input() columnDefs: ColDef[]
  @Input() rowData: any[]

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>()

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex: 1,
  };

  constructor() {
  }

  ngOnInit(): void {
  }

  handleRowClick($event: RowClickedEvent<any>) {
    this.rowClicked.emit($event)
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
