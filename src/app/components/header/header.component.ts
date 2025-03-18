import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgFor,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  title = 'Mi Portafolio - Juan Samayoa';

  navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/projects', label: 'Proyectos' },
    { path: '/about', label: 'Sobre mí' },
    { path: '/contact', label: 'Contacto' },
  ];
}
