/**
 * SCROLL REVEAL - Animaciones al hacer scroll
 * Sistema de observación para animar elementos cuando entran al viewport
 */

document.addEventListener("DOMContentLoaded", () => {
  // Configurar observer para animaciones de scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // Opcionalmente dejar de observar después de animar
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clase 'animate-on-scroll'
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));
});
