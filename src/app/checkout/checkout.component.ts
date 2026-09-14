import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrderPayload, OrderService } from '../services/order.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, TitleCasePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private seoService = inject(SeoService);
  cart = signal(this.cartService.cartItems());

  constructor() {
    // if cart is empty redirect to products page
    // check if isSubmitting to avoid redirecting
    effect(() => {
      if (!this.isSubmitting() && this.cartService.cartItems().length === 0) {
        this.router.navigate(['/products']);
      }
    })

    this.seoService.updateTitle('NG Store - Checkout');
  }

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  shippingForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    street: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required]],
    country: ['EG', [Validators.required]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-()]{8,20}$/)]],
  })

  isFieldInvalid(fieldName: string): boolean {
    const control = this.shippingForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    // 1. validate form
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    // 2. prepare payload
    const payload: OrderPayload = {
      userId: 1, // just for testing
      customer: this.shippingForm.getRawValue() as any,
      products: this.cartService.cartItems().map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      })),
      paymentMethod: 'COD'
    }

    // 3. send to api
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.orderService.createOrder(payload).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        this.router.navigate(['/checkout/success'], {
          state: { order: response, payload: payload }
        })

        // // clear cart after navigation to avoid effect to redirect to products page
        // setTimeout(() => {
        // this.cartService.clearCart();
        // }, 100)
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.message || 'Something went wrong. Please try again.');
        console.error('Order submission failed:', error);
      }
    })
  }
}

