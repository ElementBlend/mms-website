import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaControllerService {
  constructor(private meta: Meta, @Inject(DOCUMENT) private document: Document) { }

  setMetaTag(tagName: string, tagContent: string): void {
    if (this.meta.getTag(`name='${tagName}'`) == null) {
      this.meta.addTag({ name: tagName, content: tagContent });
    } else {
      this.meta.updateTag({ name: tagName, content: tagContent });
    }

    if (tagName === 'description') {
      if (this.meta.getTag('name="og:description"') == null) {
        this.meta.addTag({ name: 'og:description', content: tagContent });
      } else {
        this.meta.updateTag({ name: 'og:description', content: tagContent });
      }
    }
  }

  updateCanonicalUrl(url: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement || null;
    if (element == null) {
      element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', url);
  }
}
