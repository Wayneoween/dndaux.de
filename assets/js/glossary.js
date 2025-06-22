// Image modal functionality
window.openImageModal = function (img) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const caption = document.getElementById('modalCaption');

  if (modal && modalImg && caption && img) {
    modal.style.display = 'block';
    modalImg.src = img.src;
    caption.textContent = img.alt || '';

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
};

window.closeImageModal = function () {
  const modal = document.getElementById('imageModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
};

// Glossary functionality
document.addEventListener('DOMContentLoaded', function () {
  // Simple search functionality
  const searchInput = document.getElementById('search');
  if (searchInput) {
    // Check for URL parameter to auto-fill search
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      searchInput.value = searchParam;
      // Trigger search immediately
      const event = new Event('input');
      searchInput.dispatchEvent(event);
    }

    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const entries = document.querySelectorAll('.glossary-entry');
      const letterHeaders = document.querySelectorAll('.letter-header');

      // Filter entries
      entries.forEach(entry => {
        const title = entry.querySelector('.term-title').textContent.toLowerCase();
        const definition = entry.querySelector('.definition').textContent.toLowerCase();

        if (title.includes(searchTerm) || definition.includes(searchTerm)) {
          entry.style.display = 'block';
        } else {
          entry.style.display = 'none';
        }
      });

      // Hide letter headers that have no visible entries
      letterHeaders.forEach(header => {
        const letterId = header.id;
        let hasVisibleEntries = false;

        // Find all entries that come after this header and before the next header
        let currentElement = header.nextElementSibling;
        while (currentElement && !currentElement.classList.contains('letter-header')) {
          if (currentElement.classList.contains('glossary-entry') && currentElement.style.display !== 'none') {
            hasVisibleEntries = true;
            break;
          }
          currentElement = currentElement.nextElementSibling;
        }

        // Show or hide the header based on whether it has visible entries
        if (hasVisibleEntries || searchTerm === '') {
          header.style.display = 'block';
        } else {
          header.style.display = 'none';
        }
      });
    });
  }

  // Clear search functionality
  const clearButton = document.getElementById('clear-search');
  if (clearButton && searchInput) {
    // Show/hide clear button based on input content
    const toggleClearButton = () => {
      if (searchInput.value.length > 0) {
        clearButton.classList.add('visible');
      } else {
        clearButton.classList.remove('visible');
      }
    };

    // Check initially (in case there's a URL parameter)
    toggleClearButton();

    // Show/hide on input
    searchInput.addEventListener('input', toggleClearButton);

    // Clear search when button is clicked
    clearButton.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      toggleClearButton();

      // Show all entries and headers again
      const entries = document.querySelectorAll('.glossary-entry');
      const letterHeaders = document.querySelectorAll('.letter-header');

      entries.forEach(entry => {
        entry.style.display = 'block';
      });

      letterHeaders.forEach(header => {
        header.style.display = 'block';
      });

      // Update URL to remove search parameter
      const url = new URL(window.location);
      url.searchParams.delete('search');
      window.history.replaceState({}, '', url);
    });
  }

  // Smooth scroll for index links
  document.querySelectorAll('.alphabet-links a, .index-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Prevent event bubbling on glossary images to avoid interfering with text selection
  document.querySelectorAll('.glossary-image').forEach(img => {
    img.addEventListener('click', function (e) {
      e.stopPropagation();
      window.openImageModal(this);
    });
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.closeImageModal();
    }
  });

  // Add scroll-to-top functionality for glossary page
  if (document.querySelector('.glossary-container')) {
    initScrollToTop();
  }
});

// Scroll to top functionality
function initScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '↑';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollToTopBtn.setAttribute('title', 'Scroll to top');

  document.body.appendChild(scrollToTopBtn);

  // Find the alphabet index
  const alphabetIndex = document.querySelector('.glossary-index');

  // Show/hide button based on scroll position
  function toggleScrollButton() {
    if (alphabetIndex) {
      const indexRect = alphabetIndex.getBoundingClientRect();
      const isIndexVisible = indexRect.bottom > 0;

      if (!isIndexVisible) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  }

  // Scroll to top functionality
  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Listen for scroll events
  let scrollTimeout;
  window.addEventListener('scroll', function () {
    // Debounce scroll events for better performance
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(toggleScrollButton, 10);
  });

  // Initial check
  toggleScrollButton();
}
