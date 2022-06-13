package io.github.nikita756.network

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class AppConfig {

    // BaseRetrofit
    val appService : AppService

    get(){
        val interceptor = HttpLoggingInterceptor()
        interceptor.level=HttpLoggingInterceptor.Level.BODY

        val client = OkHttpClient.Builder()
            .addInterceptor(interceptor)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl("https://flask-app-vqs2yvkkxa-uc.a.run.app/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        return  retrofit.create(AppService::class.java)
    }
}