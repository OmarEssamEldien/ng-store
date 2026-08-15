import { afterNextRender, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../model/product.type';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, DecimalPipe, FormsModule, TitleCasePipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  ps = inject(ProductsService);

  initialMaxPrice = signal(200);

  limit = input<number>(20);

  // Main data signal
  products = signal<Array<Product>>([]);

  // Filter Signals
  searchTerm = signal('');
  selectedCategory = signal('all');
  maxPrice = signal(this.initialMaxPrice());

  // Extract unique categories from products
  categories = computed(() => {
    const list = this.products().map(p => p.category);
    return ['all', ...Array.from(new Set(list))];
  });

  // Reactive filtered products list
  filteredProducts = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();
    const maxPrice = this.maxPrice();
    console.log(search);

    return this.products().filter(product => {
      const matchesSearch = !search ||
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search);
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    }).slice(0, this.limit());
  })

  constructor() {
    afterNextRender(() => {
      console.log(this.products());
    })
  }

  ngOnInit(): void {
    this.ps.getProducts().subscribe({
      next: (res: any) => {
        this.products.set(res);
      },
      error: (err) => {
        console.error('Error fetching products on client:', err);
      }
    });
  }
}
