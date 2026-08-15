import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  http = inject(HttpClient);

  getProducts() {
    return this.http.get('https://dummyjson.com/products').pipe(map((res: any) => res.products));
  }
}
