package io.github.nikita756.leftover.detail

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import io.github.nikita756.adapter.ProductAdapter
import io.github.nikita756.adapter.ProductAdapterSeven
import io.github.nikita756.adapter.ProductAdapterThree
import io.github.nikita756.leftover.MainActivity
import io.github.nikita756.leftover.R
import io.github.nikita756.leftover.databinding.ActivityDetailBinding
import io.github.nikita756.viewmodel.DetailViewModel
import io.github.nikita756.viewmodel.MainViewModel
import kotlinx.coroutines.launch

class DetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDetailBinding
    private val detailViewModel: DetailViewModel by viewModels()
    private val mainViewModel by viewModels<MainViewModel>()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        intent.getStringExtra("data").let {

                mainViewModel.getToken(this@DetailActivity).observe(this@DetailActivity){data ->
                    lifecycleScope.launch {
                        detailViewModel.getProduct(it?: "","Bearer ${data.accessToken}",this@DetailActivity)
                        val actionBar = supportActionBar
                        actionBar!!.title = it.toString().capitalize()
                }
            }
        }




        detailViewModel.productList.observe(this){
            binding.rvDetail.apply {
                setHasFixedSize(true)
                layoutManager = LinearLayoutManager(this@DetailActivity)
                adapter = ProductAdapter(it)
            }
        }

        binding.button7days.setOnClickListener{
            detailViewModel.productList.observe(this){
                binding.rvDetail.apply {
                    setHasFixedSize(true)
                    layoutManager = LinearLayoutManager(this@DetailActivity)
                    adapter = ProductAdapterSeven(it)
                }
            }
        }

        binding.button3days.setOnClickListener{
            detailViewModel.productList.observe(this){
                binding.rvDetail.apply {
                    setHasFixedSize(true)
                    layoutManager = LinearLayoutManager(this@DetailActivity)
                    adapter = ProductAdapterThree(it)
                }
            }
        }


        binding.button14days.setOnClickListener{
            detailViewModel.productList.observe(this){
                binding.rvDetail.apply {
                    setHasFixedSize(true)
                    layoutManager = LinearLayoutManager(this@DetailActivity)
                    adapter = ProductAdapter(it)
                }
            }
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menubar2, menu)
        return super.onCreateOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.menu_home -> {
                startActivity(Intent(this, MainActivity::class.java))
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}