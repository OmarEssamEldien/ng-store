import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent {

  private router = inject(Router);
  cartService = inject(CartService);

  order = signal<any>(null);
  payload = signal<any>(null);

  constructor() {
    // read data from router state
    const currentNav = this.router.getCurrentNavigation();
    const orderData = currentNav?.extras?.state?.['order'];
    const payloadData = currentNav?.extras?.state?.['payload'];

    if (orderData) {
      this.order.set(orderData);
      this.payload.set(payloadData);

      console.log('order data', orderData);
      console.log('payload', payloadData);

      // empty cart
      this.cartService.clearCart();
    } else {
      this.router.navigate(['/']);
    }
  }

}

