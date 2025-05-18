all: clean build

DATESTAMP=$(shell /bin/date "+%Y-%m-%d")
TIMESTAMP=$(shell /bin/date "+%Y-%m-%d %H:%M:%S")

export DATESTAMP
export TIMESTAMP

define PRAEAMBLE
---
layout: post
title: ""
background: ""
---

endef

export PRAEAMBLE

new:
	echo "$$PRAEAMBLE" > _posts/${DATESTAMP}-TITLE.md; \
	echo "" >> _posts/${DATESTAMP}-TITLE.md; \
	vim _posts/${DATESTAMP}-TITLE.md

build:
	bundle exec jekyll b

clean:
	$(RM) -rf _site/*

serve:
	bundle exec jekyll serve --drafts --livereload --future
