
import { Inject, Injectable, Renderer2, RendererFactory2, DOCUMENT } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaControllerService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2, private meta: Meta, @Inject(DOCUMENT) private document: Document) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  setMetaTag(tagType: 'name' | 'property', tagName: string, tagContent: string): void {
    if (tagContent == null || tagContent === '') {
      this.meta.removeTag(`${tagType}='${tagName}'`);
      return;
    }

    if (this.meta.getTag(`${tagType}='${tagName}'`) == null) {
      this.meta.addTag({ [tagType]: tagName, content: tagContent });
    } else {
      this.meta.updateTag({ [tagType]: tagName, content: tagContent });
    }

    if (tagName === 'description') {
      if (this.meta.getTag('property="og:description"') == null) {
        this.meta.addTag({ property: 'og:description', content: tagContent });
      } else {
        this.meta.updateTag({ property: 'og:description', content: tagContent });
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

  updateAlternateUrl(url: string, hreflang: string): void {
    const head = this.document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement = this.document.querySelector('link[rel="alternate"]') as HTMLLinkElement || null;

    if (element == null) {
      element = this.renderer.createElement('link') as HTMLLinkElement;
      this.renderer.setAttribute(element, 'rel', 'alternate');
      this.renderer.appendChild(head, element);
    }
    this.renderer.setAttribute(element, 'hreflang', hreflang);
    this.renderer.setAttribute(element, 'href', url);
  }
}
