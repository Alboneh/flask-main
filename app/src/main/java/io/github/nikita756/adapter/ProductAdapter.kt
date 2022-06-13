package io.github.nikita756.adapter

import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import io.github.nikita756.addsales.AddSalesActivity
import io.github.nikita756.leftover.databinding.ItemCardviewDetailBinding
import io.github.nikita756.leftover.databinding.ItemCardviewHomeBinding
import io.github.nikita756.response.DataPredictionResponse
import io.github.nikita756.response.ProductResponse
//detail adapter
class ProductAdapter(private val listProduct: List<ProductResponse>) :
    RecyclerView.Adapter<ProductAdapter.ListViewHolder>() {
    inner class ListViewHolder(private val binding: ItemCardviewDetailBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: ProductResponse) {
            binding.apply {
                tvDate.text = item.date
                tvForecast.text = "${item.forecast.toString()} Items"
                tvReal.text = "${item.real.toString()} Items"
                btnKeAddSales.setOnClickListener{
                    Intent(itemView.context, AddSalesActivity::class.java).apply {
                        putExtra("datadate",item.date)
                    }.also { itemView.context.startActivity(it) }
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProductAdapter.ListViewHolder {
        val binding =
            ItemCardviewDetailBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ListViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ProductAdapter.ListViewHolder, position: Int) {
        holder.bind(listProduct[position])
    }

    override fun getItemCount(): Int = listProduct.size
}