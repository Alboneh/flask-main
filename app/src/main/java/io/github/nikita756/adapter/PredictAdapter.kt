package io.github.nikita756.adapter


import android.content.Intent
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.lifecycle.MutableLiveData
import androidx.recyclerview.widget.RecyclerView
import io.github.nikita756.addsales.AddSalesActivity
import io.github.nikita756.leftover.databinding.ItemCardviewHomeBinding
import io.github.nikita756.leftover.detail.DetailActivity
import io.github.nikita756.response.DataPredictionResponse
import io.github.nikita756.response.ProductResponse
import java.text.SimpleDateFormat
import java.util.*


//home adapter
class PredictAdapter(private val listPredict: List<DataPredictionResponse>) :
    RecyclerView.Adapter<PredictAdapter.ListViewHolder>() {
    inner class ListViewHolder(private val binding: ItemCardviewHomeBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(item: DataPredictionResponse) {
            binding.apply {
                tvNameProduct.text = item.productName
                btnKeDetail.setOnClickListener{
                    Intent(itemView.context,DetailActivity::class.java).apply {
                        putExtra("data",item.productName)
                    }.also { itemView.context.startActivity(it) }
                }

                val todayDate= Calendar.getInstance().time
                val df = SimpleDateFormat("yyyy/MM/dd",Locale.getDefault())
                item.predictions?.first {
                    it.date == df.format(todayDate)
                }?.let {
                    tvAngka.text = "${it.forecast?:0.0}"
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ListViewHolder {
        val binding =
            ItemCardviewHomeBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ListViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ListViewHolder, position: Int) {
        holder.bind(listPredict[position])
    }

    override fun getItemCount(): Int = listPredict.size
}