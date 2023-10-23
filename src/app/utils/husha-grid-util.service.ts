import {Injectable} from '@angular/core';
import {FetchAllFormDataDTO} from "../models/DTOs/fetch-all-form-data.DTO";
import {CRITERIA_OPERATION_TYPE, FORM_KIND, VIEW_TYPE} from "../constants/enums";
import {IFetchFormDataRes} from "../models/interface/fetch-form-data-res.interface";
import {ColDef} from "ag-grid-community";
import {HushaCustomerUtilService} from "./husha-customer-util.service";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {DeleteFormDataDTO} from "../models/DTOs/delete-form-data.DTO";
import {BaseInfoService} from "../api/base-info.service";

export class FetchAllDataPayloadDTO {
  constructor(
    public form: IFetchFormRes,
    public parentId?: number,
    public masterId?: number,
    public page?: number,
    public size?: number,
    public sort?: string,
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class HushaGridUtilService {

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService
  ) {
  }

  handleCreatePayloadForFetchAllData(payload: FetchAllDataPayloadDTO) {
    const formKindId = payload.form.formKind.id
    return new FetchAllFormDataDTO(
      this.hushaCustomerUtilService.customer.id,
      payload.form.id,
      formKindId,
      this.hushaCustomerUtilService.service.id,
      this.hushaCustomerUtilService.unit.id,
      this.hushaCustomerUtilService.period.id,
      formKindId === FORM_KIND.FLAT || formKindId === FORM_KIND.MULTI_LEVEL ? this.hushaCustomerUtilService.serviceTypeId : null,
      payload.page,
      payload.size,
      payload.sort,
      formKindId === FORM_KIND.MULTI_LEVEL ? payload.parentId : null,
      formKindId === FORM_KIND.DETAIL ? payload.masterId : null,
      [
        {
          key: "isActive",
          operation: CRITERIA_OPERATION_TYPE.EQUAL,
          value: "true"
        }
      ]
    )
  }

  createGrid(rowData: IFetchFormDataRes[], form: IFetchFormRes, fetchSummary: boolean) {
    const colDefs: ColDef[] = []
    form.fields.forEach(item => {
      //TODO که دیگه کاری به viewType نداریم  چک و تیک برای وقتی که حلت خلاصه داریم
      if (fetchSummary) {
        //TODO id  در نمایش ستون ها نباشد
        if (item.name === 'code' || item.name === 'title') {
          colDefs.push({field: item.name, headerName: item.caption})
        }
      } else {
        if (item.isActive && (item.viewType == VIEW_TYPE.SHOW_IN_GRID || item.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)) {
          const col: ColDef = {field: item.name, headerName: item.caption}
          colDefs.push(col)
        }
      }
    })
    for (let i = 0; i < rowData.length; i++) {
      for (let prop in rowData[i]) {
        if (typeof rowData[i][prop] === 'object' && rowData[i][prop] !== null) {
          rowData[i][prop] = rowData[i][prop].title;
        }
      }
    }
    return {colDefs, rowData}
  }

  handleSortParam(sortModel: any[]) {
    let sort = null
    if (sortModel.length) {
      sort = sortModel.map(item => {
        const obj = {colId: item.colId, sort: item.sort}
        return Object.values(obj).join(':');
      })
    }
    return sort
  }

  handleCreatePayloadForDeleteRow(form: IFetchFormRes, id: number, masterId: number) {
    const formKindId = form.formKind.id
    return new DeleteFormDataDTO(
      this.hushaCustomerUtilService.customer.id,
      this.hushaCustomerUtilService.serviceTypeId,
      form.id,
      formKindId,
      id,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
      formKindId === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
      formKindId === FORM_KIND.DETAIL ? masterId : null,
    )
  }

  handleFetchData(fetchSummary: boolean, data: FetchAllDataPayloadDTO) {
    const payload = this.handleCreatePayloadForFetchAllData(data)
    if (fetchSummary) {
      return this.baseInfoService.fetchAllSummary(payload)
    } else {
      return this.baseInfoService.fetchAllFormData(payload)
    }
  }
}
