import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }           from '@angular/common';
import { HttpClient }             from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription }           from 'rxjs';
import { LanguageService, Lang }  from '../../services/language.service';
import { ScrollAnimationDirective } from '../../services/animation.directive';

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
  imports: [CommonModule,ScrollAnimationDirective ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  // Holds the content loaded from JSON
  content!: AboutContent;

  // Stores sanitized HTML for each content field
  safe: Record<keyof AboutContent, SafeHtml> = {} as any;

  // Tracks the current language (default is German)
  currentLang: Lang = 'de';

  // Subscription reference to clean up on destroy
  private langSub!: Subscription;

  constructor(
    private http: HttpClient,                    // For fetching JSON files
    private sanitizer: DomSanitizer,             // To sanitize HTML content
    private languageService: LanguageService     // Service to get/set current language
  ) {}

  ngOnInit(): void {
    // Subscribe to language changes
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;  // Update current language
        this.loadContent();       // Reload content for the new language
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.langSub.unsubscribe();
  }

  /**
   * Loads the about content JSON for the current language,
   * assigns it to this.content, and sanitizes each field for safe HTML binding.
   */
  private loadContent() {
    // Fetch the JSON file matching the current language
    this.http
      .get<{ about: AboutContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.about;

        // Sanitize each HTML string property
        for (const key of Object.keys(this.content) as Array<keyof AboutContent>) {
          this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(this.content[key]);
        }
      });
  }
}
