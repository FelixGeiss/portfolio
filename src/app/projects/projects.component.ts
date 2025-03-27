import { Component } from '@angular/core';
import { ProjectGalleryComponent } from "../project-gallery/project-gallery.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectGalleryComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

}
