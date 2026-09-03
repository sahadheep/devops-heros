#!/bin/bash

echo "Enter your name:"
read -p "Name : " username

current_date=$(date)
host=$(hostname)
disk_usage=$(df -h)

echo "System Information"
echo "Date: $current_date"
echo "Hostname: $host"
echo "Username: $username"

echo ""
echo "  Disk Usage "
echo "$disk_usage"

mkdir -p system_info
touch system_info/running_processes.txt

ps > system_info/running_processes.txt

echo ""
echo "Running processes have been stored in system_info/running_processes.txt"
echo " Running Processes "
cat system_info/running_processes.txt
