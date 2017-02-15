# Bananas

Not sure yet - but it should pass!

[![Build Status](https://travis-ci.org/dwp-technology-design/fake-expat-claim-service.svg?branch=master)](https://travis-ci.org/dwp-technology-design/fake-expat-claim-service)
[![Coverage Status](https://coveralls.io/repos/github/dwp-technology-design/fake-expat-claim-service/badge.svg?branch=master)](https://coveralls.io/github/dwp-technology-design/fake-expat-claim-service?branch=master)

## Environment Variables

In order to deploy to AWS using Terraform or Packer environment variables must be set so your credentials can be used.

```shell
 export AWS_DEFAULT_REGION="us-west-2"
 export AWS_SECRET_ACCESS_KEY="$(cat ~/.ssh/aws-secret-access-key)"
 export AWS_ACCESS_KEY_ID="$(cat ~/.ssh/aws-access-key)"
```

You can source the `credentials.sh` which will set these variables.

```shell
source credentials.sh
```

## SSH-Agent

Ensure the ssh agent is running and that the identity you wish Terraform to use is added.

## Who is watching

The Domain Team!

## Moving to Kubernetes

### Install Kubernetes

```shell
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
```

### Install Mikikube

```shell
curl -Lo minikube https://storage.googleapis.com/minikube/releases/v0.16.0/minikube-linux-amd64 && chmod +x minikube && sudo mv minikube /usr/local/bin/
```
