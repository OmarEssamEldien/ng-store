import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  title = inject(Title);

  meta = inject(Meta);

  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateDescription(description: string) {
    this.meta.updateTag({ name: 'description', content: description });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  updateOgTitle(title: string) {
    this.meta.updateTag({ property: 'og:title', content: title });
  }

  updateOgDescription(description: string) {
    this.meta.updateTag({ property: 'og:description', content: description });
  }

  updateOgImage(image: string) {
    this.meta.updateTag({ property: 'og:image', content: image });
  }

}
