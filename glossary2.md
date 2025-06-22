---
layout: page
title: Glossar 2 - Test
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

<div class="glossary2-container">

  <!-- Alphabetical index -->
  {% if sorted_terms.size > 5 %}
  <nav class="glossary-index2">
    <h3>Springe zu Buchstabe</h3>
    <div class="alphabet-links2">
      {% assign first_letters = '' %}
      {% for item in sorted_terms %}
        {% assign first_letter = item.term | slice: 0, 1 | upcase %}
        {% unless first_letters contains first_letter %}
          {% assign first_letters = first_letters | append: first_letter | append: ',' %}
        {% endunless %}
      {% endfor %}

      {% assign letters_array = first_letters | split: ',' %}
      {% for letter in letters_array %}
        {% if letter != '' %}
          <a href="#letter2-{{ letter | downcase }}">{{ letter }}</a>
        {% endif %}
      {% endfor %}
    </div>
  </nav>
  {% endif %}

  <!-- Glossary entries without any filtering -->
  <div class="glossary-entries">
    {% assign current_letter = '' %}
    {% for item in sorted_terms %}
      {% assign item_letter = item.term | slice: 0 | upcase %}
      {% if item_letter != current_letter %}
        {% assign current_letter = item_letter %}
        <h2 class="letter-header2" id="letter2-{{ current_letter | downcase }}">{{ current_letter }}</h2>
      {% endif %}

      <article class="glossary-entry2" id="{{ item.term | downcase | url_encode }}-2">
        <div class="entry-content2">
          {% if item.image and item.image != '' %}
            <div class="image-content2">
              <img src="{{ item.image }}"
                   alt="{{ item.image_alt | default: item.term }}"
                   class="glossary-image2">
            </div>
          {% endif %}
          <div class="text-content2">
            <h3 class="term-title2">
              {{ item.term }}
              {% if item.type and item.type != '' %}
                <span class="term-type2">{{ item.type }}</span>
              {% endif %}
            </h3>
            <div class="definition2">
              {{ item.definition | markdownify }}
              {% if item.more and item.more != '' %}
                {{ item.more | markdownify }}
              {% endif %}
              {% if item.url and item.url != '' and item.url != '#' %}
                <a href="{{ item.url }}" class="source-link2">Learn more →</a>
              {% endif %}
            </div>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</div>

<script>
// Simple smooth scroll for alphabet links
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.alphabet-links2 a').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        // Find the first glossary entry after this letter header
        let firstEntry = target.nextElementSibling;
        while (firstEntry && !firstEntry.classList.contains('glossary-entry2')) {
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
          top: Math.max(0, targetY),
          behavior: 'smooth',
        });
      }
    });
  });
});
</script>
