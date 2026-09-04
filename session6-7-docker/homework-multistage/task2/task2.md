Docker Multi-Stage Build - Task 2

Student Details

Name: Challa Sahadheep

Enrollment Number: 10276

Objective

To document the successful execution of a Docker multi-stage build application and verify that the application is running on port 8080.

Application Output

The Docker application was successfully built and run using a multi-stage Dockerfile.

The application displays:

Hello World from Docker multi-stage build

Docker Container Verification

The running container was verified using the docker ps command.

The container is running on port 8080.

Commands Used:
docker build -t multistage-hello .
docker run -d -p 8080:8080 --name multistage-container multistage-hello
docker ps
curl http://localhost:8080

Conclusion

The multi-stage Docker build was successfully created and deployed. The application is accessible on port 8080, and the running container was verified using docker ps.


