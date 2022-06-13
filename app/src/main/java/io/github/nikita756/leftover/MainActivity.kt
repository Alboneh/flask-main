package io.github.nikita756.leftover


import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import io.github.nikita756.adapter.PredictAdapter
import io.github.nikita756.leftover.databinding.ActivityMainBinding
import io.github.nikita756.leftover.login.LoginActivity
import io.github.nikita756.response.LoginResponse
import io.github.nikita756.utils.LocalStore
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {


    private lateinit var binding: ActivityMainBinding
    private val mainViewModel: MainViewModel by viewModels()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)



        mainViewModel.getToken(this@MainActivity).observe(this) {
            mainViewModel.getPredict(
                "Bearer ${it.accessToken ?: ""}"
            )
        }

        mainViewModel.getUser(this).observe(this) {
            binding.tvUser.text = it.username
        }

        mainViewModel.predictList.observe(this) {
            binding.rvItemforecast.apply {
                setHasFixedSize(true)
                layoutManager = LinearLayoutManager(this@MainActivity)
                adapter = PredictAdapter(it.data ?: listOf())

            }
        }

    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menubar, menu)
        return super.onCreateOptionsMenu(menu)
    }



    override fun onOptionsItemSelected(item: MenuItem): Boolean {

        if (item.itemId == R.id.menu_signout) {
            signOut()
        }

        return super.onOptionsItemSelected(item)
    }

    private fun signOut() {
            lifecycleScope.launch {
                LocalStore.updateTokenUser(context= this@MainActivity, login = LoginResponse("") )
                    .also {
                startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                finish()
            }
            }
        }

    }

