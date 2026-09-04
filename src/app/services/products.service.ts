import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../model/product.type';
import { Category } from '../model/category.type';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  http = inject(HttpClient);

  getProducts(query: string = '', limit: number = 12, skip: number = 0, sortBy: string = '', order: string = '', category: string = ''): Observable<Product[]> {
    let trimmedQuery = query.trim();
    let url = `https://dummyjson.com/products`;

    if (category) {
      url = `https://dummyjson.com/products/category/${category}`;
    } else if (trimmedQuery) {
      url = `https://dummyjson.com/products/search`;
    }

    let params: Record<string, string | number> = {
      limit,
      skip,
      sortBy,
      order,
    };

    if (trimmedQuery) {
      params['q'] = trimmedQuery;
    }

    return this.http.get(url, { params }).pipe(map((res: any) => res));
  }

  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`https://dummyjson.com/products/${id}`);
  }

  // Get Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('https://dummyjson.com/products/categories');
  }
}
