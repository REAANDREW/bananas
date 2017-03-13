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

## Running ansible-playbook

Run the following command with the following inventory file:

```yaml
[web]
<ip of the box>   ansible_connection=ssh  ansible_user=centos
```

```shell
ansible-playbook -i inventory.txt ansible/playbook.yml
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


WE NEED A LOT OF STUFF!!!

```shell
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.101:2376"
export DOCKER_CERT_PATH="/home/vagrant/.minikube/certs"
export DOCKER_API_VERSION="1.23"
```

WE NEED A KUBE CONFIG TO TALK TO THE OTHER VM

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /home/vagrant/.minikube/ca.crt
    server: https://192.168.99.101:8443
  name: minikube
contexts:
- context:
    cluster: minikube
    user: minikube
  name: minikube
current-context: "minikube"
kind: Config
preferences: {}
users:
- name: minikube
  user:
    client-certificate: /home/vagrant/.minikube/apiserver.crt
    client-key: /home/vagrant/.minikube/apiserver.key
```

THE MAGIC!!!

We copied the `.minikube/` directory from the host to the other VM.  AND, AND we ensured that the vagrant VM was on the same Virtualbox Network Adapter as the Minikube. SO we have:

```txt
 HOST
+------------------------------------------------------------------+
|                                                                  |
|      Vagrant                          Minikube Virtual Machine   |
|                                                                  |
|      +--------------------+           +--------------------+     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    +---------> |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      |                    |           |                    |     |
|      +--------------------+           +--------------------+     |
|                                                                  |
|      192.168.99.45                    192.168.99.101             |
|                                                                  |
+------------------------------------------------------------------+
```

### Kubernetes Resources

[https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/](https://kubernetes.io/docs/tutorials/stateless-application/hello-minikube/)

[https://kubernetes.io/docs/user-guide/pods/multi-container/#pod-configuration-file](https://kubernetes.io/docs/user-guide/pods/multi-container/#pod-configuration-file)
ansible-playbook -u root -i "localhost," -c local deploy/ansible/playbook.yml
