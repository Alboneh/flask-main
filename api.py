import os
from datetime import timedelta
from flask import Flask,jsonify,request,make_response
from util import Preprocessing
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity
from database import init,getalluser,registerdb,logindb
from flask_cors import CORS


preprocess = Preprocessing("model.h5")
app = Flask(__name__)
CORS(app)
mysql = init(app)

#JWT
app.config["JWT_SECRET_KEY"] = "capstone-secret-key" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)

@app.route('/', methods=['GET'])
def index():
    #current_user = get_jwt_identity()
    #return jsonify(logged_in_as=current_user), 200
    return "Hello World"

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    email = request.form['email']
    pwd = request.form['password']
    return registerdb(mysql,username,email, pwd)
 
@app.route('/users',methods=['GET'])
def userlist():
    user = getalluser(mysql)
    return jsonify(user)

    
@app.route('/predict', methods=['GET'])
@jwt_required()
def predict():
  data = {'success': 'true','data': preprocess.predict()}                                                                                                                                                                                                                                                 
  return jsonify(data)

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    pwd = request.form['password']
    user = logindb(mysql,email,pwd)
    if user != "":
        access_token = create_access_token(identity=email)
        data = {"message": "Login Successful" , "user": user, "access_token" : access_token}
        return jsonify(data),200
    return jsonify({"msg": "username atau password salah"}), 401

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 80)))
    #$Env:PORT=4000
    

#@app.route('/predict', methods=['POST'])
#def predictpost():
#    model = preprocess.predict(request.form['key1'])
#   return model
#
