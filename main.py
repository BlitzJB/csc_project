from flask import Flask, request, url_for, redirect
from flask.templating import render_template
from db import *
from secrets import token_hex
from urllib.parse import quote_plus

app = Flask(
  __name__,
  static_folder='./static',
  template_folder='./templates'
)
app.add_template_filter(quote_plus)

@app.route('/')
def index(): 
  cookie=dict(request.cookies)
  if 'access_token' not in cookie.keys():
    return render_template('index.html')

  access_token=cookie['access_token']

  if get_user(access_token)[3]=='TRUE':
    return render_template('index.html', isAdmin = True, isLoggedIn = True)
  elif access_token=='anbiguous': 
    return render_template('index.html')
  else:
    return render_template('index.html', isLoggedIn = True)

@app.route('/beds', methods=['GET', 'POST'])
def beds():
  return render_template('beds.html')

@app.route('/vaccines', methods=['GET', 'POST'])
def vaccines():
  return render_template('vaccines.html')

@app.route('/humanitarian_aid', methods=['GET', 'POST'])
def humanitarian_aid():
  return render_template('humanitarian_aid.html', pdata = get_posts())


@app.route('/register', methods=['GET','POST'])
def register():
  if request.method=='GET':
    return render_template('register.html')
  if request.method=='POST':
    data=dict(request.form)
    random_cookie=token_hex(16)
    data['cookie']=random_cookie
    create_user(data)
    url=url_for('index')
    response=redirect(url)
    response.set_cookie('access_token',random_cookie)
    return response

@app.route('/login',methods=['GET','POST'])
def login():
  if request.method=='GET':
    return render_template('login.html')
  elif request.method=='POST':
    data=dict(request.form)
    if authenticate_user(data)==True:
      random_cookie=token_hex(16)
      update_cookie(data['email'], random_cookie)
      url=url_for('index')
      response=redirect(url)
      response.set_cookie('access_token',random_cookie)
      return response
  else:
    return render_template('not_authorized.html')
  
@app.route('/admin', methods=['GET', 'POST'])
def admin():
  cookie=dict(request.cookies)
  access_token=cookie['access_token']
  if request.method=='GET':
    if 'access_token' not in cookie.keys():
      return render_template('not_authorized.html')


    if get_user(access_token)[3]=='TRUE':
      return render_template('admin.html', pdata = get_posts())
    else:
      return render_template('not_authorized.html')
  elif request.method == 'POST':
    data = dict(request.form)
    user = get_user(access_token)
    name = user[0]
    create_post(name, data['title'], data['content'])
    return redirect(url_for('admin'))

@app.route('/profile', methods=['GET', 'POST'])
def profile():
  cookie=dict(request.cookies)
  if request.method=='GET':
    if 'access_token' not in cookie.keys():
      return render_template('not_authorized.html')
    user = get_user(cookie['access_token'])
    email = user[1]
    profile_picture = get_user_profile_picture(email)
    if profile_picture == []:
      profile_picture = [(email, 'default.png')]
    return render_template('profile.html', pdata = user, profile_picture = profile_picture)
  if request.method=='POST':
    data = dict(request.form)
    picture = data['picture']
    user = get_user(cookie['access_token'])
    email = user[1]
    set_user_profile_picture(email, picture)
    return redirect(url_for('profile'))
    
    
@app.route('/logout', methods=['POST'])
def logout():
  response = redirect(url_for('index'))
  response.set_cookie('access_token', 'anbiguous')
  return response

@app.route('/doctors')
def doctors():
  data=get_doctors()
  return render_template('doctors.html',ddata=data)

@app.route('/pay_doctors')
def pay_docs():
  dname = request.args.get('dname')
  return render_template('pay_doctors.html', dname = dname)

@app.route('/get_doctor_link')
def get_link():
  dname = request.args.get('dname')
  link = get_doc_link(dname)
  link = link[1][3]
  return render_template('get_doctor_link.html', link=link, dname=dname)

app.run(debug = True)
