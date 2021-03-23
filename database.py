import mysql.connector
import hashlib
import time

password = open("./password.txt", "r").read()
mydb = mysql.connector.connect(
    host="localhost", user="root", password=password, database="messages")

mycursor = mydb.cursor()


def hash(input):
    hasher = hashlib.sha256()
    hasher.update(input.encode())
    return hasher.hexdigest()


def createTable():
    mycursor.execute(
        "CREATE TABLE users (username VARCHAR(255) PRIMARY KEY, phone VARCHAR(255), password VARCHAR(255))")
    mycursor.execute("CREATE TABLE messages (username VARCHAR(255), timestamp VARCHAR(255), message VARCHAR(255), sender VARCHAR(255))")
    mycursor.execute("CREATE TABLE chats (username VARCHAR(255), address VARCHAR(255))")
    mycursor.execute("SHOW TABLES")


def addUser(username, phone, password):
    try:
        password = hash(password)
        sql = "INSERT INTO users (username, phone, password) VALUES (%s,%s,%s)"
        val = (username, phone, password)
        mycursor.execute(sql, val)
        mydb.commit()
        return password
    except mysql.connector.errors.IntegrityError:
        return("username already exists")

def getData():
    mycursor.execute("SELECT * FROM users")
    data = mycursor.fetchall()
    return data

def getUsernames():
    try:
        mycursor.execute("SELECT username FROM users")
        data = mycursor.fetchall()
        data = [item[0] for item in data]
        return (data)
    except:
        return("invalid username")

def getUserByUsername(username):
    mycursor.execute("SELECT * FROM users WHERE username='"+username+"'")
    res = mycursor.fetchall()
    return (res)


def getUserByPhone(phone):
    sql = "SELECT * FROM users WHERE phone='"+phone+"'"
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


def changeEmail(username, phone, password):
    user = getUserByUsername(username)[0]
    if password == user[2]:
        sql = "UPDATE users SET phone=%s WHERE username=%s"
        val = (phone, username)
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


def addMessage(address, message, timestamp, sender):
    sql = "INSERT INTO messages (username, timestamp, message, sender) VALUES (%s,%s,%s,%s)"
    val = (address, timestamp, message, sender)
    mycursor.execute(sql, val)
    mydb.commit()

def getMessages(username, sender):
    mycursor.execute("SELECT * FROM messages WHERE (username='"+username+"' AND sender='"+sender+"') OR (username='"+sender+"' AND sender='"+username+"') AND timestamp > '"+str(time.time()-2592000)+"'")
    temp = mycursor.fetchall()
    return temp

def getChats(username):
    mycursor.execute("SELECT address FROM chats WHERE username ='"+username+"'")
    temp = mycursor.fetchall()
    temp = [list(item) for item in temp]
    return str(temp)

def createChat(username, address):
    mycursor.execute("SELECT EXISTS(SELECT * FROM chats WHERE username='"+username+"' AND address='"+address+"')")
    if mycursor.fetchall()[0][0]==0:
        mycursor.execute("INSERT INTO chats (username, address) VALUES ('"+username+"','"+address+"')")
        mycursor.execute("INSERT INTO chats (username, address) VALUES ('"+address+"','"+username+"')")
        mydb.commit()