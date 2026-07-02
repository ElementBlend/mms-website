import { Component, ElementRef, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  protected currentYear: number = new Date().getFullYear();

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
  }
}
