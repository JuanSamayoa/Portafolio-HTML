import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: 1,
      title: 'Project 1',
      description: 'Description of project 1',
      imageUrl: 'assets/images/project1.jpg',
      technologies: ['Angular', 'TypeScript', 'Bootstrap'],
      githubUrl: 'https://github.com/yourusername/project1',
      liveUrl: 'https://project1.example.com',
    },
    {
      id: 2,
      title: 'Project 2',
      description: 'Description of project 2',
      imageUrl: 'assets/images/project2.jpg',
      technologies: ['React', 'JavaScript', 'Material UI'],
      githubUrl: 'https://github.com/yourusername/project2',
    },
    {
      id: 3,
      title: 'Project 3',
      description: 'Description of project 3',
      imageUrl: 'assets/images/project3.jpg',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      liveUrl: 'https://project3.example.com',
    },
  ];

  constructor() {}

  getProjects(): Observable<Project[]> {
    return of(this.projects);
  }

  getProject(id: number): Observable<Project | undefined> {
    return of(this.projects.find((project) => project.id === id));
  }
}
