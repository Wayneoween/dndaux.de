// Glossary functionality for dndaux.de
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search');
  const clearButton = document.getElementById('clear-search');

  if (searchInput) {
    // Search functionality using ONLY CSS classes, no direct style manipulation
    searchInput.addEventListener('input', function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const entries = document.querySelectorAll('.glossary-entry');
      const letterHeaders = document.querySelectorAll('.letter-header');
      const termLinks = document.querySelectorAll('.term-links a');

      // Handle Norse character substitutions
      const createNorseVariants = term => {
        const variants = [term];

        if (term.includes('d')) {
          variants.push(term.replace(/d/g, 'ð'));
        }

        if (term.includes('ð')) {
          variants.push(term.replace(/ð/g, 'd'));
        }

        return [...new Set(variants)];
      };

      const searchVariants = createNorseVariants(searchTerm);

      // Filter glossary entries
      entries.forEach(entry => {
        if (!searchTerm) {
          entry.classList.remove('hidden');
          return;
        }

        const title = entry.querySelector('.term-title').textContent.toLowerCase();
        const definition = entry.querySelector('.definition').textContent.toLowerCase();

        const matches = searchVariants.some(variant => title.includes(variant) || definition.includes(variant));

        if (matches) {
          entry.classList.remove('hidden');
        } else {
          entry.classList.add('hidden');
        }
      });

      // Filter term links based on visible entries
      termLinks.forEach(link => {
        if (!searchTerm) {
          link.classList.remove('hidden');
          return;
        }

        const href = link.getAttribute('href');
        const targetId = href.replace('#', '');
        const targetEntry = document.getElementById(targetId);

        if (targetEntry && !targetEntry.classList.contains('hidden')) {
          link.classList.remove('hidden');
        } else {
          link.classList.add('hidden');
        }
      });

      // Hide letter headers with no visible entries
      letterHeaders.forEach(header => {
        let hasVisibleEntries = false;

        let currentElement = header.nextElementSibling;
        while (currentElement && !currentElement.classList.contains('letter-header')) {
          if (currentElement.classList.contains('glossary-entry')) {
            if (!searchTerm || !currentElement.classList.contains('hidden')) {
              hasVisibleEntries = true;
              break;
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        if (hasVisibleEntries) {
          header.classList.remove('hidden');
        } else {
          header.classList.add('hidden');
        }
      });
    });
  }

  // Clear search functionality
  if (clearButton && searchInput) {
    const toggleClearButton = () => {
      if (searchInput.value.length > 0) {
        clearButton.classList.add('visible');
      } else {
        clearButton.classList.remove('visible');
      }
    };

    searchInput.addEventListener('input', toggleClearButton);

    clearButton.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      toggleClearButton();

      // Remove all hidden classes
      document.querySelectorAll('.hidden').forEach(el => {
        el.classList.remove('hidden');
      });
    });
  }

  // Setup glossary interlinking first
  setupGlossaryInterlinking();

  // Smooth scroll for term links and glossary interlinks
  document.querySelectorAll('.term-links a, .glossary-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');

      // Use getElementById for better compatibility with encoded characters
      const targetId = href.replace('#', '');
      const target = document.getElementById(targetId);

      if (target) {
        const targetRect = target.getBoundingClientRect();
        const currentScrollY = window.pageYOffset;

        // Position the target about 80px from the top for better visibility
        const offset = 80;
        const targetY = currentScrollY + targetRect.top - offset;

        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    });
  });

  // Simple image modal functionality
  const images = document.querySelectorAll('.glossary-image');
  images.forEach(img => {
    img.addEventListener('click', function () {
      openImageModal(this.src, this.alt);
    });
  });

  // Setup term index columns
  setupTermIndexColumns();

  // Add scroll-to-top functionality for glossary page
  if (document.querySelector('.glossary-container')) {
    initScrollToTop();
  }

  // Check for a selector in the URL on page load
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;

  if (searchInput) {
    let initialSearch = '';

    // Check for a query parameter named 'filter'
    if (urlParams.has('filter')) {
      initialSearch = urlParams.get('filter');
    }

    // Check for a query parameter named 'search'
    if (urlParams.has('search')) {
      initialSearch = urlParams.get('search');
    }

    // Check for a hash in the URL
    if (hash) {
      const hashTerm = hash.replace('#', '').toLowerCase();
      initialSearch = decodeURIComponent(hashTerm);
    }

    if (initialSearch) {
      searchInput.value = initialSearch;
      const inputEvent = new Event('input');
      searchInput.dispatchEvent(inputEvent);
    }
  }
});

