import { Component, OnInit } from '@angular/core';
import { TinyTranslatorService, TranslationProject } from '../../shared/services';
import { ProjectService } from './projects.service';
import { Router } from '@angular/router';
// import { TinyTranslatorService } from '@shared/services';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: TranslationProject[];

  constructor(
    private translatorService: TinyTranslatorService,
    private proj: ProjectService,
    private router: Router
  ) {
    this.projects = this.translatorService.projects();
  }

  ngOnInit() {}

  addProjects() {
    this.proj.openDialog().subscribe(e => e && this.router.navigateByUrl('/translate'));
  }
}
