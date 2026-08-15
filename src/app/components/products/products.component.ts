import { afterNextRender, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/product.type';
import { RouterLink } from "@angular/router";
import { SeoService } from '../../services/seo.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, delay, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe, FormsModule, TitleCasePipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  seo = inject(SeoService);

  ps = inject(ProductsService);

  destroyRef = inject(DestroyRef);

  initialMaxPrice = signal(3000);

  limit = input<number>(12);

  showFilter = input<boolean>(true);

  totalPages = signal(1);

  isLoading = signal(false);

  // Main data signal
  products = signal<Array<Product>>([]);

  // Filter Signals
  searchTerm = signal('');
  selectedCategory = signal('all');
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
  onFilterChange() {
    this.currentPage.set(1);
  }

  // Extract unique categories from products
  categories = computed(() => {
    const list = this.products().map(p => p.category);
    return ['all', ...Array.from(new Set(list))];
  });

  // Reactive filtered products list
  filteredProducts = computed(() => {
    // const search = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();
    const maxPrice = this.maxPrice();

    return this.products().filter(product => {
      // const matchesSearch = !search ||
      //   product.title.toLowerCase().includes(search) ||
      //   product.description.toLowerCase().includes(search);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price <= maxPrice;
      return matchesCategory && matchesPrice;
    });
  })

  constructor() {
    // 1. Debounce search input and trigger API search
    toObservable(this.searchTerm)
      .pipe(
        debounceTime(350),           // Wait 350ms after the user stops typing
        distinctUntilChanged(),      // Only trigger if the query actually changed
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.currentPage.set(1);     // Reset to page 1 on new search
        this.loadProducts();
      });

    afterNextRender(() => {
      console.log(this.products());
    })
  }

  ngOnInit(): void {
    if (this.showFilter()) { // Not HomePage
      this.seo.updateTitle('NG Store - Products');
    }
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true); // Start loading
    const skip = (this.currentPage() - 1) * this.limit();

    this.ps
      .getProducts(this.limit(), skip, this.searchTerm())
      .pipe(delay(300))
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
