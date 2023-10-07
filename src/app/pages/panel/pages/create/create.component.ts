import {Component, OnInit} from '@angular/core';
import {dynamicField} from "../../../../components/dynamic-form/dynamic-form.component";
import {INPUT_FIELD_TYPE} from "../../../../constants/enums";
import {AutoUnsubscribe} from "../../../../decorators/AutoUnSubscribe";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@AutoUnsubscribe({arrayName: 'subscription'})
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  subscription: Subscription [] = []

  model: dynamicField[] = []

  constructor(
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.subscription.push(
      this.activatedRoute.params.subscribe(() => {
        const formFields = [...this.activatedRoute.snapshot.data['data'].fields].sort((a, b) => a.priority - b.priority)
        formFields.map(field => {
          // if (formFields.viewType === VIEW_TYPE.SHOW_IN_FORM || formFields.viewType === VIEW_TYPE.SHOW_IN_GRID_AND_FORM) {
          const model: dynamicField = {
            type: this.handleType(field),
            name: field.name,
            label: field.caption,
            disabled: !field.editable,
            rules: this.handleRules(field),
            meta: this.handleMeta(field)
          }
          console.log(model)
          this.model.push(model)
          // }
        })
      })
    )
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
