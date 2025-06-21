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
	bundle exec jekyll build

clean:
	$(RM) -rf _site/*

serve:
	bundle exec jekyll serve --drafts --livereload --future

test:
	bundle exec jekyll build --destination _test
	echo "Build test completed successfully"
	$(RM) -rf _test

update:
	bundle update

install:
	bundle install

lint:
	bundle exec jekyll doctor

check: lint test

setup: install build

.PHONY: all new build clean serve test update install lint check setup
