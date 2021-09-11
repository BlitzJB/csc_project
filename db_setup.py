import mysql.connector

PASSWORD = "timcooksmyfood"

connection = mysql.connector.connect(host="localhost",user="root",passwd=PASSWORD)
cursor = connection.cursor()

def show_databases(cursor):
  cursor.execute('SHOW DATABASES')
  print(cursor.fetchall())
  
def show_tables(cursor):
  cursor.execute('SHOW TABLES')
  print(cursor.fetchall())
  
def show_table(cursor, table_name):
  cursor.execute(f'DESC {table_name}')
  print(cursor.fetchall())

# show_databases(cursor)

cursor.execute('CREATE DATABASE IF NOT EXISTS profiles')
# show_databases(cursor)

cursor.execute('USE profiles')
# show_tables(cursor)

cursor.execute('CREATE TABLE IF NOT EXISTS profile_info (EMAIL varchar(45) PRIMARY KEY, FNAME varchar(15) NOT NULL)')
# show_table(cursor, 'profile_info')