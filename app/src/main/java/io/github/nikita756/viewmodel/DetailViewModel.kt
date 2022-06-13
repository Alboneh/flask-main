package io.github.nikita756.viewmodel

import android.content.Context
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.nikita756.utils.LocalStore
import io.github.nikita756.network.AppConfig
import io.github.nikita756.response.DataProductResponse
import io.github.nikita756.response.ProductResponse
import kotlinx.coroutines.launch

class DetailViewModel : ViewModel() {

    private var _productList = MutableLiveData<List<ProductResponse>>()
    val productList get() = _productList


    suspend fun getProduct(productName: String,token: String,context: Context) = viewModelScope.launch {
        AppConfig().appService.getProduct(token,productName).let {
            if (it.isSuccessful){
                it.body()?.let {

                    _productList.value = it.predictions!!
                    val nameProduk = DataProductResponse(productName = it.productName, )
                    LocalStore.saveProductName(context,nameProduk)
                }
            }else{

            }
        }
    }
}