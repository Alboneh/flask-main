# Bangkit Capstone Project C22-PS152 API Documentation

This repository contains the documentation for [LeftOver](https://flask-app-vqs2yvkkxa-uc.a.run.app/) API.

<h2>Table of Contents</h2>
<ol>
  <li>Overview</li>
  <li>How to run?</li>
  <ul>
    <li>Machine Learning Documentation</li>
    <li>Mobile Development Documentation</li>
    <li>Cloud Computing Documentation</li>
  </ul>
  <li>Resource</li>
  <li>Team Member of C22-PS152</li>
</ol>

## 1. Overview

   Millions of tons of food wasted yearly caused by excessively stocked supplies that quickly becomes non-edible 
that has to be thrown away. Here we see an opportunity of using ML as a key in supply chain.
    Leftover is application that trying to tackle this problem by obtaining Restaurant forecasting of the right 
amount of food they have to be served and help restaurant to optimize their inventory, 
thereby lowering operational costs and help maximize profits.

## 2. How to run?
 This API has been deployed using google cloud (Cloud Run) u can access it here:
  ```
   https://flask-app-vqs2yvkkxa-uc.a.run.app/
  ```
  If u want to run it locally u need to:
  - Clone this repository `https://github.com/Alboneh/flask-main.git`
  - Open terminal and create venv using `python -m venv venv`
  - Install all requirement with `pip install -r requirements.txt`
  - Run `python api.py` in terminal to run flask
  - use url `http://127.0.0.1/` to access all api endpoint

## Machine Learning Documentation
<p>The process of Data Preparation and Modeling can be accessed in <a href="https://colab.research.google.com/drive/1cCAh3e3iVQRfrrMAU6q_aY36ZBpgxVvP?usp=sharing"></a>this Google Colaboratory</p>
<ol>
	<li><h3>Load <a href="https://github.com/Alboneh/flask-main/blob/main/Groceries_dataset.csv">Dataset</a> and Import Necessary Modules</h3></li>
	<p>Load the Grocery Store dataset and import the required modules which are NumPy, Pandas, and Matplotlib</p>
	<li><h3>Do Data Preprocessing and Exploratory Data Analysis<h3></li>
	<p>The dataset received should be processed first before considered ready to feed into Machine Learning model. Handling missing values and dropping unnecessary column needs to be done for the data to be relevant. Then followed by windowing the dataset, and splitting it into 80% of training and 20% of testing data.</p>
	<li><h3>Modeling and Hyperparameter Tuning</h3></li>
	<p>By importing TensorFlow libraries, now we are able to build the model architecure. To handle time series data, we need layers that's good at memorizing sequential data, such as Recurrent Neural Network and Long Short-Term Memory</p>
		<p>Hyperparameter Tuning also conducted, and iteratively improve on architecture complexity like the amount of layers and neurons with different activation function and Learning Rate Scheduler to pick the best learning rate with the lowest loss.</p>
	<li><h3>Testing Prediction Performance</h3></li>
		<p>After the model is ready, we have to test the model to see how it performs on the testing dataset. And the result was pretty good with the Mean Absolue Error as the metric that was ranging from 1% to 2.5%</p>
		<li><h3>Convert model into H5 Format</h3></li>
		<p>The previous model then was converted into H5 format so it can be loaded using TensorFlow load_model and store it into a different variable, so it can be integrated with the API we built.</p>
</ol>

## Cloud Computing Documentation

![plot](./static/cloudimage2.png)

- ### 1. Creating Flask App to load model from Machine Learning
  - Create simple flask api with the name `api.py`
  - save model and dataset for Machine learning in same directory as `api.py`
  - Load the model in `api.py`
  - create endpoint and test model by running flask using `python api.py` to run it locally and getting predicted data using local ip.
- ### 2. creating Login and Register with Authentication in flask
  - Creating simple Login and Register using dummy database
  - create Json Web Token(JWT) to authenticate login and register
  - create JWT requirement to request prediction
  - change dummy database to cloud sql database
  - Test database to user login and register
  - Test authentication JWT using POSTMAN
- ### 3. Google Cloud Deployment
  - create Dockerfile and requirement.txt to store depedency and place it in root directory
  - clone flask repository `https://github.com/Alboneh/flask-main.git` in cloud shell
  - run this command to build container and push it to container registry
      ```
    docker build -t flask-app:v1 .
    docker tag flask-app:v1 gcr.io/western-beanbag-351610/flask-app:v1
    docker push gcr.io/western-beanbag-351610/flask-app:v1
    ```
  - Enable Cloud Run
  - select flask-app image container and deploy to cloud run 
- ### 4. ci/cd pipeline with Cloud Build
  - Enable Cloud Build
  - create cloudbuild.yaml and write command to build new docker container,push it to container registry and run it everytime it trigger
  - open CloudBuild and select repository and cloudbuild.yaml as config
  - select trigger to everytime push happen in main branch
  - build cloudbuild trigger
  - add permission to cloudbuild service acccount and run the trigger to automate deployment
 
- ### 5. Create Documentation using Swagger UI
  - Create all available request url in POSTMAN and save it to Collection
  - export Collection to SwaggerHub and turn it into yaml
  - edit Response and UI in Swagger Editor
  - export swagger into json and save it into flask directory
  - create endpoint to load swagger in flask

### 3. Resource
  - All resource/route that Leftover APi use have been documented using Swagger UI in:
      ```
    https://flask-app-vqs2yvkkxa-uc.a.run.app/doc/
    ```
  - if u want to run it locally using `python api.py` then:
       ```
    http://127.0.0.1/doc
    ```
## 4. Team Member of C22-PS152
<ol>
	<li>Daniel Bernard Sahala Simamora - M2115G1456</li>
	<li>Naufal Daffa Abdurahman - M2314G2724</li>
	<li>Naufal Ramadhan - A2143H1638</li>
	<li>Nikita Dewi Kurnia Salwa - A2183F1776</li>
	<li>Daniel Hendra Andriyanto - C7004F0150</li>
	<li>Ibrahim Bin Purwanto - C2183F1777</li>
<ol>
	
