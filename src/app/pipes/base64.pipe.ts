import {NgModule, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'base64'
})
export class Base64Pipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value) {
      return `data:image/png;base64,${value}`
    }
    return null;
  }

}

@NgModule({
  declarations: [Base64Pipe],
  exports: [Base64Pipe]
})
export class Base64PipeModule {

}
