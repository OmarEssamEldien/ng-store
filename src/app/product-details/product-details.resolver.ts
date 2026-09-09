import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Product } from '../model/product.type';
import { catchError, delay, EMPTY } from 'rxjs';

export const productDetailsResolver: ResolveFn<Product> = (route) => {
  const productsService = inject(ProductsService);
  const id = route.paramMap.get('id')!;
  const router = inject(Router);

  return productsService.getProductById(id).pipe(
    delay(500),
    catchError((err) => {
      console.error('Failed to load product details:', err);
      // Redirect to a 404 page or back to the catalog
      router.navigate(['/404']); // or router.navigate(['/404']);
      return EMPTY; // Cancels navigation cleanly
    })
  ); // Delay for testing loader
};
