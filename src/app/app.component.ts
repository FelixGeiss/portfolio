import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from "./hero/hero.component";
import { AboutComponent } from "./about/about.component";
import { SkillsComponent } from "./skills/skills.component";
import { ProjectsComponent } from "./projects/projects.component";
import { TestimonialsComponent } from "./testimonials/testimonials.component";
import { ContactComponent } from "./contact/contact.component";
import { FooterComponent } from "./footer/footer.component";
import { NavComponent } from "./nav/nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HeroComponent, AboutComponent, SkillsComponent, ProjectsComponent, TestimonialsComponent, ContactComponent, FooterComponent, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
}
