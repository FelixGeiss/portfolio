import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  isChecked: boolean = false;

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i)
    ]),
    message: new FormControl('', Validators.required)
  });

  isCheckt(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
  }

  onSubmit() {
    if (this.contactForm.valid && this.isChecked) {
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
