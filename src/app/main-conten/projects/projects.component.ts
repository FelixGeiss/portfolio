import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from './project.model';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';
import { ScrollAnimationDirective } from '../../services/animation.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,ScrollAnimationDirective],
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
  private videoFallbacks = new Set<string>();
  private videoLoaded = new Set<string>();

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
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      return;
    }
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
   * Switch to poster-only fallback for videos that failed to load
   */
  setVideoFallback(videoUrl: string): void {
    this.videoFallbacks.add(videoUrl);
  }

  /**
   * Check if a video should show the poster fallback
   */
  isVideoFallback(videoUrl: string): boolean {
    return this.videoFallbacks.has(videoUrl);
  }

  /**
   * Mark video as loaded so the poster overlay can be removed
   */
  setVideoLoaded(videoUrl: string): void {
    this.videoLoaded.add(videoUrl);
  }

  /**
   * Check if a video has finished loading enough to display
   */
  isVideoLoaded(videoUrl: string): boolean {
    return this.videoLoaded.has(videoUrl);
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
