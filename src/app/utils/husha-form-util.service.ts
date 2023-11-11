import {Injectable} from '@angular/core';
import {ENTRY_TYPE, FORM_KIND, INPUT_FIELD_TYPE, VIEW_TYPE} from "../constants/enums";
import {dynamicField} from "../components/dynamic-form/dynamic-form.component";
import {BaseInfoService} from "../api/base-info.service";
import {FetchTypeValuesDTO} from "../models/DTOs/fetch-type-values.DTO";
import {FetchMaxIncValueByFieldNameDTO} from "../models/DTOs/fetch-max-inc-value-by-field-name.DTO";
import {HushaCustomerUtilService} from "./husha-customer-util.service";
import {IFetchFormRes, IFormField} from "../models/interface/fetch-form-res.interface";
import {ActivatedRoute} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class HushaFormUtilService {

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  createModel(form: IFetchFormRes, data?) {
    const model: dynamicField[][] = [];
    const fields: IFormField[] = this.handleShowFields(form.fields, data)
    if (fields.length) {
      const formFields = this.handleSortByField(fields, 'priority');
      const groupFields = this.handleGroupByField(formFields, 'groupCode');
      return new Promise(async (resolve, reject) => {
        try {
          for (const group of groupFields) {
            const modelItem = [];
            for (const field of group) {
              const dynamicField = await this.handleCreateDynamicField(field, data, form);
              modelItem.push(dynamicField);
            }
            model.push(modelItem);
          }
          resolve(model);
        } catch (error) {
          reject(error);
        }
      });
    }
    return []
  }

  handleShowFields(fields: IFormField[], data?: any) {
    if (data) {
      return fields.filter(field => field.viewType === VIEW_TYPE.SHOW_IN_FORM || field.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM)
    } else {
      return fields.filter(field => (field.viewType === VIEW_TYPE.SHOW_IN_FORM || field.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM) && field.entryType !== ENTRY_TYPE.BY_SYSTEM)
    }
  }

  handleSortByField(array, fieldName) {
    return [...array].sort((a, b) => a[fieldName] - b[fieldName])
  }

  handleGroupByField(array, fieldName) {
    const groups = new Map();
    array.forEach(item => {
      let value = item[fieldName];
      if (!groups.has(value)) {
        groups.set(value, []);
      }
      groups.get(value).push(item);
    })
    return Array.from(groups.values());
  }

  async handleCreateDynamicField(field: IFormField, data, form: IFetchFormRes) {
    const dynamicField: dynamicField = {
      type: this.handleType(field),
      name: field.name,
      label: field.caption,
      options: await this.handleOptions(field),
      disabled: data ? (field.entryType === ENTRY_TYPE.BY_SYSTEM || !field.editable) : false,
      value: await this.handleValue(field, data, form),
      rules: this.handleRules(field),
      meta: this.handleMeta(field, form)
    }
    return dynamicField
  }

  handleType(field: IFormField) {
    switch (field.fieldType.id) {
      case INPUT_FIELD_TYPE.FLOAT :
      case INPUT_FIELD_TYPE.NUMBER_WITH_HINT :
      case INPUT_FIELD_TYPE.CURRENCY :
        return INPUT_FIELD_TYPE.NUMBER
      case INPUT_FIELD_TYPE.URL :
      case INPUT_FIELD_TYPE.EMAIL:
        return INPUT_FIELD_TYPE.TEXT
      case INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME :
        return INPUT_FIELD_TYPE.JALALI_DATE_PICKER
      case INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER_WITH_TIME:
        return INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER
      case INPUT_FIELD_TYPE.IMAGE:
        return INPUT_FIELD_TYPE.FILE
      default:
        return field.fieldType.id
    }
  }

  async handleValue(field: IFormField, data, form: IFetchFormRes) {
    if (data) {
      return (typeof data[field.name] === 'object' && data[field.name] !== null) ? data[field.name].id : data[field.name]
    } else {
      if (field.setMaxId) {
        const payload = new FetchMaxIncValueByFieldNameDTO(
          this.hushaCustomerUtilService.customer.id,
          this.hushaCustomerUtilService.serviceTypeId,
          form.id,
          form.formKind.id,
          field.name,
          form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
          form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
          form.formKind.id === FORM_KIND.DETAIL ? this.activatedRoute.snapshot.queryParams['masterId'] : null,
          //TODO masterId چک کاردن
        )
        return await this.baseInfoService.fetchMaxIncValue(payload).toPromise();
      } else {
        //TODO فیلد default value در فرم
        if (field.entryType === ENTRY_TYPE.BY_USER) return null
        else if (field.entryType === ENTRY_TYPE.DEFAULT) return field.defaultValue
      }
    }
  }

  handleRules(field: IFormField) {
    //TODO min and max
    let rules = null
    if (field.notNullable) {
      rules = {...rules, required: true}
    }
    if (field.maxSize) {
      rules = {...rules, maxLength: true}
    }
    if (field.minSize) {
      rules = {...rules, minLength: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.URL) {
      rules = {...rules, url: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.EMAIL) {
      rules = {...rules, email: true}
    }
    return rules
  }

  handleMeta(field: IFormField, form: IFetchFormRes) {
    let meta = null
    if (field.fieldType.id === INPUT_FIELD_TYPE.FLOAT || field.fieldType.id === INPUT_FIELD_TYPE.NUMBER_WITH_HINT || field.fieldType.id === INPUT_FIELD_TYPE.CURRENCY) {
      meta = {...meta, showFraction: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.NUMBER_WITH_HINT) {
      meta = {...meta, showCurrencyToText: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER_WITH_TIME || field.fieldType.id === INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME) {
      meta = {...meta, timeEnable: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.CURRENCY) {
      meta = {...meta, suffix: 'ریال'}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.LOOK_UP_WITH_FORM) {
      meta = {...meta, form: form, field: field}
    }
    return meta
  }

  async handleOptions(field: IFormField) {
    if (field.fieldType.id === INPUT_FIELD_TYPE.DROP_DOWN) {
      const payload = new FetchTypeValuesDTO(field.lookUpType.id);
      return await this.baseInfoService.fetchTypeValues(payload).toPromise();
    }
    return null
  }
}
