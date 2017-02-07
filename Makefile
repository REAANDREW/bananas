.PHONY: lint test build deploy destroy

lint:
	jshint .

test:
	istanbul cover node_modules/.bin/_mocha test/*

build: lint test

deploy:
	(cd deploy && \
	terraform apply -var 'key_name=terraform' -var 'public_key_path=/home/vagrant/.ssh/id_rsa.pub')

destroy:
	(cd deploy && \
	terraform destroy -var 'key_name=terraform' -var 'public_key_path=/home/vagrant/.ssh/id_rsa.pub')
