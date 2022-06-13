package io.github.nikita756.response

import com.google.gson.annotations.SerializedName

data class SalesResponse(

	@field:SerializedName("product_name")
	val productName: String? = null,

	@field:SerializedName("predictions")
	val predictions: List<PredictionsItem>
)

data class PredictionsItem(

	@field:SerializedName("date")
	val date: String? = null,

	@field:SerializedName("forecast")
	val forecast: Double? = null,

	@field:SerializedName("real")
	val real: String? = null
)