// Modal functions
window.openImageModal = function (src, alt) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const caption = document.getElementById('modalCaption');

  modal.style.display = 'block';
  modalImg.src = src;
  caption.textContent = alt;

  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
};

window.closeImageModal = function () {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};

// Close modal when clicking outside the image
document.addEventListener('click', function (e) {
  const modal = document.getElementById('imageModal');
  if (e.target === modal) {
    closeImageModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

// Automatic interlinking of glossary terms
function setupGlossaryInterlinking() {
  // Get all term names from the index links
  const termLinks = document.querySelectorAll('.term-links a');
  const termNames = Array.from(termLinks).map(link => {
    return {
      name: link.textContent,
      href: link.getAttribute('href'),
    };
  });

  // Sort by length (longest first) to avoid partial matches
  termNames.sort((a, b) => b.name.length - a.name.length);

  // Process each definition
  document.querySelectorAll('.definition').forEach(definition => {
    let html = definition.innerHTML;

    termNames.forEach(term => {
      // Skip if this is the current entry (avoid self-linking)
      const currentEntry = definition.closest('.glossary-entry');
      const currentTermName = currentEntry.querySelector('.term-title').textContent.trim();
      if (currentTermName === term.name) return;

      // Create a regex that matches the term as a whole word
      // Use word boundaries but be careful with special characters
      const escapedTerm = term.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // For terms with special characters, use a more flexible word boundary approach
      const hasSpecialChars = /[äöüßÄÖÜðÐ]/.test(term.name);
      let regex;

      if (hasSpecialChars) {
        // For special characters, use a simpler approach with space/punctuation boundaries
        // Match when preceded/followed by whitespace, punctuation, hyphens, or string boundaries
        regex = new RegExp(`(^|\\s|[.,;:!?\\(\\)\\[\\]"'\\-])${escapedTerm}(\\s|[.,;:!?\\(\\)\\[\\]"'\\-]|$)`, 'gi');
      } else {
        // For regular terms, use word boundaries
        regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
      }

      // Only replace if not already inside a link
      const linkRegex = /<a[^>]*>.*?<\/a>/gi;
      const parts = html.split(linkRegex);
      const links = html.match(linkRegex) || [];

      // Process only the non-link parts
      for (let i = 0; i < parts.length; i++) {
        if (hasSpecialChars) {
          // For special characters, preserve the boundaries in the replacement
          parts[i] = parts[i].replace(regex, (match, before, after) => {
            return `${before}<a href="${term.href}" class="glossary-link">${term.name}</a>${after}`;
          });
        } else {
          parts[i] = parts[i].replace(regex, `<a href="${term.href}" class="glossary-link">${term.name}</a>`);
        }
      }

      // Reassemble the HTML
      html = '';
      for (let i = 0; i < parts.length; i++) {
        html += parts[i];
        if (i < links.length) {
          html += links[i];
        }
      }
    });

    definition.innerHTML = html;
  });
}

// Dynamic column layout for term index
function setupTermIndexColumns() {
  const termLinks = document.querySelector('.term-links');
  if (!termLinks) return;

  const termCount = parseInt(termLinks.getAttribute('data-term-count'));
  const maxItemsPerColumn = 12;

  // Calculate minimum columns needed based on max items per column
  let columns = Math.ceil(termCount / maxItemsPerColumn);

  // Set reasonable limits
  columns = Math.max(1, Math.min(columns, 6)); // Between 1 and 6 columns

  // Calculate actual items per column for vertical arrangement
  const itemsPerColumn = Math.ceil(termCount / columns);

  // Apply CSS grid with proper column flow
  termLinks.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  termLinks.style.gridTemplateRows = `repeat(${itemsPerColumn}, auto)`;
  termLinks.style.gridAutoFlow = 'column';

  // Responsive adjustments
  function updateColumns() {
    const width = window.innerWidth;
    let responsiveColumns = columns;

    if (width <= 480) {
      responsiveColumns = Math.min(columns, 1); // 1 column on very small screens
    } else if (width <= 768) {
      responsiveColumns = Math.min(columns, 2); // Max 2 columns on mobile
    } else if (width <= 1024) {
      responsiveColumns = Math.min(columns, 3); // Max 3 columns on tablet
    } else if (width <= 1200) {
      responsiveColumns = Math.min(columns, 4); // Max 4 columns on small desktop
    }

    const responsiveItemsPerColumn = Math.ceil(termCount / responsiveColumns);
    termLinks.style.gridTemplateColumns = `repeat(${responsiveColumns}, 1fr)`;
    termLinks.style.gridTemplateRows = `repeat(${responsiveItemsPerColumn}, auto)`;
  }

  updateColumns();
  window.addEventListener('resize', updateColumns);
}

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
