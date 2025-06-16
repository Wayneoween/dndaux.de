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

  // Simple glossary term highlighting - only run on glossary page
  if (document.querySelector('.glossary-container') && window.glossaryData) {
    highlightGlossaryTerms();
  }
});

// Simple function to highlight glossary terms in definitions
function highlightGlossaryTerms() {
  console.log('Starting glossary term highlighting');

  // Find all definition elements
  const definitions = document.querySelectorAll('.definition');
  console.log('Found', definitions.length, 'definitions to process');

  // Process each definition
  definitions.forEach((def, defIndex) => {
    // Get current term to avoid self-highlighting
    const entry = def.closest('.glossary-entry');
    const currentTerm = entry ? entry.querySelector('.term-title')?.textContent.trim() : '';

    // Process each glossary term
    window.glossaryData.forEach(item => {
      if (!item.term || item.term === currentTerm) return;

      // Check if term exists in this definition's text
      const defText = def.textContent || '';
      if (defText.toLowerCase().includes(item.term.toLowerCase())) {
        // Work on innerHTML but be more careful
        let currentHTML = def.innerHTML;

        // Skip if already highlighted
        if (currentHTML.includes(`<span class="glossary-highlight">${item.term}</span>`)) {
          return;
        }

        // Escape special regex characters
        const escapedTerm = item.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Use a simpler approach that works reliably with Unicode
        // Match the term surrounded by non-letter characters or start/end of string
        const termRegex = new RegExp(`(^|[^a-zA-ZäöüÄÖÜß])${escapedTerm}($|[^a-zA-ZäöüÄÖÜß])`, 'gi');

        const newHTML = currentHTML.replace(termRegex, (match, before, after) => {
          return before + `<span class="glossary-highlight">${item.term}</span>` + after;
        });

        if (newHTML !== currentHTML) {
          def.innerHTML = newHTML;
          console.log(`Highlighted "${item.term}" in definition ${defIndex + 1}`);
        }
      }
    });
  });

  console.log('Glossary highlighting completed');
}
