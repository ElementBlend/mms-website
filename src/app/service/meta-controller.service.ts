import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaControllerService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private meta: Meta, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

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
      element = this.renderer.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(element, 'rel', 'canonical');
      this.renderer.appendChild(head, element);
    }
    this.renderer.setAttribute(element, 'href', url);
  }
}
