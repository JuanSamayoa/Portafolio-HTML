// Script para manejar errores de carga de recursos
document.addEventListener('DOMContentLoaded', function() {
  // Verificar si hay scripts faltantes y cargarlos manualmente
  const missingScripts = [
    './assets/Experience.astro_astro_type_script_index_0_lang.js',
    './assets/Header.astro_astro_type_script_index_0_lang.js',
    './assets/Projects.astro_astro_type_script_index_0_lang.js',
    './assets/AboutMe.astro_astro_type_script_index_0_lang.js',
    './assets/ScrollToTop.astro_astro_type_script_index_0_lang.js'
  ];
  
  // Funcionalidad básica para el menú móvil si falla el script original
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Funcionalidad básica para scrollToTop si falla el script original
  const scrollToTopButton = document.getElementById('scroll-to-top');
  if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopButton.classList.remove('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopButton.classList.add('opacity-100', 'translate-y-0');
      } else {
        scrollToTopButton.classList.add('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopButton.classList.remove('opacity-100', 'translate-y-0');
      }
    });
    
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
