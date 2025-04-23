import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { HeroComponent } from '../hero/hero.component';
import { ProjectsComponent } from '../projects/projects.component';
import { SkillsComponent } from '../skills/skills.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { Project } from '../projects/project.model';

@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    TestimonialsComponent,
    ContactComponent,
    CommonModule
  ],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy {
  title = 'portfolio';

  projectsEn: Project[] = [
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
      description: 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and salsa to fight against the crazy hen.',
      githubLink: 'https://github.com/FelixGeiss/El-Pollo-Loco',
      liveTestLink: 'http://el-pollo-loco.felixgeiss.de/'
    }
  ];

  projectsDe: Project[] = [
    {
      title: 'Join',
      videoUrl: 'assets/Video/Aufzeichnung join.mp4',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Aufgabenmanager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag-and-Drop, weise Benutzer und Kategorien zu.',
      githubLink: 'https://github.com/NathalieDorendorf/join-406',
      liveTestLink: 'http://join.felixgeiss.de/index.html'
    },
    {
      title: 'Sharkie',
      videoUrl: 'assets/img/test-bild-join.png',
      technologies: ['Angular', 'TypeScript', 'HTML', 'CSS', 'Firebase'],
      description: 'Aufgabenmanager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag-and-Drop, weise Benutzer und Kategorien zu.',
      githubLink: 'https://github.com/dein-benutzer/sharkie',
      liveTestLink: 'https://dein-benutzer.github.io/sharkie/'
    },
    {
      title: 'Pollo Loco',
      videoUrl: 'assets/Video/Aufzeichnung el pollo loco.mp4',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      description: 'Spring-, Lauf- und Wurfspiel basierend auf einem objektorientierten Ansatz. Hilf Pepe, Münzen und Salsa zu finden, um gegen das verrückte Huhn zu kämpfen.',
      githubLink: 'https://github.com/FelixGeiss/El-Pollo-Loco',
      liveTestLink: 'http://el-pollo-loco.felixgeiss.de/'
    }
  ];

  safeMyProjects!: SafeHtml;
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadProjectHeading(lang);
      });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private loadProjectHeading(lang: Lang): void {
    this.http
      .get<{ project: { myProjects: string } }>(`assets/content.${lang}.json`)
      .subscribe(json => {
        this.safeMyProjects = this.sanitizer.bypassSecurityTrustHtml(
          json.project.myProjects
        );
      });
  }
}
