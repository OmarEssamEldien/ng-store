import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'products',
        pathMatch: 'full',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
    },
    {
        path: 'products/:id',
        pathMatch: 'full',
        loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent)
    }

];
