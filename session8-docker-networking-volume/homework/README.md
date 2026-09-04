# Docker Networking & Volume Homework

Name: Challa Sahadheep

Enrollment Number: 2024EB10276

## Task 1 - Docker Container Networking

Three Docker containers were created:

- Frontend - Nginx
- Backend - Alpine
- Database - MySQL

Three Docker networks were created:

- frontend-network
- backend-network
- database-network

The backend container was connected to two networks:

- frontend-network
- backend-network

The database container was connected to:

- database-network
- backend-network

Connectivity between the containers was tested successfully using `ping`

## Task 2 - Host Network

An Apache HTTP Server container was created using Docker host networking.

Command used:

`docker run -d --name apache-host --network host httpd:2.4-alpine`

Apache was verified successfully and was listening on port 80.

The Apache webpage was accessed successfully from inside the container and displayed:

**It works!**


## Task 3 - Bind Mount

A local `website` folder was created with an `index.html` file containing:

**Hello students**

The folder was bind mounted to an Nginx container.

The HTML file was then modified while the container was running. The updated content was reflected immediately without restarting the container.



## Task 4 - Overlay Network

A Docker overlay network was researched.

An overlay network allows containers and services running on different Docker hosts to communicate with each other as if they were connected to the same network.

Overlay networks are mainly useful for distributed applications and Docker Swarm environments.

The detailed explanation is available in:

`task4/task4.md`


## Conclusion

The Docker networking and volume exercises were completed successfully.

The exercises covered:

- Docker container networking
- Multiple Docker networks
- Container-to-container connectivity
- Docker host networking
- Bind mounts
- Live file updates using bind mounts
- Docker overlay networks
