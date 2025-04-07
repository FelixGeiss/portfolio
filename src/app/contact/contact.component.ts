import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  isChecked: boolean = false;

  isCheckt(event: Event) {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
    console.log(this.isChecked);
  }
}
