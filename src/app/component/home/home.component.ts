import { Component, ElementRef, OnInit } from '@angular/core';
import { TimelineModpackComponent } from "../timeline-modpack/timeline-modpack.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TimelineModpackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
  }
}
