import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { productDetailsResolver } from './product-details/product-details.resolver';

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
        loadComponent: () => import('./product-details/product-details.component').then(m => m.ProductDetailsComponent),
        resolve: { product: productDetailsResolver }
    },
    {
        path: 'about',
        pathMatch: 'full',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'contact',
        pathMatch: 'full',
        loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
    },

];
