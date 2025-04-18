import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Project } from './project.model';
import { NgStyle } from '@angular/common'; 

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [NgStyle] 
})
export class ProjectsComponent {
  @ViewChild('hoveredVideo', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  @Input() project!: Project;
  @Input() isRowReverse: boolean = false;

  playVideo() {
    const vid = this.videoRef.nativeElement;
    vid.muted = true;
    vid
      .play()
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Video-Play-Fehler:', err);
        }
        // AbortError ignorieren
      });
  }
  

  resetVideo() {
    const vid = this.videoRef.nativeElement;
    vid.pause();
    vid.currentTime = 0;
  }
}