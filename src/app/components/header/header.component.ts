import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Category } from '../../model/category.type';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private ps = inject(ProductsService);
  private router = inject(Router);

  // Get Categories from API
  categories = signal<Category[]>([]);
  cartService = inject(CartService);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.ps.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  // 3. Navigate to /products with query paramter
  onSearch(query: string) {
    const trimmed = query.trim();
    if (trimmed) {
      this.router.navigate(['/products'], {
        queryParams: { search: trimmed }
      });
    } else {
      this.router.navigate(['/products']);
    }
  }
}
