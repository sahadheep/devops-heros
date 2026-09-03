Networking Commands

Objective

To practice basic Linux networking commands and understand how they are used to check network configuration, connectivity, DNS information, and network connections.

Commands Practiced
1. ip -br addr

The ip -br addr command displays the network interfaces and their IP addresses in a short and easy-to-read format.

2. ip route

The ip route command displays the routing table of the system. It shows how network traffic is routed.

3. ping -c 4 google.com

The ping command checks whether a host is reachable over the network. The -c 4 option sends 4 packets and then stops.

4. hostname -I

The hostname -I command displays the IP addresses assigned to the system.

5. getent hosts google.com

The getent hosts command checks DNS/host information and returns the IP address associated with a hostname.

6. ss -tuln

The ss -tuln command displays listening TCP and UDP network sockets along with their port numbers.

7. curl -I https://google.com

The curl -I command sends a request to the website and displays only the HTTP response headers. It can be used to check whether a web server is reachable.


From these commands, I understood how to check the IP address of a system, view its routing table, test network connectivity, resolve domain names, check listening ports, and verify HTTP connectivity.



