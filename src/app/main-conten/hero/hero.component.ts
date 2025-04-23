import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

interface HeroContent {
  contactME: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  content!: HeroContent;
  safeContactME!: SafeHtml;
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
        this.loadContent();
      });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private loadContent() {
    this.http
      .get<{ hero: HeroContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.hero;
        this.safeContactME = this.sanitizer.bypassSecurityTrustHtml(this.content.contactME);
      });
  }
}
