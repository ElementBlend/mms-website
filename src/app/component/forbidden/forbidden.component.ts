import { Component, ElementRef, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  imports: [RouterModule],
  templateUrl: './forbidden.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
  }
}
