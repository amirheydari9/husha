import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {IFetchFormRes, IFormField} from "../../models/interface/fetch-form-res.interface";
import {BaseInfoService} from "../../api/base-info.service";
import {ColDef, GridOptions, IDatasource, IGetRowsParams} from "ag-grid-community";
import {AgGridAngular} from "ag-grid-angular";
import {HushaGridUtilService} from "../../utils/husha-grid-util.service";
import {FORM_KIND} from "../../constants/enums";

@Component({
  selector: 'app-lookup-form-dialog',
  template: `
    <p>
      lookup-form-dialog works!
    </p>
  `,
  styles: []
})
export class LookupFormDialogComponent implements OnInit {

  @Input() form: IFetchFormRes
  @Input() field: IFormField

  private gridApi: any
  defaultPageSize = 2
  rowData = []
  columnDefs: ColDef[] = []

  gridOptions: GridOptions = {
    defaultColDef: {
      sortable: true, filter: true, flex: 1
    },
    rowModelType: 'infinite'
  }

  @ViewChild('grid') grid!: AgGridAngular;

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaGridUtilService: HushaGridUtilService
  ) {
  }

  ngOnInit(): void {
    this.gridApi = this.grid.api;
    this.gridApi.setDatasource(this.dataSource)
  }


  dataSource: IDatasource = {
    //TODO مشخص کن که آیا فقط فلت و مالتی هستند یا خیر چون توی extraId تاثیر داره
    getRows: ((params: IGetRowsParams) => {
      this.baseInfoService.fetchAllSummary(
        this.hushaGridUtilService.handleCreatePayload(
          this.form,
          this.form.formKind.id === FORM_KIND.MULTI_LEVEL ? 0 : null,
          this.gridApi.paginationGetCurrentPage(),
          this.gridApi.paginationGetPageSize(),
          this.hushaGridUtilService.handleSortParam(params.sortModel)
        )).subscribe(formData => {
        const paginationInfo = formData.shift()
        const {colDefs, rowData} = this.hushaGridUtilService.createGrid(formData, this.form)
        this.columnDefs = colDefs
        params.successCallback(rowData, paginationInfo['paginationTotalElements'])
      })
    })
  }

}
