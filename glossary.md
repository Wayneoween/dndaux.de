---
layout: page
title: Glossary
feature-img: "assets/img/glossary-header.jpg"
---

<div class="glossary-container">
  {% assign sorted_terms = site.data.glossary.terms | sort: 'term' %}
  
  <!-- Search box -->
  <div class="glossary-search">
    <input type="text" id="search" placeholder="Search terms..." />
  </div>
  
  <!-- Alphabetical index -->
  {% if sorted_terms.size > 5 %}
  <nav class="glossary-index">
    <h3>Jump to Letter</h3>
    <div class="alphabet-links">
      {% assign first_letters = sorted_terms | map: 'term' | map: 'first' | map: 'upcase' | uniq | sort %}
      {% for letter in first_letters %}
        <a href="#letter-{{ letter | downcase }}">{{ letter }}</a>
      {% endfor %}
    </div>
  </nav>
  {% endif %}
  
  <!-- Glossary entries grouped by letter -->
  <div class="glossary-entries">
    {% assign current_letter = '' %}
    {% for item in sorted_terms %}
      {% assign item_letter = item.term | slice: 0 | upcase %}
      {% if item_letter != current_letter %}
        {% assign current_letter = item_letter %}
        <h2 class="letter-header" id="letter-{{ current_letter | downcase }}">{{ current_letter }}</h2>
      {% endif %}
      
      <article class="glossary-entry" id="{{ item.term | downcase | url_encode }}">
        <h3 class="term-title">{{ item.term }}</h3>
        <div class="definition">
          {{ item.definition | markdownify }}
          {% if item.url and item.url != '' and item.url != '#' %}
            <a href="{{ item.url }}" class="source-link">Learn more →</a>
          {% endif %}
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<script>
// Simple search functionality
document.getElementById('search').addEventListener('input', function(e) {
  const searchTerm = e.target.value.toLowerCase();
  const entries = document.querySelectorAll('.glossary-entry');
  
  entries.forEach(entry => {
    const title = entry.querySelector('.term-title').textContent.toLowerCase();
    const definition = entry.querySelector('.definition').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || definition.includes(searchTerm)) {
      entry.style.display = 'block';
    } else {
      entry.style.display = 'none';
    }
  });
});

// Smooth scroll for index links
document.querySelectorAll('.alphabet-links a, .index-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
</script>
