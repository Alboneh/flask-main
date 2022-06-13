package io.github.nikita756.leftover

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import android.view.WindowManager
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import io.github.nikita756.leftover.login.LoginActivity
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SplashScreen : AppCompatActivity() {

    private val mainViewModel by viewModels<MainViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)

        Handler(mainLooper).postDelayed({
            lifecycleScope.launch {
                mainViewModel.getToken(this@SplashScreen).observe(this@SplashScreen){
                    val targetActivity = if (it.accessToken?.isNotBlank() == true) MainActivity::class.java else LoginActivity::class.java
                    startActivity(Intent(this@SplashScreen,targetActivity))
                }
            }
        },3000)
    }
}