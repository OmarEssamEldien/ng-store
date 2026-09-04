import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../model/product.type';
import { delay } from 'rxjs';

export const productDetailsResolver: ResolveFn<Product> = (route) => {
  const productsService = inject(ProductsService);
  const id = route.paramMap.get('id')!;
  return productsService.getProductById(id).pipe(delay(500)); // Delay for testing loader
};
