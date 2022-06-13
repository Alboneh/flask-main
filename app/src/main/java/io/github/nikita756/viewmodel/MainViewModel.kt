package io.github.nikita756.viewmodel

import android.content.ContentValues.TAG
import android.content.Context
import android.util.Log
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import io.github.nikita756.utils.LocalStore
import io.github.nikita756.network.AppConfig
import io.github.nikita756.response.*
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class MainViewModel : ViewModel() {

    private var _predictList = MutableLiveData<PredictResponse>()
    val predictList get() = _predictList

    private var _isSuccess = MutableLiveData<Boolean>()
    val isSuccess get() = _isSuccess

    private var _isFailed = MutableLiveData<Boolean>()
    val isFailed get() = _isFailed

    private var _msg = MutableLiveData<String>()
    val msg get() = _msg


    fun getPredict(token:String) {


        AppConfig().appService.getPrediction(token).enqueue(object :Callback<PredictResponse>{
            override fun onResponse(
                call: Call<PredictResponse>,
                response: Response<PredictResponse>
            ) {
                if (response.isSuccessful){
                    response.body()?.let { predictResponse ->
                        _predictList.value = predictResponse



                    }
                } else {
                    Log.d(TAG, "onResponse: Failed = ${response.errorBody()}")
                }
            }

            override fun onFailure(call: Call<PredictResponse>, t: Throwable) {
                Log.d(TAG, "onFailure: ${t.message}")
            }
        })
    }

    fun getToken(context: Context) = LocalStore.getTokenUser(context).asLiveData()



//LoginViewModel
    fun getUser(context:Context)= LocalStore.getUsername(context).asLiveData()
    suspend fun getLoginAccount(email: String,password: String,context: Context) = viewModelScope.launch {
        AppConfig().appService.login(email,password).let {
            if (it.isSuccessful){
                _isSuccess.value = true
                _isFailed.value = false
                _msg.value = it.body().toString()
                it.body()?.let { loginres->

                    //this to save token
                    LocalStore.updateTokenUser(context,loginres)


                   loginres.user?.first()?.let {user->
                       LocalStore.saveUsername(context,user)


                   }


                }
            }else{
                _isSuccess.value = false
                _isFailed.value = true
                _msg.value = it.errorBody().toString()
            }
        }
    }


//RegisterViewModel
    suspend fun registerUserAccount(name: String,email: String,password: String) = viewModelScope.launch {
        AppConfig().appService.register(name,email,password).let {
            if (it.isSuccessful){
                _isSuccess.value = true
                _isFailed.value = false


            }else{
                _isSuccess.value = true
                _isFailed.value = false
            }
        }
    }
}