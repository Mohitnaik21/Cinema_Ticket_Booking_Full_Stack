`python manage.py runserver`: launch the Django server

Setting Up Database\
Install MySQL. (Not sure exactly what to do on Windows, but https://dev.mysql.com/doc/refman/8.1/en/windows-installation.html should be helpful)\
Leave the port as `3306`.\
Create a database called `cinemadb`.\
Create a user with privileges to that databse named `user` with the password `password`.
\
Next run the following commands to put the correct tables into the database:\
`python manage.py makemigrations`\
`python manage.py migrate`
