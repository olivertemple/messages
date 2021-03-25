from hashlib import new
from types import TracebackType
from flask import Flask, request, render_template
import database
from flask_cors import CORS
from flask_socketio import SocketIO, emit, send


app = Flask(__name__, static_folder="static")
socketio = SocketIO(app)
app.config['SECRET_KEY'] = 'secret!'
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")


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

@app.route("/loginReq", methods=["POST"])
def loginReq():
    request_data = request.get_json()
    username=request_data['username']
    password=request_data['password']
    try:
        temp = database.getUserByUsername(username)[0]
        if temp[2]==database.hash(password):
            return database.hash(password)
        else:
            return("invalid username or password")
    except:
        return("invalid username or password")

@app.route("/loginHash", methods=["POST"])
def loginHash():
    request_data = request.get_json()
    try:
        username=request_data['username']
        password=request_data['password']
        try:
            temp = database.getUserByUsername(username)[0]
            if temp[2]==password:
                return password
            else:
                return("invalid username or password")
        except:
            return("invalid username or password")
    except:
        return "invalid username or password"


@app.route("/getMessages", methods=["POST"])
def getMessages():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']
    sender = request_data['sender']
    temp = database.getUserByUsername(username)[0]
    if temp[2]==password:
        messages = (database.getMessages(username, sender))
        messages = [list(item) for item in messages]
        return str(messages)
    else:
        return "invalid username or password"


@app.route("/sendMessage", methods=["POST"])
def sendMessage():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']
    address = request_data['address']
    message = request_data['message']
    timestamp = request_data['timestamp']
    temp = database.getUserByUsername(username)[0]
    if password == temp[2]:
        database.addMessage(address, message, timestamp, username)
        update(address)
        return("success")
    else:
        return "username or password incorrect"
    
@app.route("/getChats", methods=["POST"])
def getChats():
    request_data=request.get_json()
    username = request_data['username']
    password = request_data['password']
    temp = database.getUserByUsername(username)[0]
    if password == temp[2]:
        chats = database.getChats(username)
        return chats
    else:
        return "invalid username or password"

@app.route("/addChat", methods=["POST"])
def addChat():
    request_data=request.get_json()
    username = request_data['username']
    password = request_data['password']
    address = request_data['address']
    temp = database.getUserByUsername(username)[0]
    if password == temp[2]:
        chats = database.createChat(username, address)
        return database.getChats(username)
    else:
        return "invalid username or password"
###WEBSOCKETS

def update(address):
    socketio.emit(address, "update")

@socketio.on('connect')
def test_connect():
    print("connected")
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

    

if __name__ == '__main__':
    socketio.run(app, debug=True, port="3020", host="0.0.0.0")
