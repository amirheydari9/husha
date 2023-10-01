import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'numberToCurrency'
})
export class NumberToCurrencyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {

    if (value) {
      const numbers = []
      const total = value.toString()
      const currencies = ['ریال', '', 'هزار', 'میلیون']
      const partitions = [-1, -4, -7, -10]
      partitions.forEach((partition, index) => {
        let part;
        if (partition === -1) part = total.slice(partition);
        else part = total.slice(partition, partitions[index - 1]);
        if (part) numbers.unshift(part);
      })

      let text = '';
      if (numbers.length > 1) {
        numbers.forEach((item, index) => {
          if (index !== numbers.length - 1) {
            if (item !== '000') text += `${parseInt(item, 10)} ${currencies[numbers.length - index - 1]}`
            if (index !== numbers.length - 2 && numbers[index + 1] !== '000') text += ' و '
          }
        })
      }
      if (text.trim().length) text += ' تومان '
      if (numbers[numbers.length - 1] !== '0') {
        if (text.trim().length) text += 'و '
        text += `${numbers[numbers.length - 1]} ${currencies[0]}`
      }
      return text
    }
    return null
  }
}

@NgModule({
  declarations: [NumberToCurrencyPipe],
  exports: [NumberToCurrencyPipe]
})
export class NumberToCurrencyPipeModule {

}

