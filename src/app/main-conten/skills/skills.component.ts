import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

interface SkillsContent {
  mySkills: string;
  ChallengeMe: string;
  ChallengeMeContent: string;
  letsTalk: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {
  // Raw content from JSON and sanitized HTML versions
  content!: SkillsContent;
  safe: Record<keyof SkillsContent, SafeHtml> = {} as any;

  // Current language and subscription handle
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  // Inject HttpClient, DomSanitizer and LanguageService
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
        this.loadContent();
      });
  }

  // Unsubscribe from language changes to prevent memory leaks
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  // Load content JSON and sanitize HTML strings
  private loadContent(): void {
    this.http
      .get<{ skills: SkillsContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.skills;
        // Sanitize each HTML field in content
        for (const key of Object.keys(this.content) as Array<keyof SkillsContent>) {
          this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(
            this.content[key]
          );
        }
      });
  }
}
