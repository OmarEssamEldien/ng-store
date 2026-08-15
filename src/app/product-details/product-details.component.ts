import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../model/product.type';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {

  seo = inject(SeoService);
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  product = signal<Product | null>(null);
  selectedImage = signal<String>('');
  loading = signal<boolean>(true);
  error = signal<String | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.getProductById(id).subscribe({
        next: (product) => {
          this.product.set(product);
          this.selectedImage.set(product.images[0]);
          this.loading.set(false);
          this.updateSeo();
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.message || 'Failed to load product details');
        }
      });
    }
  }

  private updateSeo() {
    const p = this.product();
    if (!p) return;

    this.seo.updateTitle(p.title);
    this.seo.updateDescription(p.description);
    this.seo.updateKeywords(p.category);
    this.seo.updateOgTitle(p.title);
    this.seo.updateOgDescription(p.description);
    this.seo.updateOgImage(p.thumbnail);
  }
}
