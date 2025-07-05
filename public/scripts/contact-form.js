/**
 * CONTACT FORM SCRIPT - Script simplificado para el formulario de contacto
 * ========================================================================
 * Implementa validación usando las utilidades creadas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Solo usar validación básica en el cliente
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Validación simple en tiempo real
  const fields = form.querySelectorAll('input[required], textarea[required]');
  
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      const value = field.value.trim();
      field.classList.remove('border-red-500', 'border-green-500');
      
      if (field.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(value)) {
          field.classList.add('border-green-500');
        } else if (value) {
          field.classList.add('border-red-500');
        }
      } else {
        if (value.length >= 2) {
          field.classList.add('border-green-500');
        } else if (value) {
          field.classList.add('border-red-500');
        }
      }
    });
  });

  // Manejo del envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn?.textContent;
    
    // Mostrar estado de carga
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }
    
    try {
      const formData = new FormData(form);
      const response = await fetch('https://my-wedding-database.vercel.app/api/portafolio/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message')
        })
      });
      
      if (response.ok) {
        // Mostrar mensaje de éxito
        const successEl = document.getElementById('contact-success');
        if (successEl) successEl.classList.remove('hidden');
        form.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      // Mostrar mensaje de error
      const errorEl = document.getElementById('contact-error');
      if (errorEl) errorEl.classList.remove('hidden');
    } finally {
      // Restaurar botón
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
});
