1. Objective

Briefly explain the goal:

Understand adduser
Understand useradd
Know the difference
Create a test user on Ubuntu

adduser

adduser is a higher-level and user-friendly command used to create a new Linux user. It provides an interactive process and asks for details such as password, full name and other information.

Command used: sudo adduser testuser

useradd

useradd is a lower-level command used to create a Linux user account. It provides basic user creation functionality and usually requires additional options for configuring the account.

Example: sudo useradd testuser

Difference

adduser is higher-level and easier to use.
useradd is a lower-level command.
adduser is interactive and asks for user information.
useradd is generally non-interactive unless options are provided.
adduser is generally preferred for manually creating users on Ubuntu.
useradd is useful for scripting and situations where more control is required.

Practical Work

I created a test user using sudo adduser testuser.

The command asked for a password and additional user information such as full name, room number, work phone and home phone. I left the optional information blank and confirmed the user creation.

Verification

I used id testuser to verify the user's UID, GID and group information.

The output showed that testuser was created with UID 1002 and GID 1002.

I then used grep testuser /etc/passwd to check the user's entry in the /etc/passwd file. It showed the user's home directory as /home/testuser and login shell as /bin/bash.

Finally, I used ls -ld /home/testuser to verify that the user's home directory was created.

Observation

The practical confirmed that adduser provides an interactive and simple way to create a user on Ubuntu. The user account, groups and home directory were created successfully.

Conclusion

I learned the difference between adduser and useradd. adduser is easier for manual user creation on Ubuntu, while useradd provides a lower-level approach that is useful for scripting and advanced configuration.



