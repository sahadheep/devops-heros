# Task 4 - Docker Overlay Network

## What is a Docker Overlay Network?

A Docker overlay network is a networking mechanism that allows containers running on different Docker hosts to communicate with each other as if they were connected to the same network.

Overlay networks are mainly used with Docker Swarm and distributed containerized applications.

## Use Cases

Overlay networks are useful when:

- Containers are running on multiple Docker hosts.
- Services in a distributed application need to communicate with each other.
- Applications need network isolation between different services.
- Docker Swarm services need communication across multiple nodes.

## How Overlay Networks Work

An overlay network creates a virtual network that exists across multiple Docker hosts.

When containers are connected to the same overlay network, Docker provides networking between them even when the containers are running on different physical or virtual machines.

Docker uses encapsulation to transport container network traffic between the hosts.

In a Docker Swarm environment, the overlay network allows services running on different swarm nodes to communicate using the service name.

## Difference Between Bridge and Overlay Networks

A bridge network is normally used for communication between containers on the same Docker host.

An overlay network is designed to allow communication between containers or services running across multiple Docker hosts.

## Example

Consider two Docker hosts:

Host 1:
- Frontend container

Host 2:
- Backend container
- Database container

If the containers are connected to the same overlay network, the frontend can communicate with the backend even though they are running on different Docker hosts.

## Conclusion

Docker overlay networks are useful for distributed applications where containers run across multiple Docker hosts. They provide a virtual network that enables communication between containers on different hosts.
