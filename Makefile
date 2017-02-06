.PHONY: test

lint:
	jshint .

test:
	istanbul cover node_modules/.bin/_mocha test/*

build: lint test


