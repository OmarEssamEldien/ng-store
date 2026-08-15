import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsComponent } from '../components/products/products.component';

@Component({
  selector: 'app-home',
  imports: [ProductsComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
