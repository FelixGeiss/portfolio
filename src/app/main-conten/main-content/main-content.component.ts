import { Component } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { HeroComponent } from '../hero/hero.component';
import { ProjectsComponent } from '../projects/projects.component';
import { SkillsComponent } from '../skills/skills.component';
import { CommonModule } from '@angular/common';
import { Project } from '../projects/project.model';
import { TestimonialsComponent } from '../testimonials/testimonials.component';



@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    AboutComponent,
    ContactComponent,
    HeroComponent,
    ProjectsComponent,
    SkillsComponent,
  TestimonialsComponent,
    CommonModule,
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'] 
})
export class MainContentComponent {
  title = 'portfolio';
  projects: Project[] = [
    {
      title: 'Join',
      videoUrl: 'assets/Video/Aufzeichnung join.mp4',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      githubLink: 'https://github.com/NathalieDorendorf/join-406',
      liveTestLink: 'http://join.felixgeiss.de/index.html'
    },
    {
      title: 'Sharkie',
      videoUrl: 'assets/img/test-bild-join.png',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
      githubLink: 'https://github.com/dein-benutzer/sharkie',
      liveTestLink: 'https://dein-benutzer.github.io/sharkie/'
    },
    {
      title: 'Pollo Loco',
      videoUrl: 'assets/Video/Aufzeichnung el pollo loco.mp4',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tobacco salsa to fight against the crazy hen.',
      githubLink: 'https://github.com/FelixGeiss/El-Pollo-Loco',
      liveTestLink: 'http://el-pollo-loco.felixgeiss.de/'
    }
  ];
}
