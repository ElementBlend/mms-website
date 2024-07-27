import { DownloadService } from './../download.service';
import { Component, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent {
  protected selectedVersion: number = 17;
  protected selectedDownloadOption: string = "modpack";
  protected selectedOption: string = "fullInstaller";
  protected selectedOS: string = "windows";

  constructor(private _elementRef: ElementRef, private downloadService: DownloadService) { }

  ngOnInit(): void {
    this._elementRef.nativeElement.removeAttribute("ng-version");
    this.downloadService.getModpackVersionFromServer();
  }

  getModpackVersion(): number[] {
    return this.downloadService.getModpackVersion();
  }

  onDownload() {
    if (this.selectedDownloadOption === "world") {
      console.log(`Downloading Modpack ${this.selectedVersion} with ${this.selectedDownloadOption} option`);
    } else {
      console.log(`Downloading Server ${this.selectedVersion} for ${this.selectedOS} with ${this.selectedDownloadOption} and ${this.selectedOption} option`);
    }
  }
}
