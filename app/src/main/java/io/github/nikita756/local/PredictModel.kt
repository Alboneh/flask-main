package io.github.nikita756.local

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class PredictModel(
val product_name: String,
val date: String,
val forecast: String,
val real: String
) : Parcelable

