import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild} from '@angular/core';
import {AgGridAngular, AgGridModule} from "ag-grid-angular";
// import 'ag-grid-enterprise';
import {ColDef, PaginationChangedEvent, RowClickedEvent} from "ag-grid-community";
import {FORM_KIND} from "../../constants/enums";

@Component({
  selector: 'app-husha-grid',
  templateUrl: './husha-grid.component.html',
  styleUrls: ['./husha-grid.component.scss']
})
export class HushaGridComponent implements OnInit {

  @Input() columnDefs: ColDef[]
  @Input() rowData: any[]

  @Input() set formKind(data: FORM_KIND) {
    if (data === FORM_KIND.MASTER || data === FORM_KIND.DETAIL) {
      this.height = '40vh'
    }
  }

  height: string = '300px'

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

  handleRowClicked($event: RowClickedEvent<any>) {
    this.rowClicked.emit($event.data)
  }

  handlePaginationChanged($event: PaginationChangedEvent<any>) {
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
