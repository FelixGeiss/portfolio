import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../services/language.service';

interface PrivacyContent {
  privacyPolicy: string;
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit, OnDestroy {
  // Subscription for language changes
  private langSub!: Subscription;

  // Current language and sanitized policy HTML
  currentLang: Lang = 'de';
  safePrivacy!: SafeHtml;

  // Inject HttpClient, DomSanitizer, and LanguageService
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  // Subscribe to language changes on init
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadPolicy();
      });
  }

  // Unsubscribe to prevent memory leaks
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  // Fetch and sanitize privacy policy HTML
  private loadPolicy(): void {
    this.http
      .get<PrivacyContent>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.safePrivacy = this.sanitizer.bypassSecurityTrustHtml(
          json.privacyPolicy
        );
      });
  }
}
