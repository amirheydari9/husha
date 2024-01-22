import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {DateFormat, DateService} from "../utils/date.service";

export type dateInputType = 'number' | 'string'

@Pipe({
  name: 'jalaliDate'
})
export class JalaliDatePipe implements PipeTransform {

  constructor(
    private dateService: DateService
  ) {
  }

  transform(value: string, inputType: dateInputType, format: string, dateFormat?: DateFormat, ...args: unknown[]): string {
    if (value) {
      if (inputType === 'number') {
        return this.dateService.timestampToJalali(value)
      } else if (inputType === 'string') {
        return this.dateService.convertGeorgianToJalali(value, format, dateFormat)
      }
    }
    return null
  }

}

@NgModule({
  declarations: [JalaliDatePipe],
  exports: [JalaliDatePipe]
})
export class JalaliDatePipeModule {

}
