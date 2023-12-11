import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {CRITERIA_OPERATION_TYPE} from "../constants/enums";

@Pipe({
  name: 'criteriaOperation',
})
export class CriteriaOperationPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    switch (value) {
      case CRITERIA_OPERATION_TYPE.EQUAL:
        return 'مساوی'
      case CRITERIA_OPERATION_TYPE.NOT_EQUAL:
        return 'مخالف'
      case CRITERIA_OPERATION_TYPE.LIKE:
        return 'شبیه'
      case CRITERIA_OPERATION_TYPE.CONTAINS:
        return 'شامل'
      case CRITERIA_OPERATION_TYPE.START_WITH:
        return 'شروع شود با'
      case CRITERIA_OPERATION_TYPE.END_WITH:
        return 'تمام شود با'
      case CRITERIA_OPERATION_TYPE.LESS_THAN:
        return 'کوچکتر از'
      case CRITERIA_OPERATION_TYPE.LESS_THAN_EQUAL:
        return 'کوچکتر یا مساوی از'
      case CRITERIA_OPERATION_TYPE.GREATER_THAN:
        return 'بزرگتر از'
      case CRITERIA_OPERATION_TYPE.GREATER_THAN_EQUAL:
        return 'بزرگتر یا مساوی از'
      case CRITERIA_OPERATION_TYPE.NOT_NULL:
        return 'نال باشد'
      case CRITERIA_OPERATION_TYPE.NULL:
        return 'نال نباشد'
      case CRITERIA_OPERATION_TYPE.EMPTY:
        return 'خالی باشد'
      case CRITERIA_OPERATION_TYPE.NOT_EMPTY:
        return 'خالی نباشد'
      case CRITERIA_OPERATION_TYPE.IN:
        return 'شامل موارد '
      case CRITERIA_OPERATION_TYPE.NOT_IN:
        return 'به جز موارد'
      case CRITERIA_OPERATION_TYPE.BETWEEN:
        return 'بین'
    }
    return null;
  }

}

@NgModule({
  declarations: [CriteriaOperationPipe],
  exports: [CriteriaOperationPipe]
})
export class CriteriaOperationPipeModule {

}
