import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { HttpClient }                    from '@angular/common/http';
import { DomSanitizer, SafeHtml }        from '@angular/platform-browser';
import { Subscription }                  from 'rxjs';
import { LanguageService, Lang }         from '../../services/language.service';

type NavItems = {
  whyMe:    string;
  skills:   string;
  projects: string;
  contact:  string;
};

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  menuOpen = false;
  currentLang$ = this.languageService.currentLang$;
  private langSub!: Subscription;

  nav!: NavItems;
  safeNav: Record<keyof NavItems, SafeHtml> = {} as any;

  constructor(
    private languageService: LanguageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.langSub = this.currentLang$
      .subscribe(lang => this.loadNav(lang));
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  switchLang(lang: Lang) {
    this.languageService.setLang(lang);
  }

  private loadNav(lang: Lang) {
    this.http
      .get<{ nav: NavItems }>(`assets/content.${lang}.json`)
      .subscribe(json => {
        this.nav = json.nav;

       
        for (const key of Object.keys(this.nav) as Array<keyof NavItems>) {
          this.safeNav[key] =
            this.sanitizer.bypassSecurityTrustHtml(this.nav[key]);
        }
      });
  }
}
