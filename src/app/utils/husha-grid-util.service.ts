import {Injectable} from '@angular/core';
import {criteriaInterface, FetchAllFormDataDTO} from "../models/DTOs/fetch-all-form-data.DTO";
import {
  ACCESS_FORM_ACTION_TYPE,
  CRITERIA_OPERATION_TYPE,
  DOWNLOAD_TYPE,
  FORM_KIND,
  INPUT_FIELD_TYPE,
  VALUE_TYPE,
  VIEW_TYPE
} from "../constants/enums";
import {ColDef} from "ag-grid-community";
import {HushaCustomerUtilService} from "./husha-customer-util.service";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";
import {DeleteFormDataDTO} from "../models/DTOs/delete-form-data.DTO";
import {BaseInfoService} from "../api/base-info.service";
import {FetchAccessActionDTO} from "../models/DTOs/fetch-access-action.DTO";
import {DateService} from "./date.service";

export class FetchAllDataPayloadDTO {
  constructor(
    public form: IFetchFormRes,
    public parentId?: number,
    public masterId?: number,
    public page?: number,
    public size?: number,
    public sort?: string,
    public criteria?: criteriaInterface[],
    public downloadType?: DOWNLOAD_TYPE,
    public resultSet?: string
  ) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class HushaGridUtilService {

  constructor(
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private baseInfoService: BaseInfoService,
    private dateService: DateService
  ) {
  }

  async handleGridAccessActions(form: IFetchFormRes, fetchSummary: boolean): Promise<ACCESS_FORM_ACTION_TYPE[]> {
    const actions = []
    actions.push(ACCESS_FORM_ACTION_TYPE.ADVANCE_SEARCH)
    actions.push(ACCESS_FORM_ACTION_TYPE.RESET_ADVANCE_SEARCH)
    if (form.formKind.id === FORM_KIND.MULTI_LEVEL) {
      actions.push(ACCESS_FORM_ACTION_TYPE.PERV)
      actions.push(ACCESS_FORM_ACTION_TYPE.NEXT)
    }
    if (!fetchSummary) {
      actions.push(ACCESS_FORM_ACTION_TYPE.EXPORT)
      if (form.hasFormImport) {
        actions.push(ACCESS_FORM_ACTION_TYPE.IMPORT)
      }
      if (form.formKind.id === FORM_KIND.MASTER) {
        actions.push(ACCESS_FORM_ACTION_TYPE.ATTACHMENTS)
      }
      const payload = new FetchAccessActionDTO(
        this.hushaCustomerUtilService.customer.id,
        this.hushaCustomerUtilService.service.id,
        this.hushaCustomerUtilService.unit.id,
        form.id,
      )
      const data = await this.baseInfoService.accessFormAction(payload).toPromise()
      data.forEach(item => {
        if (item.action === ACCESS_FORM_ACTION_TYPE.ADD) {
          actions.unshift(ACCESS_FORM_ACTION_TYPE.ADD)
        } else if (item.action === ACCESS_FORM_ACTION_TYPE.UPDATE) {
          actions.unshift(ACCESS_FORM_ACTION_TYPE.UPDATE)
        } else if (item.action === ACCESS_FORM_ACTION_TYPE.DELETE) {
          actions.unshift(ACCESS_FORM_ACTION_TYPE.DELETE)
        }
      })
    }
    return actions
  }

  handleCreatePayloadForFetchAllData(payload: FetchAllDataPayloadDTO) {
    const formKindId = payload.form.formKind.id
    const defaultCriteria: criteriaInterface = {
      key: "isactive",
      operation: CRITERIA_OPERATION_TYPE.EQUAL,
      value: "true",
      valueType: VALUE_TYPE.BOOLEAN
    }
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
      payload.criteria ? [defaultCriteria, ...payload.criteria] : [defaultCriteria],
      payload.downloadType,
      payload.resultSet,
    )
  }

  handleCreateColumnDefs(form: IFetchFormRes, fetchSummary: boolean, currentItem?: any): ColDef[] {
    const colDefs: ColDef[] = []
    form.fields.forEach(item => {
      if (fetchSummary) {
        if (item.name === 'code' || item.name === 'title') {
          colDefs.push({field: item.name, headerName: item.caption})
        }
      } else {
        if (item.isActive && (item.viewType == VIEW_TYPE.SHOW_IN_GRID || item.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)) {
          let sortModel = null
          let sortIndex = 0
          if (currentItem && currentItem?.sort.length) {
            currentItem.sort.forEach(sort => {
              if (sort.colId === item.name) {
                sortModel = sort.sort
                sortIndex = sort.sortIndex
              }
            })
          }
          const col: ColDef = {field: item.name, headerName: item.caption, sort: sortModel, sortIndex:sortIndex}
          colDefs.push(col)
        }
      }
    })
    return colDefs
  }

  handleCreateRowData(rowData: any[], form: IFetchFormRes,): any[] {
    const jalaliFieldsName = []
    form.fields.forEach(item => {
      if ([INPUT_FIELD_TYPE.JALALI_DATE_PICKER, INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME].indexOf(item.fieldType.id) > -1) {
        jalaliFieldsName.push(item.name)
      }
    })
    rowData.forEach(row => {
      for (const [key, value] of Object.entries(row)) {
        if (jalaliFieldsName.indexOf(key) > -1) {
          row[key] = this.dateService.convertGeorgianToJalali(value as string)
        }
        if (typeof row[key] === 'object' && row[key] !== null) {
          row[key] = row[key].title;
        }
      }
    })
    return rowData
  }

  createGrid(rowData: any[], form: IFetchFormRes, fetchSummary: boolean) {
    const colDefs: ColDef[] = []
    const jalaliFieldsName = []
    form.fields.forEach(item => {
      //TODO که دیگه کاری به viewType نداریم  چک و تیک برای وقتی که حلت خلاصه داریم
      if (fetchSummary) {
        if (item.name === 'code' || item.name === 'title') {
          colDefs.push({field: item.name, headerName: item.caption})
        }
      } else {
        if (item.isActive && (item.viewType == VIEW_TYPE.SHOW_IN_GRID || item.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)) {
          const col: ColDef = {field: item.name, headerName: item.caption}
          colDefs.push(col)
        }
      }
      if (item.fieldType.id === INPUT_FIELD_TYPE.JALALI_DATE_PICKER || item.fieldType.id === INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME) {
        jalaliFieldsName.push(item.name)
      }
    })

    rowData.forEach(row => {
      for (const [key, value] of Object.entries(row)) {
        if (jalaliFieldsName.indexOf(key) > -1) {
          row[key] = this.dateService.convertGeorgianToJalali(value as string)
        }
        if (typeof row[key] === 'object' && row[key] !== null) {
          row[key] = row[key].title;
        }
      }
    })
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
    return this.baseInfoService.fetchAllFormData(payload)
  }
}
