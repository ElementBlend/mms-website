import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineModpackComponent } from "../timeline-modpack/timeline-modpack.component";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, TimelineModpackComponent]
})
export class HomeComponent {
  constructor() { }
}
