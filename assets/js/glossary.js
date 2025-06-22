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
      const container = document.querySelector('.glossary-container');

      // Set search state on container
      if (container) {
        if (searchTerm) {
          container.setAttribute('data-search', searchTerm);
        } else {
          container.removeAttribute('data-search');
        }
      }

      // Handle Norse character substitutions
      const createNorseVariants = term => {
        const variants = [term];

        // Create variant with ð substituted for d
        if (term.includes('d')) {
          variants.push(term.replace(/d/g, 'ð'));
        }

        // Create variant with d substituted for ð
        if (term.includes('ð')) {
          variants.push(term.replace(/ð/g, 'd'));
        }

        return [...new Set(variants)]; // Remove duplicates
      };

      const searchVariants = createNorseVariants(searchTerm);

      // Only add search-match class, CSS handles the hiding
      entries.forEach(entry => {
        if (!searchTerm) {
          entry.classList.remove('search-match');
          return;
        }

        const title = entry.querySelector('.term-title').textContent.toLowerCase();
        const definition = entry.querySelector('.definition').textContent.toLowerCase();

        // Check if any search variant matches
        const matches = searchVariants.some(variant => title.includes(variant) || definition.includes(variant));

        if (matches) {
          entry.classList.add('search-match');
        } else {
          entry.classList.remove('search-match');
        }
      });

      // Show/hide letter headers based on whether they have matching entries
      letterHeaders.forEach(header => {
        let hasVisibleEntries = false;

        // Find all entries that come after this header and before the next header
        let currentElement = header.nextElementSibling;
        while (currentElement && !currentElement.classList.contains('letter-header')) {
          if (currentElement.classList.contains('glossary-entry')) {
            if (!searchTerm || currentElement.classList.contains('search-match')) {
              hasVisibleEntries = true;
              break;
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        // Show or hide the header based on whether it has visible entries
        if (hasVisibleEntries) {
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

      // Clear search and show all entries/headers
      const entries = document.querySelectorAll('.glossary-entry');
      const letterHeaders = document.querySelectorAll('.letter-header');
      const container = document.querySelector('.glossary-container');

      // Clear search attribute and classes
      if (container) {
        container.removeAttribute('data-search');
      }

      entries.forEach(entry => {
        entry.classList.remove('search-match');
      });

      // Show all headers
      letterHeaders.forEach(header => {
        header.style.display = 'block';
      });

      // Update URL to remove search parameter
      const url = new URL(window.location);
      url.searchParams.delete('search');
      window.history.replaceState({}, '', url);
    });
  }

  // Smooth scroll for index links with better positioning
  document.querySelectorAll('.alphabet-links a, .index-links a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Find the first glossary entry after this letter header
        let firstEntry = target.nextElementSibling;
        while (firstEntry && !firstEntry.classList.contains('glossary-entry')) {
          firstEntry = firstEntry.nextElementSibling;
        }

        // If we found a glossary entry, scroll to it instead of the header
        const scrollTarget = firstEntry || target;
        const targetRect = scrollTarget.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;

        // Position the target about 80px from the top for better visibility
        const offset = 80;
        const targetY = currentScrollY + targetRect.top - offset;

        window.scrollTo({
          top: Math.max(0, targetY), // Don't scroll above the page top
          behavior: 'smooth',
        });
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
