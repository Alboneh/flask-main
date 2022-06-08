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

route '/' (GET)
	di return hello world

route '/login' (POST)
	login data untuk token
	data yang diperlukan:
		email		[form]
		password	[form]

route '/predict'(GET)
	mengambil prediksi dari model
	memerlukan bearer token untuk diakses

route '/predict/<product_name>'(GET)
	mengambil prediksi sepsifik dengan nama produk dari url
	memerlukan bearer token untuk diakses

route '/predict/<product_name>?days=(number)'(GET)
	mengambil prediksi sepsifik dengan nama produk dari url 
		dengan param days berapa hari prediksi akan ditampilkan
	memerlukan bearer token untuk diakses

route '/<product_name>' (POST)
	menginput data pada prediksi model
	data yang diperlukan:
		input_date	[form]
		sold		[form]
route '/register' (POST)
	mendaftarkan akun agar bisa melakukan login
	data yang diperlukan:
		name		[form]
		email		[form]
		password	[form]

route '/users' (GET)
	menampilkan user yang berada pada database
	
