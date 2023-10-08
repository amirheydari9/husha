import {Injectable} from '@angular/core';
import {INPUT_FIELD_TYPE} from "../constants/enums";
import {dynamicField} from "../components/dynamic-form/dynamic-form.component";

@Injectable({
  providedIn: 'root'
})
export class HushaFormUtilService {

  constructor() {
  }

  createModel(fields) {
    const model: dynamicField[][] = []
    const formFields = this.handleSortByField(fields, 'priority')
    const groupFields = this.handleGroupByField(formFields, 'groupCode')
    groupFields.map(group => {
      const modelItem = []
      group.map(field => {
        if (this.handleShowField(field)) {
          modelItem.push(this.handleCreateDynamicField(field))
        }
      })
      model.push(modelItem)
    })
    return model
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

  handleShowField(field) {
    // return field.formFields.viewType === VIEW_TYPE.SHOW_IN_FORM || field.formFields.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM
    return true
  }

  handleCreateDynamicField(field) {
    const dynamicField: dynamicField = {
      type: this.handleType(field),
      name: field.name,
      label: field.caption,
      disabled: !field.editable,
      rules: this.handleRules(field),
      meta: this.handleMeta(field)
    }
    return dynamicField
  }

  handleType(field) {
    switch (field.fieldType) {
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
    return rules ?? null
  }

  handleMeta(field) {
    let meta = null
    if (field.fieldType.id === INPUT_FIELD_TYPE.NUMBER) {
      meta = {...meta, showFraction: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.NUMBER_WITH_HINT) {
      meta = {...meta, showCurrencyToNumber: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.GEORGIAN_DATE_PICKER_WITH_TIME || field.fieldType.id === INPUT_FIELD_TYPE.JALALI_DATE_PICKER_WITH_TIME) {
      meta = {...meta, timeEnable: true}
    } else if (field.fieldType.id === INPUT_FIELD_TYPE.CURRENCY) {
      meta = {...meta, suffix: 'ریال'}
    }
    return meta ?? null
  }

}
