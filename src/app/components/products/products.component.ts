import { afterNextRender, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/product.type';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { SeoService } from '../../services/seo.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';
import { Category } from '../../model/category.type';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  private route = inject(ActivatedRoute);

  seo = inject(SeoService);

  ps = inject(ProductsService);

  cartService = inject(CartService);

  destroyRef = inject(DestroyRef);

  initialMaxPrice = signal(3000);

  // Sort by and order
  sortBy = signal('');
  orderBy = signal('');
  sortOption = signal('');

  limit = input<number>(12);

  showFilter = input<boolean>(true);

  totalPages = signal(1);

  isLoading = signal(false);

  // Main data signal
  products = signal<Array<Product>>([]);

  // Filter Signals
  searchTerm = signal('');
  selectedCategory = signal('');
  maxPrice = signal(this.initialMaxPrice());

  currentPage = signal(1); // Current page number

  // Limit visible pagination links to 5 around currentPage
  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  // Helper pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadProducts();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
  firstPage() {
    this.goToPage(1);
  }
  lastPage() {
    this.goToPage(this.totalPages());
  }
  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }
  prevPage() {
    this.goToPage(this.currentPage() - 1);
  }
  onSortByChange(value: string) {
    const [sortBy, orderBy] = value.split(':');
    this.sortBy.set(sortBy);
    this.orderBy.set(orderBy);
    this.currentPage.set(1);
    this.loadProducts();
  }
  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
    this.loadProducts();
  }

  // Get Categories from API
  categories = signal<Category[]>([]);

  loadCategories() {
    this.ps.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    })
  }


  // Reactive filtered products list
  filteredProducts = computed(() => {
    return this.products();
  })

  constructor() {
    // 1. Debounce search input and trigger API search (skip initial emission)
    toObservable(this.searchTerm)
      .pipe(
        skip(1),
        debounceTime(350),           // Wait 350ms after the user stops typing
        distinctUntilChanged(),      // Only trigger if the query actually changed
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentPage.set(1);     // Reset to page 1 on new search
        this.loadProducts();
      });
  }

  ngOnInit(): void {
    if (this.showFilter()) { // Not HomePage
      this.seo.updateTitle('NG Store - Products');
    }
    this.loadCategories();

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const query = params.get('search') || '';
        const category = params.get('category') || '';
        this.selectedCategory.set(category);
        this.searchTerm.set(category ? '' : query);
        this.currentPage.set(1);
        this.loadProducts();
      });
  }

  loadProducts() {
    this.isLoading.set(true); // Start loading
    const skip = (this.currentPage() - 1) * this.limit();

    this.ps
      .getProducts(this.searchTerm(), this.limit(), skip, this.sortBy(), this.orderBy(), this.selectedCategory())
      .subscribe({
        next: (res: any) => {
          this.products.set(res.products);
          this.totalPages.set(Math.ceil(res.total / this.limit()));
          this.isLoading.set(false); // Stop loading on success
        },
        error: (err) => {
          console.error('Error fetching products on client:', err);
          this.isLoading.set(false); // Stop loading on error
        }
      });
  }
}
