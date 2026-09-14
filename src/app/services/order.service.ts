import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OrderPayload {
  userId: number;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
  };
  products: {
    id: number;
    quantity: number;
  }[];
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/carts/add';

  createOrder(orderData: OrderPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
}
