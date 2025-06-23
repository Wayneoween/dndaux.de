---
layout: page
title: Glossar
feature-img: 'https://images2.alphacoders.com/129/1293863.jpg'
---

{% assign unsorted_terms = site.data.glossary.glossary %}
{% assign sorted_terms = '' | split: '' %}

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

<div class="glossary-container">

  <!-- Simple search box -->
  <div class="glossary-search">
    <div class="search-input-container">
      <input type="text" id="search" placeholder="Filter" />
      <button type="button" id="clear-search" class="clear-search-btn" title="Filter leeren">
        <span>&times;</span>
      </button>
    </div>
  </div>

  <!-- Term index -->
  {% if sorted_terms.size > 5 %}
  <nav class="glossary-index">
    <h3>Begriffe</h3>
    <div class="term-links" data-term-count="{{ sorted_terms.size }}">
      {% for item in sorted_terms %}
        <a href="#term-{{ item.term | downcase | url_encode }}">{{ item.term }}</a>
      {% endfor %}
    </div>
  </nav>
  {% endif %}

  <!-- Glossary entries with simple filtering -->
  <div class="glossary-entries">
    {% assign current_letter = '' %}
    {% for item in sorted_terms %}
      {% assign item_letter = item.term | slice: 0 | upcase %}
      {% if item_letter != current_letter %}
        {% assign current_letter = item_letter %}
        <h2 class="letter-header" id="letter-{{ current_letter | downcase }}">{{ current_letter }}</h2>
      {% endif %}

      <article class="glossary-entry" id="term-{{ item.term | downcase | url_encode }}">
        <div class="entry-content">
          <!-- Type label in top-right -->
          {% if item.type and item.type != '' %}
            <span class="term-type">{{ item.type }}</span>
          {% endif %}

          <!-- Image below type label (if exists) -->
          {% if item.image and item.image != '' %}
            <div class="image-content">
              <img src="{{ item.image }}"
                   alt="{{ item.image_alt | default: item.term }}"
                   class="glossary-image">
            </div>
          {% endif %}

          <div class="text-content">
            <h3 class="term-title">
              {{ item.term }}
              {% if item.destroyed == true %}
                <span class="status-symbol destroyed" title="Zerstört">zerstört</span>
              {% endif %}
              {% if item.dead == true %}
                <span class="status-symbol dead" title="Verstorben">gestorben</span>
              {% endif %}
            </h3>
            <div class="definition">
              {{ item.definition | markdownify }}
              {% if item.more and item.more != '' %}
                {{ item.more | markdownify }}
              {% endif %}
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

<script src="/assets/js/glossary.js"></script>

<!-- Simple Image Modal -->
<div id="imageModal" class="image-modal" onclick="closeImageModal()">
  <span class="modal-close" onclick="closeImageModal()">&times;</span>
  <img class="modal-image" id="modalImage" onclick="event.stopPropagation()">
  <div class="modal-caption" id="modalCaption"></div>
</div>
