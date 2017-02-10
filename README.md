# Bananas

Not sure yet - but it should pass!

[![Build Status](https://travis-ci.org/dwp-technology-design/bananas.svg?branch=master)](https://travis-ci.org/dwp-technology-design/bananas)
[![Coverage Status](https://coveralls.io/repos/github/dwp-technology-design/bananas/badge.svg?branch=master)](https://coveralls.io/github/dwp-technology-design/bananas?branch=master)

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
