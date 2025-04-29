import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';
import { ScrollAnimationDirective } from '../../services/animation.directive';

interface TestimonialContent {
  header: string;
  name1: string;
  project1: string;
  content1: string;
  name2: string;
  project2: string;
  content2: string;
  name3: string;
  project3: string;
  content3: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule,ScrollAnimationDirective],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  // Raw JSON content for testimonials
  content!: TestimonialContent;

  // Sanitized HTML for each testimonial field
  safe: Record<keyof TestimonialContent, SafeHtml> = {} as any;

  // Current language and subscription reference
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  // Inject HttpClient, DomSanitizer, and LanguageService
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {}

  // Subscribe to language changes on initialization
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.loadContent();
      });
  }

  // Unsubscribe to prevent memory leaks when destroying component
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  // Fetch and sanitize testimonial content based on current language
  private loadContent(): void {
    this.http
      .get<{ testimonial: TestimonialContent }>(
        `assets/content.${this.currentLang}.json`
      )
      .subscribe(json => {
        this.content = json.testimonial;
        // Sanitize each HTML string in the content
        (Object.keys(this.content) as Array<keyof TestimonialContent>)
          .forEach(key => {
            this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(
              this.content[key]
            );
          });
      });
  }
}
