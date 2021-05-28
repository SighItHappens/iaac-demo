# IaaC Demo

A simple Express application containerized using Docker and deployed into a Azure Kubernetes Service cluster. 

## Overview

### Express Application

The (Express)[https://expressjs.com/] application is a bare-bones implementation and currently only supports a home page. Unit tests have been written using (Mocha)[https://mochajs.org/] and (Supertest)[https://www.npmjs.com/package/supertest].

A simple Dockerfile to containerize this application is present in the `express` directory. 

### Azure Kubernetes Service using Terraform

The express application described earlier is deployed into an Azure Kubernetes Service cluster. In order to provision the infrastucture, I have used Terraform to allow for automatic provisioning using Jenkins etc. or via the command line. 

Given this is a simple demo, the terraform template uses a lot of default values and code inspired from the (official tutorial)[https://learn.hashicorp.com/tutorials/terraform/aks] for provisioning an AKS cluster, and the code can be found in the `terraform` directory.

An Ingress controller has been manually installed into the AKS cluster, but given that this would be a one-time process, this can be automated by directly running the necessary `kubectl` commands on the cluster.

### Kubernetes Deployment using Helm

In order to further aid the process of automatic deployment, I have created a helm chart to manage the configuration files for the different Kubernetes resources needed to deploy the Express application. 

The Helm chart expands on the default chart template provided by Helm and creates a Deployment (with ReplicaSet and Pods), a Service (Cluster IP), an Ingress route, and a HPA for auto-scaling. The code for the same can be found in the `helm-chart` directory. 

## Scaling the Kubernetes Cluster

If at any point the AKS cluster needs to be modified, we can make updates to the terraform template and call the `terraform apply` command (or conversly, go via the `terraform plan` and using its output file).

### Example - Scale number of nodes in the cluster
```bash
terraform apply -var nodePoolSize=2
```

## Scaling the Deployment in the Kubernetes Cluster

The use of helm charts makes the scaling of the application inside the Kubernetes Cluster fairly straight forward, and can be done by upgrading the Helm chart and over-riding the `replicaCount` variable. 

### Example - Increase number of Replicas of the Pod to 3

```bash
helm upgrade <release-name> <path-to-helm-chart> --set replicaCount=3
```

## Ingress Installation Command

```bash
helm install nginx-ingress ingress-nginx/ingress-nginx --namespace ingress-basic --set controller.replicaCount=2 --set controller.nodeSelector."beta\.kubernetes\.io/os"=linux --set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux --set controller.admissionWebhooks.patch.nodeSelector."beta\.kubernetes\.io/os"=linux
```