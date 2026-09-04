# Task 1 - Docker Container Networking

## Objective

To create three Docker containers and connect them using different Docker networks.

## Containers Created

- Frontend - Nginx
- Backend - Alpine
- Database - MySQL

## Docker Networks

Three Docker bridge networks were created:

- frontend-network
- backend-network
- database-network

The backend container was connected to two networks:

- frontend-network
- backend-network

The database container was connected to:

- database-network
- backend-network

## Connectivity Test

The backend container successfully communicated with the database container using:

`docker exec backend ping -c 4 database`

Result: 4 packets transmitted, 4 packets received, 0% packet loss.

The backend also successfully communicated with the frontend container using:

`docker exec backend ping -c 4 frontend`

Result: 4 packets transmitted, 4 packets received, 0% packet loss.

## Verification

The `docker ps` command confirmed that the frontend, backend, and database containers are running.

## Conclusion

The three Docker containers were successfully created and connected using multiple Docker networks. Container-to-container connectivity was successfully verified.
