package io.github.nikita756.leftover.register

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.viewModels
import androidx.core.widget.doAfterTextChanged
import androidx.lifecycle.lifecycleScope
import io.github.nikita756.leftover.R
import io.github.nikita756.leftover.databinding.ActivityRegisterBinding
import io.github.nikita756.leftover.login.LoginActivity
import io.github.nikita756.network.AppConfig
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private val mainViewModel by viewModels<MainViewModel>()
    private val isValid = mutableListOf(false, false, false)
    private lateinit var binding: ActivityRegisterBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        getSupportActionBar()?.hide()
        super.onCreate(savedInstanceState)
        binding= ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setObserverAllData()

        binding.apply {
            btnRegist.setOnClickListener {
                val name = inputName.text.toString()
                val email = inputEmail.text.toString()
                val password = inputPassword.text.toString()
                lifecycleScope.launch {
                    mainViewModel.registerUserAccount(name,email,password)
                }
            }
        }

        with(binding) {

            inputName.doAfterTextChanged {
                val nameValid = it?.isNotBlank() ?: false
                isValid[0] = nameValid
                layoutName.apply {
                    if (!nameValid) error = context.getString(R.string.name_must_not_empty)
                    isErrorEnabled = !nameValid
                }
                validateButton()
            }
            inputEmail.validateEmail(this@RegisterActivity) {
                isValid[1] = it.second
                if (!it.second) binding.layoutEmail.apply {
                    error = it.first
                    isErrorEnabled = true
                } else binding.layoutEmail.isErrorEnabled = false
                validateButton()
            }
            inputPassword.isNotEmpty {
                isValid[2] = it
                validateButton()
            }

        }




        playAnimation()
    }

    private fun validateButton() {
        binding.btnRegist.isEnabled = isValid.filter { it }.size == 3
    }

    private fun setObserverAllData() {
        mainViewModel.isSuccess.observe(this){
            if (it) toLogin() else Toast.makeText(this@RegisterActivity,"Something wrong for application",Toast.LENGTH_SHORT).show()
        }
    }

    private fun toLogin() {
        startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
        finish()
    }

    private fun playAnimation() {

        ObjectAnimator.ofFloat(binding.imageView3, View.TRANSLATION_Y, -30f, 30f).apply {
            duration = 6000
            repeatCount = ObjectAnimator.INFINITE
            repeatMode = ObjectAnimator.REVERSE
        }.start()

        val tvName = ObjectAnimator.ofFloat(binding.tvName, View.ALPHA, 1f).setDuration(500)
        val layoutName = ObjectAnimator.ofFloat(binding.layoutName, View.ALPHA, 1f).setDuration(500)

        val tvEmail = ObjectAnimator.ofFloat(binding.tvEmail, View.ALPHA, 1f).setDuration(500)
        val layoutEmail = ObjectAnimator.ofFloat(binding.layoutEmail, View.ALPHA, 1f).setDuration(500)

        val tvPassword = ObjectAnimator.ofFloat(binding.textView3, View.ALPHA, 1f).setDuration(500)
        val layoutPassword = ObjectAnimator.ofFloat(binding.inputPassword, View.ALPHA, 1f).setDuration(500)

        val btnRegist = ObjectAnimator.ofFloat(binding.btnRegist, View.ALPHA, 1f).setDuration(500)

        AnimatorSet().apply {
            playSequentially(tvName, layoutName, tvEmail, layoutEmail, tvPassword, layoutPassword, btnRegist)
            start()
        }
    }
}