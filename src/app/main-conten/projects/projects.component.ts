import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from './project.model';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  /**
   * Projects in English and German for input
   */
  @Input() projectsEn: Project[] = [];
  @Input() projectsDe: Project[] = [];

  /**
   * Currently displayed projects
   */
  displayedProjects: Project[] = [];
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(private languageService: LanguageService) {}

  /**
   * Subscribe to language changes
   */
  ngOnInit(): void {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => this.onLanguageChange(lang));
  }

  /**
   * Unsubscribe from language changes
   */
  ngOnDestroy(): void {
    this.langSub.unsubscribe();
  }

  /**
   * Handle language update and reload projects
   */
  private onLanguageChange(lang: Lang): void {
    this.currentLang = lang;
    this.updateDisplayedProjects();
  }

  /**
   * Load projects based on current language
   */
  private updateDisplayedProjects(): void {
    this.displayedProjects =
      this.currentLang === 'de' ? this.projectsDe : this.projectsEn;
  }

  /**
   * Play video silently and handle playback errors
   */
  playVideo(video: HTMLVideoElement): void {
    video.muted = true;
    video.play().catch(err => this.handleVideoError(err));
  }

  /**
   * Pause and reset video playback
   */
  resetVideo(video: HTMLVideoElement): void {
    video.pause();
    video.currentTime = 0;
  }

  /**
   * Log non-abort errors during video playback
   */
  private handleVideoError(err: any): void {
    if (err.name !== 'AbortError') {
      console.error('Video playback error:', err);
    }
  }
}
