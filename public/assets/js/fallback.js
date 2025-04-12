/**
 * Script de fallback para restaurar funcionalidad cuando
 * los scripts principales fallan en cargar.
 */
(function() {
  console.log('[Fallback] Inicializando funcionalidades esenciales...');
  
  // 1. Manejar la navegación del menú móvil
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }
  
  // 2. Inicializar el botón ScrollToTop
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    // Control de visibilidad
    const toggleScrollButton = function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }
    };
    
    // Asignar eventos
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
    
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton(); // Comprobar estado inicial
  }
  
  // 3. Inicializar animaciones de revelación si están presentes
  if (typeof IntersectionObserver !== 'undefined') {
    const revealItems = document.querySelectorAll('.reveal-item:not(.is-revealed)');
    
    if (revealItems.length > 0) {
      try {
        const revealObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              revealObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });
        
        revealItems.forEach(function(item) {
          revealObserver.observe(item);
        });
      } catch (e) {
        console.warn('[Fallback] Error al inicializar IntersectionObserver:', e);
        // Fallback simple: mostrar todos los elementos
        revealItems.forEach(function(item) {
          item.classList.add('is-revealed');
        });
      }
    }
  } else {
    // Navegador no soporta IntersectionObserver, revelamos todo
    document.querySelectorAll('.reveal-item').forEach(function(item) {
      item.classList.add('is-revealed');
    });
  }

  // 4. Arreglar rutas de imágenes que puedan estar fallando
  document.querySelectorAll('img[src^="/"]').forEach(function(img) {
    // Convertir rutas absolutas a relativas
    const originalSrc = img.getAttribute('src');
    const newSrc = originalSrc.replace(/^\//, './');
    
    // Solo cambiar si no está cargando correctamente
    if (img.naturalWidth === 0) {
      img.setAttribute('src', newSrc);
    }
  });

  console.log('[Fallback] Inicialización completada');
})();
