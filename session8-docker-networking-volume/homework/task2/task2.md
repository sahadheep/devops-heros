# Task 2 - Docker Host Network

## Objective

To run an Apache2 container using Docker host networking and verify that Apache is running on port 80.

## Apache Container

The Apache HTTP Server image was pulled from Docker Hub and a container was created using the host network.

Command used:

`docker run -d --name apache-host --network host httpd:2.4-alpine`

## Verification

The Apache configuration was verified using:

`docker exec apache-host httpd -t`

The result was:

`Syntax OK`

Apache was also tested from inside the container using:

`docker exec apache-host wget -qO- http://localhost:80`

The response displayed:

`It works!`

The Apache server was confirmed to be listening on port 80.

## Conclusion

The Apache2 container was successfully deployed using Docker host networking. Apache is running and listening on port 80.

