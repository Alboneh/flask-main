package io.github.nikita756.utils

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import io.github.nikita756.response.DataProductResponse
import io.github.nikita756.response.LoginResponse
import io.github.nikita756.response.UserItem
import io.github.nikita756.utils.Constant.Companion.PRODUCT
import io.github.nikita756.utils.Constant.Companion.TOKEN
import io.github.nikita756.utils.Constant.Companion.USERNAME
import io.github.nikita756.utils.LocalStore.dataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map


object LocalStore {

    private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "Setting")

    fun getTokenUser(context: Context): Flow<LoginResponse>{
        return context.dataStore.data.map { preferences ->
            LoginResponse(
                accessToken = preferences[TOKEN]
            )
        }
    }

    fun getNameProduct(context: Context): Flow<DataProductResponse>{
        return context.dataStore.data.map { preferences ->
            DataProductResponse(
                productName = preferences[PRODUCT]
            )
        }
    }

    fun getUsername (context: Context): Flow<UserItem>{
        return context.dataStore.data.map {
            preferences ->
            UserItem(
                username = preferences[USERNAME]

            )
        }
    }


    suspend fun updateTokenUser(context: Context,login: LoginResponse) = context.dataStore.edit { prefrences ->
        login.accessToken?.let { prefrences[TOKEN] = it }
    }

    suspend fun saveProductName(context: Context, dataProductResponse: DataProductResponse)= context.dataStore.edit { pref ->
        dataProductResponse.productName?.let { pref[PRODUCT] = it }

    }

    suspend fun saveUsername(context: Context,userItem: UserItem)=context.dataStore.edit {
        pref -> userItem.username?.let { pref[USERNAME]=it }
    }


}