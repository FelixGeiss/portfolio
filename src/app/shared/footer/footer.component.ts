import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

interface FooterContent {
  legalNotice: string;
  privacyPolicy: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  // Sanitized HTML for legal notice
  safeLegalNotice!: SafeHtml;

  // Sanitized HTML for privacy policy link or text
  safePrivacyPolicy!: SafeHtml;

  // Subscription for language changes
  private langSub!: Subscription;

  // Current selected language
  currentLang: Lang = 'de';

  // Inject HttpClient, DomSanitizer, and LanguageService
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  // Subscribe to language changes on component init
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadFooterTexts(lang);
      });
  }

  // Cleanup subscription on component destroy
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  // Load footer texts from JSON and sanitize HTML
  private loadFooterTexts(lang: Lang): void {
    this.http.get<{ footer: FooterContent }>(
      `assets/content.${lang}.json`
    ).subscribe(json => {
      const foot = json.footer;
      this.safeLegalNotice = this.sanitizer.bypassSecurityTrustHtml(
        foot.legalNotice
      );
      this.safePrivacyPolicy = this.sanitizer.bypassSecurityTrustHtml(
        foot.privacyPolicy
      );
    });
  }
}
