# Task 1: Soft Link and Hard Link

## Objective

To understand the difference between soft links and hard links in Linux and practice creating and deleting them.

## 1. Soft Link

A soft link, also called a symbolic link, is a file that points to another file or directory.

Command used:

bash
ln -s original.txt softlink.txt


I checked the link using:

bash
ls -l


The output showed:

text
softlink.txt -> original.txt


This means `softlink.txt` is pointing to `original.txt`.

## 2. Hard Link

A hard link is another name for the same file data on the filesystem. Both the original file and the hard link point to the same inode.

Command used:

bash
ln original.txt hardlink.txt


I checked the inode numbers using:

bash
ls -li


The output showed that `original.txt` and `hardlink.txt` had the same inode number:

text
1507 hardlink.txt
1507 original.txt

The soft link had a different inode:

text
1567 softlink.txt -> original.txt


## 3. Deletion Test

I deleted the original file using:

bash
rm original.txt


After deleting it, I checked the hard link:

bash
cat hardlink.txt


The hard link still displayed:

text
This is my original file


I then checked the soft link:

bash
cat softlink.txt


It returned:

text
cat: softlink.txt: No such file or directory


### Observation

The hard link continued to work because it points to the same inode as the original file.

The soft link stopped working because it points to the path/name `original.txt`, which was deleted.

## 4. Difference Between Soft Link and Hard Link

Soft Link                                Hard Link                                       
 Created using `ln -s`                    Created using `ln`                              
 Has a different inode                    Shares the same inode                           
 Points to the file path/name             Points to the same file data/inode              
 Becomes broken if the target is deleted  Still works if the original filename is deleted 
 Can normally point to directories        Normally used for files                         
 Can cross filesystems                    Cannot cross filesystems                        

## 5. Commands Practiced

```bash
echo "This is my original file" > original.txt
ln -s original.txt softlink.txt
ln original.txt hardlink.txt
ls -l
ls -li
cat original.txt
cat hardlink.txt
cat softlink.txt
rm original.txt
rm hardlink.txt softlink.txt
```

## Conclusion

A soft link is a reference to another file path, while a hard link is another directory entry for the same inode. The practical deletion test showed that a hard link can still access the file data after the original filename is removed, whereas a soft link becomes broken.

