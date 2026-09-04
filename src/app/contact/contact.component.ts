import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  isSubmitted = signal<boolean>(false);

  formData = {
    name: '',
    email: '',
    subject: 'general',
    message: ''
  };

  onSubmit() {
    if (this.formData.name && this.formData.email && this.formData.message) {
      // Send to Backend API Here
      this.isSubmitted.set(true);
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: 'general',
      message: ''
    };
    this.isSubmitted.set(false);
  }
}
