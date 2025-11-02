---
layout: page
title: Geschichten
position: 2
---

{% assign stories_posts = site.categories.stories | sort: 'date' %}

{% if stories_posts and stories_posts.size > 0 %}
<ul class="stories-list">
  {% for post in stories_posts %}
  <li class="stories-item">
    <a class="stories-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="stories-meta">{{ post.date | date: "%d.%m.%Y" }}</span>
  </li>
  {% endfor %}
</ul>
{% else %}
<p><em>Noch keine Stories vorhanden.</em></p>
{% endif %}
