import { Component, ElementRef, OnInit, Renderer2, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-info',
  imports: [RouterModule],
  templateUrl: './home-info.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-info.component.scss'
})
export class HomeInfoComponent implements OnInit {
  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.renderer.removeAttribute(this.elementRef.nativeElement, "ng-version");
  }
}
