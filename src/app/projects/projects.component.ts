import { Component, Input } from '@angular/core';
import { Project } from '../project.model';
import { NgStyle } from '@angular/common'; 

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [NgStyle] 
})
export class ProjectsComponent {
  @Input() project!: Project;
  @Input() isRowReverse: boolean = false;
}