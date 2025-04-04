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
import { Project } from "./project.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent, 
    TestimonialsComponent,
    ContactComponent,
    FooterComponent,
    NavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio';
  projects: Project[] = [
    {
      title: 'Join',
      imageUrl: 'assets/img/test-bild-join.png',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      githubLink: 'https://github.com/dein-benutzer/join',
      liveTestLink: 'https://dein-benutzer.github.io/join/'
    },
    {
      title: 'Sharkie',
      imageUrl: 'assets/img/test-bild-join.png',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      githubLink: 'https://github.com/dein-benutzer/sharkie',
      liveTestLink: 'https://dein-benutzer.github.io/sharkie/'
    },
    {
      title: 'Pollo Loco',
      imageUrl: 'assets/img/test-bild-join.png',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tobacco salsa to fight against the crazy hen.',
      githubLink: 'https://github.com/dein-benutzer/pollo-loco',
      liveTestLink: 'https://dein-benutzer.github.io/pollo-loco/'
    }
  ];

}