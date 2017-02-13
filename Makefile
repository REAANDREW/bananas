.PHONY: lint test build deploy destroy build_ami

AMI=$(shell grep 'artifact,0,id' /dev/null deploy/ami-build.log | cut -d, -f6 | cut -d: -f2)
REGION=$(shell grep 'artifact,0,id' /dev/null deploy/ami-build.log | cut -d, -f6 | cut -d: -f1)

install:
	npm install

lint:
	jshint .

test:
	# Stand up the not real HMRC service
	istanbul cover node_modules/.bin/_mocha test/*

mutation_test:
	npm run stryker

build: install lint test mutation_test

package: install 

build_ami:
	(cd deploy && \
		packer build -machine-readable packer.json | tee ami-build.log)
	
deploy: build_ami
	echo "ami = $(AMI)"
	echo "region = $(REGION)"

	(cd deploy && \
	terraform apply -var 'key_name=terraform' -var 'public_key_path=/home/vagrant/.ssh/id_rsa.pub' -var 'aws_region=$(REGION)' -var 'aws_ami=$(AMI)')

destroy:
	(cd deploy && \
	terraform destroy -var 'key_name=terraform' -var 'public_key_path=/home/vagrant/.ssh/id_rsa.pub' -var 'aws_region=$(REGION)' -var 'aws_ami=$(AMI)')
