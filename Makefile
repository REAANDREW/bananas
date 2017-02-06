.PHONY: test

lint:
	jshint .

test:
	istanbul cover node_modules/.bin/_mocha

build: lint test


