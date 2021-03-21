import mysql.connector
import hashlib

mydb = mysql.connector.connect(
    host="localhost", user="root", password="Reindeer124?", database="test")

mycursor = mydb.cursor()


def hash(input):
    hasher = hashlib.sha256()
    hasher.update(input.encode())
    return hasher.hexdigest()


def createTable():
    mycursor.execute(
        "CREATE TABLE users (username VARCHAR(255) PRIMARY KEY, email VARCHAR(255), password VARCHAR(255))")
    mycursor.execute("SHOW TABLES")


def addUser(username, email, password):
    try:
        password = hash(password)
        sql = "INSERT INTO users (username, email, password) VALUES (%s,%s,%s)"
        val = (username, email, password)
        mycursor.execute(sql, val)
        mydb.commit()
        return "success"
    except mysql.connector.errors.IntegrityError:
        return("username already exists")

def getData():
    mycursor.execute("SELECT * FROM users")
    data = mycursor.fetchall()
    return data

def getUsernames():
    mycursor.execute("SELECT username FROM users")
    data = mycursor.fetchall()
    data = [item[0] for item in data]
    return (data)

def getUserByUsername(username):
    mycursor.execute("SELECT * FROM users WHERE username='"+username+"'")
    res = mycursor.fetchall()
    return (res)


def getUserByEmail(email):
    sql = "SELECT * FROM users WHERE email='"+email+"'"
    mycursor.execute(sql)
    res = mycursor.fetchall()
    return (res)


def changeUsername(oldUsername, newUsername, password):
    user = getUserByUsername(oldUsername)[0]
    if password == user[2]:
        try:
            sql = "UPDATE users SET username=%s WHERE username=%s"
            val = (newUsername, oldUsername)
            mycursor.execute(sql, val)
            mydb.commit()
            return "success"
        except mysql.connector.errors.IntegrityError:
            return ("username already exists")
    else:
        return("incorrect password")


def changeEmail(username, newEmail, password):
    user = getUserByUsername(username)[0]
    if password == user[2]:
        sql = "UPDATE users SET email=%s WHERE username=%s"
        val = (newEmail, username)
        mycursor.execute(sql, val)
        mydb.commit()
        return "success"
    else:
        return("incorrect password")


def changePassword(username, newPassword, oldPassword):
    user = getUserByUsername(username)[0]
    if oldPassword == user[2]:
        newPassword = hash(newPassword)
        sql = "UPDATE users SET password=%s WHERE username=%s"
        val = (newPassword, username)
        mycursor.execute(sql, val)
        mydb.commit()
        return(newPassword)
    else:
        return("incorrect password")
