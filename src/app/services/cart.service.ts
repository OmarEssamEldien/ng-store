import { computed, effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CartItem } from '../model/cart-item.type';
import { Product } from '../model/product.type';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private storageKey = 'ng_store_cart';

  // Sidebar open/close state
  isOpen = signal<boolean>(false);

  // Cart items
  cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  constructor() {
    effect(() => {
      if (this.isBrowser) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems()))
      }
    })
  }

  // load cart from localeStorage
  private loadCartFromStorage(): CartItem[] {
    if (this.isBrowser) {
      try {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Error loading cart from localeStorage', e);
        return [];
      }
    }
    return [];
  }


  // Computed properties
  totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  subtotal = computed(() =>
    this.cartItems().reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )
  );

  toggleCart() {
    this.isOpen.update((open) => !open);
  }

  openCart() {
    this.isOpen.set(true);
  }

  closeCart() {
    this.isOpen.set(false);
  }

  addToCart(product: Product, quantity = 1) {
    this.cartItems.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        this.openCart(); // open sidebar after adding an item
      }
      return [...items, { product, quantity }];
    });

  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }
    this.cartItems.update((items) =>
      items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    )
  }

  removeFromCart(productId: number) {
    this.cartItems.update((items) =>
      items.filter((i) => i.product.id !== productId)
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  // Get item quantity
  getItemQuantity(productId: number): number {
    const item = this.cartItems().find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  }
}
