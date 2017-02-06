.PHONY: test

test:
	jshint .
	istanbul cover node_modules/.bin/_mocha
