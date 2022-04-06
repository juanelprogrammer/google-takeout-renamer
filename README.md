###When backing up all my Google Photos media I found out that Google renames all the files and almost always deletes the metadata and preserves it in a JSON file.
For better organization, I created this simple script to rename all the files according to the respective JSON, so I can sort by date.

Just launch the script with node script.js on the root folder where your photos from Takeout are. 

Also, you can create an executable file with the module "pkg", so its easier to rename files in different folders. Just copy the .exe file and execute it.
