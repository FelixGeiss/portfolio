import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Project } from './project.model';
import { Subscription } from 'rxjs';
import { LanguageService, Lang } from '../../services/language.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, NgStyle],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  /** Inputs für EN- und DE-Projekte */
  @Input() projectsEn: Project[] = [];
  @Input() projectsDe: Project[] = [];

  /** Aktuell angezeigte Projekte */
  displayedProjects: Project[] = [];
  isRowReverse = false;
  currentLang: Lang = 'de';
  private langSub!: Subscription;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.langSub = this.languageService.currentLang$
      .subscribe(lang => {
        this.currentLang = lang;
        this.displayedProjects = lang === 'de' ? this.projectsDe : this.projectsEn;
      });
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }

  /** Video abspielen – Element als Parameter übergeben */
  playVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play().catch(err => {
      if (err.name !== 'AbortError') {
        console.error('Video-Play-Fehler:', err);
      }
    });
  }

  /** Video zurücksetzen */
  resetVideo(video: HTMLVideoElement) {
    video.pause();
    video.currentTime = 0;
  }
}
