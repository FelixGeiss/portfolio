// legal-notice.component.ts
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
  // Jetzt nullable initialisiert
  data: LegalNoticeData | null = null;

  private sub!: Subscription;
  currentLang: Lang = 'de';

  constructor(
    private http: HttpClient,
    private langSvc: LanguageService
  ) {}

  ngOnInit(): void {
    this.sub = this.langSvc.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadData();
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private loadData(): void {
    this.http
      .get<{ legalNotice: LegalNoticeData }>(
        `assets/content.${this.currentLang}.json`
      )
      .subscribe(res => this.data = res.legalNotice);
  }
}
