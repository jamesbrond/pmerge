import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Duplicate, PMergeFile } from '../interfaces';
import { ToasterService } from './toaster.service';

const EEL = (window as any).eel

@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  private $output = new BehaviorSubject<string>("")
  private $inputList = new BehaviorSubject<PMergeFile[]>([])
  private $merge = new BehaviorSubject<string>("")
  private $duplicates = new BehaviorSubject<Duplicate[]>([])

  constructor(private toaster: ToasterService) { }

  roots(): Observable<PMergeFile[]> {
    console.log('roots()');
    EEL.roots()()
    .then((x: any) => this.$inputList.next(x))
    .catch((e: any) => this.catchError(e));
    return this.$inputList;
  }

  files(path: string): Observable<PMergeFile[]> {
    console.log(`files(${path})`);
    let files = new BehaviorSubject<PMergeFile[]>([])
    EEL.files(path)()
    .then((x: any) => files.next(x))
    .catch((e: any) => this.catchError(e));
    return files;
  }

  image(path: string): Observable<string> {
    console.log(`image(${path})`);
    let image = new BehaviorSubject<string>('')
    EEL.image(path)()
      .then((x: any) => image.next(x))
      .catch((e: any) => this.catchError(e));
    return image;

  }

  output(): Observable<string> {
    console.log('output()');
    EEL.output()()
      .then((x: any) => this.$output.next(x))
      .catch((e: any) => this.catchError(e));
    return this.$output;
  }

  merge(inputs: PMergeFile[], output: string): Observable<string> {
    const folders = inputs.map((x) => x.path)
    console.log(`merge(${folders}, ${output})`);
    EEL.merge(folders, output)()
    .then((x: any) => this.$merge.next(x))
    .catch((e: any) => this.catchError(e));
    return this.$merge;
  }

  duplicates(output: string): Observable<Duplicate[]> {
    console.log(`duplicates(${output})`);
    EEL.duplicates(output)()
    .then((r: any) => {
      const x  = JSON.parse(r);
      let duplicates: Duplicate[] = [];
      Object.keys(x).forEach((k) => {
          duplicates.push(x[k])
        })
        this.$duplicates.next(duplicates)
      })
      .catch((e: any) => this.catchError(e));

      return this.$duplicates;
    }

    delete(files: string[]): Observable<boolean | null> {
    console.log(`delete(${files})`);
    let result = new BehaviorSubject<boolean | null>(null)
    EEL.delete(files)()
      .then((x: any) => result.next(true))
      .catch((e: any) => this.catchError(e));
    return result;
  }

  private catchError(e: any) {
    this.toaster.error(e.errorText);
    console.error(e.errorText);
    console.error(e.errorTraceback);
  }
}
