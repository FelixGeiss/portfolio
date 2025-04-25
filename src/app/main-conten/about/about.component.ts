import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { HttpClient }             from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription }           from 'rxjs';
import { LanguageService, Lang }  from '../../services/language.service';

interface AboutContent {
  whyMeTitle: string;
  whyMeText: string;
  iAm: string;
  located: string;
  openRelocate: string;
  openRemote: string;
  letsTalk: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  content!: AboutContent;
  safe: Record<keyof AboutContent, SafeHtml> = {} as any;
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
      .get<{ about: AboutContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.about;
        for (const key of Object.keys(this.content) as Array<keyof AboutContent>) {
          this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(this.content[key]);
        }
      });
  }
}
