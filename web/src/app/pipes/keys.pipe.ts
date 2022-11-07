import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): any {
    return Object.keys(value);
  }

}
