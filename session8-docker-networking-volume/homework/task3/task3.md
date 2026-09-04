# Task 3 - Docker Bind Mount

## Objective

To use a bind mount with an Nginx container and verify that changes made to a file on the host are reflected inside the container without restarting it.

## Website File

A local folder named `website` was created with an `index.html` file.

The initial content was:

Hello students

## Nginx Container

The Nginx container was started with a bind mount:

`docker run -d --name nginx-bind -p 8084:80 -v "$(pwd)/website:/usr/share/nginx/html:ro" nginx:alpine`

## Verification

The website was accessed using:

`curl http://localhost:8084`

The initial page displayed:

Hello students

The `index.html` file was then modified to:

Hello students - File Modified

The page was accessed again without restarting the container.

The modified content was displayed successfully.

## Conclusion

The bind mount was successfully configured. Changes made to the host `index.html` file were immediately reflected by the Nginx container without restarting it.
