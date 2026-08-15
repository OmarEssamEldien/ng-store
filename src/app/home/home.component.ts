import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsComponent } from '../components/products/products.component';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  imports: [ProductsComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateTitle('NG Store - Home');
    this.seo.updateDescription('Explore our wide collection of premium products at great prices.');
    this.seo.updateKeywords('store, shopping, electronics, clothing');
    this.seo.updateOgTitle('NG Store');
    this.seo.updateOgDescription('Explore our wide collection of premium products.');
    this.seo.updateOgImage('https://dummyjson.com/image/og-preview.jpg');
  }
}
