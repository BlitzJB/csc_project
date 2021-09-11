import googlesheetsdb
import mysql.connector
from mysql.connector import connection

client = googlesheetsdb.Client(path_to_credentials='creds.json', spreadsheet_id='1n7eW-dZApNReYY3xOHEsXJSi3qP-__YyxYPHA_I9EgA')

def get_user(cookie):
  user=client.select('users','record["COOKIE"]=="{}"'.format(cookie))
  user=user.pop()
  return user

def get_posts():
  data=client.get('posts')
  data.pop(0)
  return data

def create_post(author,title,content):
  client.insert('posts',[author,title,content])
  
def get_user_profile_picture(email):
  mydb=mysql.connector.connect(host="localhost",user="root",passwd="timcooksmyfood",database="profiles")
  mycursor=mydb.cursor()
  get_user_profile_picture_="select * from profile_info where EMAIL='{}'".format(email)
  mycursor.execute(get_user_profile_picture_)
  data=mycursor.fetchall()
  return data

def set_user_profile_picture(email, picture):
  mydb=mysql.connector.connect(host="localhost",user="root",passwd="timcooksmyfood",database="profiles")
  mycursor=mydb.cursor()
  # checking if entry already exists
  profile_picture=get_user_profile_picture(email)
  if profile_picture == []: # when there is no result
    insert_query="insert into profile_info values ('{}', '{}')".format(email,picture)
    mycursor.execute(insert_query)
  else: # otherwise when there already is an entry in the database
    update_query="update profile_info set FNAME='{}' where EMAIL='{}'".format(picture,email)
    mycursor.execute(update_query)
  mydb.commit()

def update_cookie(email,cookie):
  client.set('users','COOKIE',cookie,'record["EMAIL"]=="{}"'.format(email))
  
def create_user(data):
  data_list = [data['name'], data['email'], data['password'], False, data['cookie']]
  client.insert('users', data_list)

def authenticate_user(data):
  email=data['email']
  user=client.select('users','record["EMAIL"]=="{}"'.format(email))
  user=user.pop()
  if user[2]==data['password']:
    return True
  else:
    return False
  
def get_doctors():
  data=client.get('Doctors')
  data.pop(0)
  return data

def get_doc_link(doc_name):
  doc_link=client.select('Doctors','record["doc_name"]=="{}"'.format(doc_name))
  return doc_link