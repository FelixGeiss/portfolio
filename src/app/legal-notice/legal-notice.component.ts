// legal-notice.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                from '@angular/common';
import { HttpClient }                  from '@angular/common/http';
import { Subscription }                from 'rxjs';
import { LanguageService, Lang }       from '../services/language.service';

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
  data!: LegalNoticeData;
  currentLang: Lang = 'de';
  private sub!: Subscription;

  constructor(
    private http: HttpClient,
    private langSvc: LanguageService
  ) {}

  ngOnInit() {
    this.sub = this.langSvc.currentLang$.subscribe(lang => {
      this.currentLang = lang;
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private loadData() {
    this.http
      .get<{ legalNotice: LegalNoticeData }>(`assets/content.${this.currentLang}.json`)
      .subscribe(res => this.data = res.legalNotice);
  }
}
