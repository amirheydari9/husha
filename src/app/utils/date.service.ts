import {Injectable} from '@angular/core';
import * as moment from "jalali-moment";
import {DurationInputArg1, DurationInputArg2} from "jalali-moment";

export type DateFormat = 'date' | 'iso' | 'dateTime'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor() {
  }

  // convertGeorgianToJalali(date: string, format: string, dateFormat: DateFormat = 'dateTime'): string {
  //   const formatDate = this.transformDateTimeToDate(date, dateFormat)
  //   return moment(formatDate, 'YYYY-MM-DD').locale('fa').format(format);
  // }

  formatDate(format, date?): string {
    return moment(date).format(format)
  }

  timestampToJalali(timestamp: string) {
    return moment(new Date(timestamp), 'YYYY-MM-DD').format('jYYYY-jMM-jDD')
  }

  today(format = 'YYYY-MM-DD'): string {
    return moment().format(format)
  }

  add(date: string, add: DurationInputArg1, unit: DurationInputArg2 = 'days'): string {
    return moment(date, 'YYYY-MM-DD').add(add, unit).format('YYYY-MM-DD')
  }

  sub(date: string, sub: DurationInputArg1, unit: DurationInputArg2 = 'days'): string {
    return moment(date, 'YYYY-MM-DD').subtract(sub, unit).format('YYYY-MM-DD')
  }


}
