/**
 * Script de fallback para funcionalidades básicas
 */
(function() {
  // Inicializar revelación de elementos
  document.querySelectorAll('.reveal-item').forEach(function(item) {
    item.classList.add('is-revealed');
  });

  // Inicializar ScrollToTop
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  if (scrollToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
        scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
      }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

  // Inicializar menú móvil
  const mobileMenuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
})();
