package io.github.nikita756.leftover.login

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.widget.doOnTextChanged
import androidx.lifecycle.lifecycleScope
import io.github.nikita756.leftover.MainActivity
import io.github.nikita756.leftover.databinding.ActivityLoginBinding
import io.github.nikita756.leftover.register.RegisterActivity
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {

    private val mainViewModel by viewModels<MainViewModel>()
    private val isValid = mutableListOf(false, false, false)

    private lateinit var binding: ActivityLoginBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        getSupportActionBar()?.hide()
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setObserverAllData()

        binding.tvSignup.setOnClickListener {
            val moveregist = Intent(this@LoginActivity,RegisterActivity::class.java)
            startActivity(moveregist)
        }

        binding.btnLogin.setOnClickListener {
            val email = binding.inputEmail.text.toString()
            val password = binding.inputPassword.text.toString()

            lifecycleScope.launch {
                mainViewModel.getLoginAccount(email,password,this@LoginActivity)
            }
        }


        binding.inputPassword.onValidateEditText(
            activity = this,
            hideError = {
                binding.layoutPassword.isErrorEnabled = false
                isValid[1] = true
                validateButton()
            },
            showError = {
                binding.layoutPassword.apply {
                    error = it
                    isErrorEnabled = true
                    isValid[1] = false
                    validateButton()
                }
            }
        )
        binding.inputEmail.validateEmail(this) {
            isValid[0] = it.second
            if (!it.second) binding.layoutEmail.apply {
                error = it.first
                isErrorEnabled = true
            } else binding.layoutEmail.isErrorEnabled = false
            validateButton()
        }

        binding.inputEmail.doOnTextChanged { text, start, before, count ->
            if (text!!.isEmpty()) {
                binding.layoutEmail.error = "Email must be not Empty"
            } else if (text.isNotEmpty()) {
                binding.layoutEmail.error = null
            }
        }

        binding.inputPassword.doOnTextChanged { text, start, before, count ->
            if (text!!.isEmpty()) {
                binding.layoutPassword.error = "Password Must be not empty"
            } else if (text.isNotEmpty()) {
                binding.layoutPassword.error = null
            }
        }




        playAnimation()
    }



    private fun validateButton() {
        binding.btnLogin.isEnabled = isValid.filter { it }.size == 2
    }

    private fun setObserverAllData(){
        mainViewModel.isSuccess.observe(this){
            if (it) toMainHome() else Toast.makeText(this@LoginActivity,"Something wrong for application",Toast.LENGTH_SHORT).show()
        }
    }


    private fun toMainHome(){
        startActivity(Intent(this@LoginActivity,MainActivity::class.java))
        finish()
    }

    private fun playAnimation() {

        ObjectAnimator.ofFloat(binding.imageView3, View.TRANSLATION_Y, -30f, 30f).apply {
            duration = 6000
            repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE
        }.start()

        val tvEmail = ObjectAnimator.ofFloat(binding.tvEmail, View.ALPHA, 1f).setDuration(500)
        val layoutEmail = ObjectAnimator.ofFloat(binding.layoutEmail, View.ALPHA, 1f).setDuration(500)

        val tvPassword = ObjectAnimator.ofFloat(binding.textView3, View.ALPHA, 1f).setDuration(500)
        val layoutPassword = ObjectAnimator.ofFloat(binding.layoutPassword, View.ALPHA, 1f).setDuration(500)

        val btnLogin = ObjectAnimator.ofFloat(binding.btnLogin, View.ALPHA, 1f).setDuration(500)
        val tvSignUp = ObjectAnimator.ofFloat(binding.tvSignup, View.ALPHA, 1f).setDuration(500)

        AnimatorSet().apply {
            playSequentially(tvEmail, layoutEmail, tvPassword, layoutPassword, btnLogin,tvSignUp)
            start()
        }
    }
}