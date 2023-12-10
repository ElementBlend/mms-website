import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }
}
