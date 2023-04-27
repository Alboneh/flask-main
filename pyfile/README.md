# bangkit-capstone-project API Documentation

This repository contains the documentation for [Leftover](https://flask-app-vqs2yvkkxa-uc.a.run.app/) API.

## 1. Overview

   Millions of tons of food wasted yearly caused by excessively stocked supplies that quickly becomes non-edible 
that has to be thrown away. Here we see an opportunity of using ML as a key in supply chain.
    Leftover is application that trying to tackle this problem by obtaining Restaurant forecasting of the right 
amount of food they have to be served and help restaurant to optimize their inventory, 
thereby lowering operational costs and help maximize profits.

Leftover APi is Flask based API that handle all request that this application need. All requests are made to endpoints beginning:
https://flask-app-vqs2yvkkxa-uc.a.run.app/

## 2. Authentication
   To use majority of this API u need to have authentication token,Authentication token created using
Json Web Token(JWT) that will be given everytime user login to application.


## 3. Resource
All resource/route that Leftover APi use have been documented using Swagger UI in:
https://flask-app-vqs2yvkkxa-uc.a.run.app/doc

## 4. Deployment
Leftover APi is deployed using google cloud run that use cloud build as ci/cd pipeline that connected to this main repository

![plot](./static/cloudimage2.png)
	
