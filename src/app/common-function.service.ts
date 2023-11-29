import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonFunctionService {
  constructor(private _elementRef: ElementRef) { }

  removeNgVersion() {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }
}
