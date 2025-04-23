import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { HttpClient }                from '@angular/common/http';
import { DomSanitizer, SafeHtml }    from '@angular/platform-browser';
import { Subscription }              from 'rxjs';
import { LanguageService, Lang }     from '../../services/language.service';

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
  content!: SkillsContent;
  safe: Record<keyof SkillsContent, SafeHtml> = {} as any;
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
      .get<{ skills: SkillsContent }>(`assets/content.${this.currentLang}.json`)
      .subscribe(json => {
        this.content = json.skills;
        // HTML‑Strings sanitizen
        for (const key of Object.keys(this.content) as Array<keyof SkillsContent>) {
          this.safe[key] = this.sanitizer.bypassSecurityTrustHtml(this.content[key]);
        }
      });
  }
}
