import {Injectable} from '@angular/core';
import {FetchAllFormDataDTO} from "../models/DTOs/fetch-all-form-data.DTO";
import {FORM_KIND, VIEW_TYPE} from "../constants/enums";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {ColDef} from "ag-grid-community";
import {HushaCustomerUtilService} from "./husha-customer-util.service";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";

@Injectable({
  providedIn: 'root'
})
export class HushaGridUtilService {

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
  ) {
  }

  createGrid(rowData: IFetchFormDataRes[], form: IFetchFormRes) {
    const colDefs: ColDef[] = []
    form.fields.forEach(item => {
      if (item.isActive && (item.viewType == VIEW_TYPE.SHOW_IN_GRID || item.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)) {
        const col: ColDef = {field: item.name, headerName: item.caption}
        colDefs.push(col)
      }
    })
    for (let i = 0; i < rowData.length; i++) {
      for (let prop in rowData[i]) {
        if (typeof rowData[i][prop] === 'object' && rowData[i][prop] !== null) {
          rowData[i][prop] = rowData[i][prop].id;
        }
      }
    }
    return {colDefs, rowData}
  }

  handleCreatePayload(form: IFetchFormRes, id?: number, page: number = 0, size: number = 5, sort?: string) {
    const formKindId = form.formKind.id
    return new FetchAllFormDataDTO(
      this.hushaCustomerUtilService.customer.id,
      form.id,
      form.formKind.id,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      formKindId === FORM_KIND.FLAT || formKindId === FORM_KIND.MULTI_LEVEL ? this.hushaCustomerUtilService.serviceTypeId : null,
      page,
      size,
      sort,
      formKindId === FORM_KIND.MULTI_LEVEL ? id : null,
      formKindId === FORM_KIND.DETAIL ? id : null,
    )
  }

  handleSortParam(sortModel: any[]) {
    let sort = null
    if (sortModel.length) {
      sort = sortModel.map(item => {
        const obj = {colId: item.colId, sort: item.sort}
        return Object.values(obj).join(':');
      }).join(',')
    }
    return sort
  }


}
