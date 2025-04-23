// testimonials.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { HttpClient }                    from '@angular/common/http';
import { DomSanitizer, SafeHtml }        from '@angular/platform-browser';
import { Subscription }                  from 'rxjs';
import { LanguageService, Lang }         from '../../services/language.service';

interface TestimonialContent {
  header:   string;
  name1:    string;
  project1: string;
  content1: string;
  name2:    string;
  project2: string;
  content2: string;
  name3:    string;
  project3: string;
  content3: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  /** Roher JSON-Inhalt */
  content!: TestimonialContent;
  /** Sanitized HTML-Inhalte */
  safe: Record<keyof TestimonialContent, SafeHtml> = {} as any;

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

  private loadContent(): void {
    this.http
      .get<{ testimonial: TestimonialContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.testimonial;
        // Alle Felder sanitizen
        (Object.keys(this.content) as Array<keyof TestimonialContent>).forEach(key => {
          this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(this.content[key]);
        });
      });
  }
}
