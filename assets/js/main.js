/**
 * OSG Hospital — Main JavaScript
 * Handles navigation, mobile drawer, reviews carousel, FAQ accordion, modals, and WhatsApp actions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initReviewsCarousel();
  initFaqAccordion();
  initEnquiryModal();
  initFloatingActions();
  initFormHandlers();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links .nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. TOP 5 SLIDING REVIEWS CAROUSEL (Above Footer)
   ========================================================================== */
function initReviewsCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoplayTimer = null;

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoplay();
    });
  });

  // Touch Swipe Support for Mobile/Tablet
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
      resetAutoplay();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
      resetAutoplay();
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Resume autoplay even after hover or touch
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    let hoverTimeout = null;
    carouselContainer.addEventListener('mouseenter', () => {
      stopAutoplay();
    });
    carouselContainer.addEventListener('mouseleave', () => {
      startAutoplay();
    });
    // For touch devices, ensure it resumes auto-sliding after user interaction
    carouselContainer.addEventListener('touchend', () => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(startAutoplay, 2500);
    }, { passive: true });
  }

  // Start auto-sliding immediately
  startAutoplay();
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });
}

/* ==========================================================================
   4. QUICK ENQUIRY & CONSULTATION MODAL
   ========================================================================== */
function initEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  const openBtns = document.querySelectorAll('[data-open-modal="enquiryModal"]');
  const closeBtns = document.querySelectorAll('[data-close-modal]');

  if (!modal) return;

  function openModal(defaultService) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (defaultService) {
      const select = modal.querySelector('#modalServiceSelect');
      if (select) select.value = defaultService;
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'General Medicine';
      openModal(service);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. FLOATING ACTIONS (WhatsApp & Back to Top)
   ========================================================================== */
function initFloatingActions() {
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   6. CONTACT & ENQUIRY FORMS WITH WHATSAPP INTEGRATION
   ========================================================================== */
function initFormHandlers() {
  const contactForms = document.querySelectorAll('form[data-form-type]');

  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const service = form.querySelector('[name="service"]')?.value || 'General Consultation';
      const message = form.querySelector('[name="message"]')?.value.trim() || 'No additional details provided.';

      if (!name || !phone) {
        alert('Please fill in your name and phone number so our hospital team can assist you.');
        return;
      }

      // Format WhatsApp message
      const hospitalPhone = '919304853619';
      const text = encodeURIComponent(
        `*New Enquiry - OSG Hospital Website*\n` +
        `*Name:* ${name}\n` +
        `*Phone:* ${phone}\n` +
        `*Service Requested:* ${service}\n` +
        `*Details:* ${message}\n\n` +
        `_Sent via OSG Hospital Online Portal_`
      );

      // Show user feedback
      const feedback = document.createElement('div');
      feedback.style.marginTop = '1rem';
      feedback.style.padding = '1rem';
      feedback.style.borderRadius = '8px';
      feedback.style.backgroundColor = '#DEF7EC';
      feedback.style.border = '1px solid #31C48D';
      feedback.style.color = '#03543F';
      feedback.style.fontSize = '0.92rem';
      feedback.innerHTML = `
        <strong>Thank you, ${name}!</strong> Your enquiry has been recorded. 
        <br>Connecting you directly to OSG Hospital WhatsApp consultation desk...
      `;

      form.appendChild(feedback);

      // Open WhatsApp chat in new window
      setTimeout(() => {
        window.open(`https://wa.me/${hospitalPhone}?text=${text}`, '_blank');
        form.reset();
        setTimeout(() => feedback.remove(), 6000);
      }, 1200);
    });
  });
}
