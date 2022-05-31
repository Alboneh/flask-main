import os
from datetime import timedelta
from flask import Flask,jsonify,request
from util import Preprocessing
from flask_jwt_extended import JWTManager,create_access_token,jwt_required,get_jwt_identity
from database import init,getalluser,registerdb,logindb
from flask_cors import CORS


#init flask and sql
app = Flask(__name__)
CORS(app)
mysql = init(app)

#load tensorflow model
preprocess = Preprocessing("model.h5")
prediction_results = preprocess.predict()

#JWT
app.config["JWT_SECRET_KEY"] = "capstone-secret-key" 
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
jwt = JWTManager(app)

@app.route('/', methods=['GET'])
def index():
    #current_user = get_jwt_identity()
    #return jsonify(logged_in_as=current_user), 200
    return "Hello World"

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    pwd = request.form['password']
    try:
        user = logindb(mysql,email,pwd)
        if user != "":
            access_token = create_access_token(identity=email)
            data = {"message": "Login Successful" , "user": user, "access_token" : access_token}
            return jsonify(data),200
        return jsonify({"msg": "username atau password salah"}), 401
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err

@app.route('/predict', methods=['GET'])
@jwt_required()
def predict():
    try:
        data = {'success': 'true','data': prediction_results}                                                                                                                                                                                                                                                 
        return jsonify(data)
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err

@app.route("/predict/<product_name>", methods=['GET'])
@jwt_required()
def predictByProductName(product_name):
    try:
        try:
            data = next(product for product in prediction_results if product["product_name"] == product_name)
        except:
            return jsonify(status_code=404, content = {"message": f"Product '{product_name}' doesn\'t exist"})
        days = request.args.get('days', type = int)
        if (days != None):
            newdata = data["predictions"][:days]
            return jsonify(predictions=newdata)
        return data
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err

@app.route("/<product_name>", methods=['POST'])
@jwt_required()
def input_product(product_name):
    try:
        input_date = str(request.form['input_date'])
        sold = float(request.form['sold'])
        try:
            data = next(product for product in prediction_results if product["product_name"] == product_name)
        except:
            return jsonify(status_code=404, content = {"message": f"Product '{product_name}' doesn\'t exist"})
        
        prediction = next(item for item in data["predictions"] if item["date"] == input_date)
        prediction["real"] = sold
        return data
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err

@app.route('/register', methods=['POST'])
def register():
    username = request.form['name']
    email = request.form['email']
    pwd = request.form['password']
    try:
        return registerdb(mysql,username,email, pwd)
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err
 
@app.route('/users',methods=['GET'])
def userlist():
    try:
        user = getalluser(mysql)
        return jsonify(user)
    except Exception as e:
         err = jsonify(msg=f'{e}')
         return err


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 80)))
    #$Env:PORT=4000
    

#@app.route('/predict', methods=['POST'])
#def predictpost():
#    model = preprocess.predict(request.form['key1'])
#   return model
#
