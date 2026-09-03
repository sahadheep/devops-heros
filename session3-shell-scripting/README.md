System Information Script

Objective

The objective of this task is to create a shell script that displays basic system information and stores running process information in a file.

Script

The script is saved as:

system_info.sh

Commands Used
Current Date

date

Used to display the current date and time.

Hostname

hostname

Used to display the hostname of the system.

Username

read -p

Used to take the username as input from the user.

Disk Usage

df -h

Used to display disk usage in a human-readable format.

Running Processes

ps

Used to display the currently running processes.

Create Directory

mkdir -p system_info

Creates the system_info directory.

Create File

touch system_info/running_processes.txt

Creates the file used to store the running process information.

Output Redirection

ps > system_info/running_processes.txt

Stores the output of the ps command in the file using > output redirection.

Variables Used

The script uses variables to store system information.

current_date=$(date)

host=$(hostname)

disk_usage=$(df -h)

These variables are then used while displaying the system information.

Script Execution

The script was made executable using:

chmod +x system_info.sh

The script was executed using:

./system_info.sh

Output

The script displays:

Current date
Hostname
Username entered by the user
Disk usage
Running processes

The running process information is also stored in:

system_info/running_processes.txt

Conclusion

The shell script successfully demonstrates variables, user input, system information commands, directory and file creation using mkdir and touch, and output redirection using >.




