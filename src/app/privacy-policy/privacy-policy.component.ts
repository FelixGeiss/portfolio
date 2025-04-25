// privacy-policy.component.ts
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
  private langSub!: Subscription;
  currentLang: Lang = 'de';
  safePrivacy!: SafeHtml;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadPolicy();
      });
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  private loadPolicy(): void {
    this.http
      .get<PrivacyContent>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.safePrivacy = this.sanitizer.bypassSecurityTrustHtml(json.privacyPolicy);
      });
  }
}