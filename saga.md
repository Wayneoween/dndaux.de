---
layout: page
title: Saga
description: Chronologische Übersicht aller Vers-Spielberichte (Abendposts)
position: 1
---

{% assign saga_posts = site.categories.verse | sort: 'date' %}

{% if saga_posts and saga_posts.size > 0 %}
<ul class="saga-list">
  {% for post in saga_posts %}
  <li class="saga-item">
    <a class="saga-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="saga-meta">{{ post.date | date: "%d.%m.%Y" }}{% if post.session %} · Session {{ post.session }}{% endif %}</span>
  </li>
  {% endfor %}
</ul>
{% else %}
<p><em>Noch keine Saga-Einträge vorhanden.</em></p>
{% endif %}
