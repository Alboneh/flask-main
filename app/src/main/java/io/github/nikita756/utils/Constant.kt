package io.github.nikita756.utils

import androidx.datastore.preferences.core.stringPreferencesKey

class Constant {
    companion object {
        val TOKEN = stringPreferencesKey("token")
        val PRODUCT = stringPreferencesKey("product")
        val USERNAME = stringPreferencesKey("username")

    }
}