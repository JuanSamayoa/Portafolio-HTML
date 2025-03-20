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
      title: 'Sistemas de Recursos Humanos',
      description: 'Sistema de Recursos Humanos para empresa, el cual gestiona desde nuevos empleados hasta las vacaciones de los mismos. Con capacidad de generar reportes.',
      imageUrl: 'assets/images/project1.jpg',
      technologies: ['Java', 'SQL', 'Swing'],
      githubUrl: 'https://github.com/JuanSamayoa/Portafolio-HTML',
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
    {
      id: 3,
      title: 'Project 4',
      description: 'Description of project 4',
      imageUrl: 'assets/images/project4.jpg',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      liveUrl: 'https://project4.example.com',
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
