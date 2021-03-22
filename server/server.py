from hashlib import new
from flask import Flask, request
import database
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route("/addUser", methods=["POST"])
def addUser():
    request_data = request.get_json()
    username = request_data['username']
    email = request_data['email']
    password = request_data['password']

    temp = database.addUser(username, email, password)

    return temp

@app.route("/checkUsername",methods=["POST"])
def checkUsername():
    request_data = request.get_json()
    username = request_data['username']

    usernames = database.getUsernames()

    if username not in usernames:
        return("available")
    else:
        return("taken")

@app.route("/changeUsername", methods=["POST"])
def changeUsername():
    request_data = request.get_json()
    oldUsername = request_data['username']
    password = request_data['password']
    newUsername = request_data['newUsername']

    temp = database.changeUsername(oldUsername,newUsername,password)

    return temp

@app.route("/changeEmail",methods=['POST'])
def changeEmail():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']
    newEmail = request_data['newEmail']

    temp = database.changeEmail(username, newEmail, password)

    return temp

@app.route("/changePassword",methods=["POST"])
def changePassword():
    request_data = request.get_json()
    username = request_data['username']
    oldPassword = request_data['password']
    newPassword = request_data['newPassword']

    temp = database.changePassword(username, newPassword, oldPassword)

    return(temp)

@app.route("/login", methods=["POST"])
def login():
    request_data = request.get_json()
    username=request_data['username']
    password=request_data['password']
    temp = database.getUserByUsername(username)[0]

    if temp[2]==database.hash(password):
        return("success")
    else:
        return("invalid password")

if __name__ == '__main__':
    app.run(debug=True, port=5000, host="127.0.0.1")
