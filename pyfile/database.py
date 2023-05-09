from flask import jsonify
from flask_mysqldb import MySQL
import psycopg2

def init():
    # app.config['MYSQL_HOST'] = '35.225.58.130'
    # #app.config['MYSQL_UNIX_SOCKET'] = '/cloudsql/western-beanbag-351610:us-central1:capstonedatabase2'
    # app.config['MYSQL_USER'] = 'capstonedatabase'
    # app.config['MYSQL_PASSWORD'] = 'bangkit3342'
    # app.config['MYSQL_DB'] = 'flask-data'
    # app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    conn = psycopg2.connect(
        database="postgres", user='root', password='root', host='local_pgdatabase', port= '5432'
    )
    return conn

def getalluser(mysql):
    cur = mysql.cursor()
    cur.execute('SELECT * FROM "user"')
    user = cur.fetchall()
    cur.close()
    return user

def registerdb(mysql,username,email, pwd):
    cur = mysql.cursor()
    user = cur.execute("SELECT * FROM user WHERE email=(%s)",(email,))
    if user > 0:
        return jsonify({"msg":"Email already exist"}),401
    cur.execute("INSERT INTO user(username, email, password) VALUES (%s, %s, %s)", (username,email, pwd))
    mysql.connection.commit()
    id = cur.lastrowid
    cur.execute("SELECT * FROM user where id=(%s)",(id,))
    userdetail = cur.fetchall()
    cur.close()
    return jsonify({
        "msg":"Registration successfull",
        "data":userdetail
    })

def logindb(mysql, email, password):
    cur = mysql.cursor()
    cur.execute('SELECT name, password FROM "user" WHERE name = (%s) AND password = (%s)', (email, password))
    user = cur.fetchall()
    cur.close()
    
    if user is not None and len(user) > 0:
        login = user
        return login
    
    return ""
