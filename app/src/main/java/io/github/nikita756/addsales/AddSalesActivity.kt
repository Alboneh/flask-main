package io.github.nikita756.addsales

import android.content.Context
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.activity.viewModels
import androidx.lifecycle.asLiveData
import androidx.lifecycle.lifecycleScope
import io.github.nikita756.utils.LocalStore
import io.github.nikita756.leftover.databinding.ActivityAddSalesBinding
import io.github.nikita756.leftover.detail.DetailActivity
import io.github.nikita756.network.AppConfig
import io.github.nikita756.utils.LocalStore.getNameProduct
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.launch

class AddSalesActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddSalesBinding
    private val mainViewModel by viewModels<MainViewModel>()

    override fun onCreate(savedInstanceState: Bundle?) {
        getSupportActionBar()?.hide()
        super.onCreate(savedInstanceState)
        binding = ActivityAddSalesBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnSave.setOnClickListener {
            postSales()
        }

        intent.getStringExtra("datadate").let { it2 ->
            getNameProduct(this@AddSalesActivity).observe(this@AddSalesActivity) { it1 ->
                mainViewModel.getToken(this@AddSalesActivity)
                    .observe(this@AddSalesActivity) { data ->
                        lifecycleScope.launch {
                            binding.date.text = it2
                            binding.name.text = it1.productName.toString()
                        }
                    }
            }
        }
    }

    fun getNameProduct(context: Context) = LocalStore.getNameProduct(context).asLiveData()

    private fun postSales() {
        intent.getStringExtra("datadate").let { it2->
            getNameProduct(this@AddSalesActivity).observe(this@AddSalesActivity) { it1 ->

                mainViewModel.getToken(this@AddSalesActivity)
                    .observe(this@AddSalesActivity) { data ->
                        lifecycleScope.launch {

                            try {

                                val sold = binding.inputSales.text.toString()
                                binding.date.text = it2
                                binding.name.text = it1.productName.toString()

                                val res = AppConfig().appService.postSales(
                                    "Bearer ${data.accessToken}",
                                    "${it1.productName}",
                                    it2 ?: "",
                                    sold
                                )

                                Intent(binding.btnSave.context,DetailActivity::class.java).apply {
                                    putExtra("data",it1.productName)
                                }.also { binding.btnSave.context.startActivity(it) }

                                res.let {
                                    Log.d("TAG", "postSales: ${it.predictions}")
                                    Log.d("TAG", "postSales: ${it.productName}")

                                }
                            } catch (e: Exception) {
                                Log.d("TAG", "updateProduct :failed = ${e.message}")
                            }
                        }
                 }
            }
        }
    }
}