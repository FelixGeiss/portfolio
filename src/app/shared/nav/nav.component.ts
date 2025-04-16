import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  // Boolean-Variable, die den Zustand des Menüs speichert
  menuOpen: boolean = false;

  // Methode zum Wechseln des Zustands
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}

