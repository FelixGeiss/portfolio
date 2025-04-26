import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../services/language.service';

interface LegalNoticeData {
  title: string;
  providerTitle: string;
  providerName: string;
  addressLines: string[];
  contactTitle: string;
  contactEmail: string;
}

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrls: ['./legal-notice.component.scss']
})
export class LegalNoticeComponent implements OnInit, OnDestroy {
  // Data model for legal notice
  data!: LegalNoticeData;

  // Subscription for language changes
  private sub!: Subscription;

  // Current selected language
  currentLang: Lang = 'de';

  // Inject HttpClient and LanguageService
  constructor(
    private http: HttpClient,
    private langSvc: LanguageService
  ) {}

  // Subscribe to language changes on initialization
  ngOnInit(): void {
    this.sub = this.langSvc.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadData();
      });
  }

  // Unsubscribe to prevent memory leaks
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Fetch legal notice data based on current language
  private loadData(): void {
    this.http
      .get<{ legalNotice: LegalNoticeData }>(
        `assets/content.${this.currentLang}.json`
      )
      .subscribe(res => this.data = res.legalNotice);
  }
}
