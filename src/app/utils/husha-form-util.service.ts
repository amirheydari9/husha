import {Injectable} from '@angular/core';
import {FORM_KIND, INPUT_FIELD_TYPE} from "../constants/enums";
import {dynamicField} from "../components/dynamic-form/dynamic-form.component";
import {BaseInfoService} from "../api/base-info.service";
import {FetchTypeValuesDTO} from "../models/DTOs/fetch-type-values.DTO";
import {FetchMaxIncValueByFieldNameDTO} from "../models/DTOs/fetch-max-inc-value-by-field-name.DTO";
import {HushaCustomerUtilService} from "./husha-customer-util.service";
import {IFetchFormRes} from "../models/interface/fetch-form-res.interface";

@Injectable({
  providedIn: 'root'
})
export class HushaFormUtilService {

  constructor(
    private baseInfoService: BaseInfoService,
    private hushaCustomerUtilService: HushaCustomerUtilService
  ) {
  }

  createModel(form: IFetchFormRes, data?) {
    const model: dynamicField[][] = [];
    const fields = form.fields
    const formFields = this.handleSortByField(fields, 'priority');
    const groupFields = this.handleGroupByField(formFields, 'groupCode');
    return new Promise(async (resolve, reject) => {
      try {
        for (const group of groupFields) {
          const modelItem = [];
          for (const field of group) {
            if (this.handleShowField(field, data)) {
              const dynamicField = await this.handleCreateDynamicField(field, data, form);
              modelItem.push(dynamicField);
            }
          }
          model.push(modelItem);
        }
        resolve(model);
      } catch (error) {
        reject(error);
      }
    });
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

  handleShowField(field, data) {
    // return field.viewType === VIEW_TYPE.SHOW_IN_FORM || field.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM
    return true
  }

  async handleCreateDynamicField(field, data, form) {
    //TODO اگه مقدار فیلد از نوع آبکت بود
    const dynamicField: dynamicField = {
      type: this.handleType(field),
      name: field.name,
      label: field.caption,
      options: await this.handleOptions(field),
      disabled: !field.editable,
      value: await this.handleValue(field, data, form),
      rules: this.handleRules(field),
      meta: this.handleMeta(field)
    }
    return dynamicField
  }

  handleType(field) {
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
      default:
        return field.fieldType.id
    }
  }

  async handleValue(field, data, form) {
    if (data) {
      return (typeof data[field.name] === 'object' && data[field.name] !== null) ? data[field.name].id : data[field.name]
    } else {
      //TODO   و اینکه چک بشه فیلد قابل ایجاد هست یا نه شرط کال وب سرویس
      if (!field.isAuto) {
        const payload = new FetchMaxIncValueByFieldNameDTO(
          this.hushaCustomerUtilService.customer.id,
          this.hushaCustomerUtilService.serviceTypeId,
          form.id,
          form.formKind.id,
          field.name,
          form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.unit.id : null,
          form.formKind.id === FORM_KIND.MASTER ? this.hushaCustomerUtilService.period.id : null,
        )
        return await this.baseInfoService.fetchMaxIncValue(payload).toPromise();
      } else {
        //TODO فیلد default value در فرم
        return data[field.name].defaultValue
      }
    }
  }

  handleRules(field) {
    //TODO min and max
    let rules = null
    if (field.notNullable) {
      rules = {...rules, required: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.URL) {
      rules = {...rules, url: true}
    }
    if (field.fieldType.id === INPUT_FIELD_TYPE.EMAIL) {
      rules = {...rules, email: true}
    }
    return rules
  }

  handleMeta(field) {
    let meta = null
    if (field.fieldType.id === INPUT_FIELD_TYPE.NUMBER) {
      meta = {...meta, showFraction: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.NUMBER_WITH_HINT) {
      meta = {...meta, showCurrencyToText: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER_WITH_TIME || field.fieldType.id === INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME) {
      meta = {...meta, timeEnable: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.CURRENCY) {
      meta = {...meta, suffix: 'ریال'}
    }
    return meta
  }

  async handleOptions(field) {
    if (field.fieldType.id === INPUT_FIELD_TYPE.DROP_DOWN) {
      const payload = new FetchTypeValuesDTO(field.lookUpType.id);
      return await this.baseInfoService.fetchTypeValues(payload).toPromise();
    }
    return null
  }
}
