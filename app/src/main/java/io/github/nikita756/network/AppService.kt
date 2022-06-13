package io.github.nikita756.network

import io.github.nikita756.response.*
import retrofit2.Call
import retrofit2.Response
import retrofit2.http.*

interface AppService {

    // ApiEndPoint
    @FormUrlEncoded
    @POST("register")
   suspend fun register(
        @Field("name") name: String,
        @Field("email") email: String,
        @Field("password") password: String,
    ): Response<RegisterResponse>

    @FormUrlEncoded
    @POST("login")
   suspend fun login(
        @Field("email") email: String,
        @Field("password") password: String,
    ): Response<LoginResponse>

    @GET("predict")
    fun getPrediction(
        @Header("Authorization") token: String
    ): Call<PredictResponse>

    @GET("predict/{product_name}")
    suspend fun getProduct(
        @Header("Authorization") token: String,
        @Path("product_name") productName: String
    ): Response<DataProductResponse>

    @FormUrlEncoded
    @POST("predict/{name}")
    suspend fun postSales(
        @Header("Authorization") token: String,
        @Path("name") productName: String,
        @Field("input_date") date : String,
        @Field("sold") sold : String,
    ): SalesResponse
}