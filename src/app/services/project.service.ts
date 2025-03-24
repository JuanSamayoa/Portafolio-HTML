import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Project {
  id: number;
  title: string;
  shortDescription: string;
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
      shortDescription: 'Sistema de Recursos Humanos con capacidad de reportes y gestión de empleados.',
      description:
        'El Sistema de Recursos Humanos es una aplicación diseñada para la gestión eficiente del personal dentro de una organización. Su objetivo es organizar y coordinar todas las actividades relacionadas con la contratación, administración de empleados, permisos, licencias, vacaciones y movimientos dentro de la empresa. Además, ofrece un módulo de reportes para la toma de decisiones estratégicas en el departamento de Recursos Humanos.',
      imageUrl: 'assets/img/humanresources.webp',
      technologies: ['Java', 'SQL', 'Swing'],
      githubUrl: 'https://github.com/JuanSamayoa/SistemaRecursosHumanos',
    },
    {
      id: 2,
      title: 'Project 2',
      shortDescription: 'Description of project 2',
      description: 'Description of project 2',
      imageUrl: 'assets/images/project2.jpg',
      technologies: ['React', 'JavaScript', 'Material UI'],
      githubUrl: 'https://github.com/yourusername/project2',
    },
    {
      id: 3,
      title: 'Project 3',
      shortDescription: 'Description of project 3',
      description: 'Description of project 3',
      imageUrl: 'assets/images/project3.jpg',
      technologies: ['Node.js', 'Express', 'MongoDB'],
      liveUrl: 'https://project3.example.com',
    },
    {
      id: 3,
      title: 'Project 4',
      shortDescription: 'Description of project 4',
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
