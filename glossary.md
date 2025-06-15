---
layout: page
title: Glossary
feature-img: "assets/images/glossary-header.jpg"
---

<script src="{{ '/assets/js/glossary.js' | relative_url }}"></script>

<div class="glossary-container">
  {% assign sorted_terms = site.data.glossary.terms | sort: 'term' %}
  
  <!-- Search box -->
  <div class="glossary-search">
    <input type="text" id="search" placeholder="Filter" />
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
        <div class="entry-content">
          {% if item.image and item.image != '' %}
            <div class="image-content">
              <img src="{{ item.image }}" 
                   alt="{{ item.image_alt | default: item.term }}" 
                   class="glossary-image"
                   onclick="openImageModal(this)">
            </div>
          {% endif %}
          <div class="text-content">
            <h3 class="term-title">{{ item.term }}</h3>
            <div class="definition">
              {{ item.definition | markdownify }}
              {% if item.url and item.url != '' and item.url != '#' %}
                <a href="{{ item.url }}" class="source-link">Learn more →</a>
              {% endif %}
            </div>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<!-- Image Modal -->
<div id="imageModal" class="image-modal" onclick="closeImageModal()">
  <span class="modal-close" onclick="closeImageModal()">&times;</span>
  <img class="modal-image" id="modalImage" onclick="event.stopPropagation()">
  <div class="modal-caption" id="modalCaption"></div>
</div>

<script src="{{ '/assets/js/glossary.js' | relative_url }}"></script>