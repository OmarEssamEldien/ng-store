import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../model/product.type';

export const productDetailsResolver: ResolveFn<Product> = (route) => {
  const productsService = inject(ProductsService);
  const id = route.paramMap.get('id')!;
  return productsService.getProductById(id);
};
