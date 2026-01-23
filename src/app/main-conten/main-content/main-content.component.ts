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
  // Localized project lists
  projectsEn: Project[] = this.getProjects('en');
  projectsDe: Project[] = this.getProjects('de');

  // Sanitized HTML for section heading
  safeMyProjects!: SafeHtml;
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  /**
   * Subscribe to language changes
   */
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => this.onLangChange(lang));
  }

  /**
   * Unsubscribe on destroy
   */
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  /**
   * Handle language switch
   */
  private onLangChange(lang: Lang): void {
    this.currentLang = lang;
    this.loadProjectHeading(lang);
  }

  /**
   * Fetch and sanitize heading from JSON
   */
  private loadProjectHeading(lang: Lang): void {
    this.http.get<{ project: { myProjects: string } }>(
      `assets/content.${lang}.json`
    ).subscribe(json => this.setHeading(json.project.myProjects));
  }

  /**
   * Set sanitized heading
   */
  private setHeading(html: string): void {
    this.safeMyProjects = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * Return project array based on lang
   */
  private getProjects(lang: Lang): Project[] {
    const common: Omit<Project, 'description'>[] = [
      {
        title: 'Join',
        videoUrl: 'assets/Video/Aufzeichnung join.webm',
        posterUrl: 'assets/img/video-posters/Join.png',
        technologies: ['JavaScript', 'HTML', 'CSS', 'Firebase'],
        githubLink: 'https://github.com/FelixGeiss/join-felix',
        liveTestLink: 'http://join.felixgeiss.de/index.html'
      },
      {
        title: 'El Pollo Loco',
        videoUrl: 'assets/Video/Aufzeichnung el pollo loco.webm',
        posterUrl: 'assets/img/video-posters/El Pollo Loco.png',
        technologies: ['JavaScript', 'HTML', 'CSS'],
        githubLink: 'https://github.com/FelixGeiss/El-Pollo-Loco',
        liveTestLink: 'http://el-pollo-loco.felixgeiss.de/'
      },
      {
        title: 'Aufguss Manager',
        videoUrl: 'assets/Video/Aufzeichnung Aufguss Manager.webm',
        posterUrl: 'assets/img/video-posters/Aufguss Manager.png',
        technologies: ['JavaScript', 'HTML', 'CSS', 'PHP', 'MySQL', 'Codex'],
        githubLink: 'https://github.com/FelixGeiss/AufgussManager',
        liveTestLink: 'https://aufgussmanager.felixgeiss.de/'
      },
      {
        title: 'Pokedex',
        videoUrl: 'assets/Video/Aufzeichnung pokedex.webm',
        posterUrl: 'assets/img/video-posters/Pokedex.png',
        technologies: ['JavaScript', 'HTML', 'CSS', 'Pokémon API'],
        githubLink: 'https://github.com/FelixGeiss/pokedex',
        liveTestLink: 'http://pokedex.felixgeiss.de/'
      }
    ];
  
    return common.map(proj => ({
      ...proj,
      description:
        lang === 'de'
          ? this.getGermanDesc(proj.title)
          : this.getEnglishDesc(proj.title)
    }));
  }
  

  /**
   * Map English descriptions
   */
  private getEnglishDesc(title: string): string {
    switch (title) {
      case 'Join': return 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.';
      case 'Pokedex': return 'Pokedex web application that uses the Poke API to fetch and display Pokémon data and images. Try it now and discover your favorite Pokémon!';
      case 'El Pollo Loco': return 'Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and salsa to fight against the crazy hen.';
      case 'Aufguss Manager': return 'Aufguss Manager is a tool to manage digital infusions, create surveys, and increase productivity in a sauna landscape.';
    }
    return '';
  }

  /**
   * Map German descriptions
   */
  private getGermanDesc(title: string): string {
    switch (title) {
      case 'Join': return 'Aufgabenmanager inspiriert vom Kanban-System. Erstelle und organisiere Aufgaben per Drag-and-Drop, weise Benutzer und Kategorien zu.';
      case 'Pokedex': return 'Pokédex-Webanwendung, die die Poke API nutzt, um Pokémon-Daten und -Bilder abzurufen und anzuzeigen. Probier es jetzt aus und entdecke deine Lieblings-Pokémon!';
      case 'El Pollo Loco': return 'Spring-, Lauf- und Wurfspiel basierend auf einem objektorientierten Ansatz. Hilf Pepe, Münzen und Salsa zu finden, um gegen das verrückte Huhn zu kämpfen.';
      case 'Aufguss Manager': return 'Aufguss Manager ist ein Tool, mit dem man digitale Aufgüsse verwalten, Umfragen erstellen und die Produktivität in einer Saunalandschaft steigern kann.';
    }
    return '';
  }
}


