import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Product } from '../model/product.type';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  http = inject(HttpClient);

  getProducts(limit: number = 12, skip: number = 0, query: string = ''): Observable<Product[]> {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      url = `https://dummyjson.com/products/search?q=${trimmedQuery}&limit=${limit}&skip=${skip}`;
    }
    return this.http.get(url).pipe(map((res: any) => res));
  }

  getProductById(id: string | number): Observable<Product> {
    return this.http.get<Product>(`https://dummyjson.com/products/${id}`);
  }
}
