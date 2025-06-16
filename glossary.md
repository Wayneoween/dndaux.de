---
layout: page
title: Glossary
feature-img: "assets/images/glossary-header.jpg"
---

<script src="{{ '/assets/js/glossary.js' | relative_url }}"></script>

<div class="glossary-container">
  {% comment %} Custom German sorting {% endcomment %}
  {% assign unsorted_terms = site.data.glossary %}
  {% assign sorted_terms = '' | split: '' %}
  
  {% comment %} Define German alphabet order {% endcomment %}
  {% assign german_alphabet = 'A,Ä,B,C,D,E,F,G,H,I,J,K,L,M,N,O,Ö,P,Q,R,S,T,U,Ü,V,W,X,Y,Z' | split: ',' %}
  
  {% comment %} Sort terms according to German alphabet {% endcomment %}
  {% for letter in german_alphabet %}
    {% for term in unsorted_terms %}
      {% assign first_letter = term.term | slice: 0, 1 | upcase %}
      {% if first_letter == letter %}
        {% assign sorted_terms = sorted_terms | push: term %}
      {% endif %}
    {% endfor %}
  {% endfor %}
  
  <!-- Search box -->
  <div class="glossary-search">
    <div class="search-input-container">
      <input type="text" id="search" placeholder="Filter" />
      <button type="button" id="clear-search" class="clear-search-btn" title="Filter leeren">
        <span>&times;</span>
      </button>
    </div>
  </div>
  
  <!-- Alphabetical index -->
  {% if sorted_terms.size > 5 %}
  <nav class="glossary-index">
    <h3>Springe zu Buchstabe</h3>
    <div class="alphabet-links">
      {% assign first_letters = '' %}
      {% for item in sorted_terms %}
        {% assign first_letter = item.term | slice: 0, 1 | upcase %}
        {% unless first_letters contains first_letter %}
          {% assign first_letters = first_letters | append: first_letter | append: ',' %}
        {% endunless %}
      {% endfor %}
      {% assign letters_array = first_letters | split: ',' %}
      {% comment %} Custom sort for German letters {% endcomment %}
      {% assign sorted_letters = 'A,Ä,B,C,D,E,F,G,H,I,J,K,L,M,N,O,Ö,P,Q,R,S,T,U,Ü,V,W,X,Y,Z' | split: ',' %}
      {% for german_letter in sorted_letters %}
        {% if letters_array contains german_letter %}
          <a href="#letter-{{ german_letter | downcase }}">{{ german_letter }}</a>
        {% endif %}
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
            <h3 class="term-title">
              {{ item.term }}
              {% if item.type and item.type != '' %}
                <span class="term-type">{{ item.type }}</span>
              {% endif %}
            </h3>
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