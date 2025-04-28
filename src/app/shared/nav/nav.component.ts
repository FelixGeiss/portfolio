import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

type NavItems = {
  whyMe: string;
  skills: string;
  projects: string;
  contact: string;
};

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  // Toggle state for mobile menu visibility
  menuOpen = false;

  // Observable for current language
  currentLang$ = this.languageService.currentLang$;
  private langSub!: Subscription;

  // Raw navigation labels and their sanitized HTML versions
  nav!: NavItems;
  safeNav: Record<keyof NavItems, SafeHtml> = {} as any;

  // Inject LanguageService, HttpClient, and DomSanitizer
  constructor(
    private languageService: LanguageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  // Subscribe to language changes on component init
  ngOnInit(): void {
    this.langSub = this.currentLang$
      .subscribe(lang => this.loadNavItems(lang));
  }

  // Unsubscribe to avoid memory leaks
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  // Toggle the mobile menu open/close state
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Close the mobile menu
  closeMenu(): void {
    this.menuOpen = false;
  }

  // Switch application language
  switchLang(lang: Lang): void {
    this.languageService.setLang(lang);
  }

  // Load navigation labels from JSON and sanitize HTML
  private loadNavItems(lang: Lang): void {
    this.http
      .get<{ nav: NavItems }>(`assets/content.${lang}.json`)
      .subscribe(json => {
        this.nav = json.nav;
        // Sanitize each navigation label for safe HTML binding
        (Object.keys(this.nav) as Array<keyof NavItems>)
          .forEach(key => {
            this.safeNav[key] =
              this.sanitizer.bypassSecurityTrustHtml(this.nav[key]);
          });
      });
  }
}
