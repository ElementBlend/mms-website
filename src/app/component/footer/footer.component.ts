import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }
}
