/**
 * Funciones de respaldo para garantizar la funcionalidad básica
 * si fallan los scripts de Astro
 */
(function() {
  console.log('Cargando funciones de respaldo...');
  
  // Esperar a que se cargue el DOM
  document.addEventListener('DOMContentLoaded', function() {
    // 1. Funcionalidad botón volver arriba
    const initScrollToTop = function() {
      const scrollButton = document.getElementById('scroll-to-top');
      if (!scrollButton) return;
      
      // Manejar visibilidad del botón
      window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
          scrollButton.classList.remove('opacity-0', 'invisible', 'translate-y-10');
          scrollButton.classList.add('opacity-100', 'translate-y-0');
        } else {
          scrollButton.classList.add('opacity-0', 'invisible', 'translate-y-10');
          scrollButton.classList.remove('opacity-100', 'translate-y-0');
        }
      });
      
      // Funcionalidad de scroll
      scrollButton.addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      });
      
      console.log('ScrollToTop inicializado');
    };
    
    // 2. Funcionalidad menú móvil
    const initMobileMenu = function() {
      const menuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (!menuButton || !mobileMenu) return;
      
      menuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
      });
      
      // Cerrar menú al hacer clic en enlace
      mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          mobileMenu.classList.add('hidden');
        });
      });
      
      console.log('Menú móvil inicializado');
    };
    
    // 3. Inicializar animaciones de revelación
    const initRevealAnimations = function() {
      const revealItems = document.querySelectorAll('.reveal-item:not(.is-revealed)');
      
      if (revealItems.length === 0) return;
      
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });
        
        revealItems.forEach(function(item) {
          observer.observe(item);
        });
      } else {
        // Fallback para navegadores sin soporte
        revealItems.forEach(function(item) {
          item.classList.add('is-revealed');
        });
      }
      
      console.log('Animaciones de revelación inicializadas');
    };
    
    // Inicializar todas las funciones
    setTimeout(function() {
      initScrollToTop();
      initMobileMenu();
      initRevealAnimations();
      console.log('Funciones de respaldo inicializadas correctamente');
    }, 200);
  });
})();
