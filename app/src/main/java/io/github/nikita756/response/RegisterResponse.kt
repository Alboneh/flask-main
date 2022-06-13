package io.github.nikita756.response

import com.google.gson.annotations.SerializedName

data class RegisterResponse(

	@field:SerializedName("msg")
	val msg: String? = null,

	@field:SerializedName("data")
	val data: List<DataItem?>? = null
)

data class DataItem(

	@field:SerializedName("password")
	val password: String? = null,

	@field:SerializedName("id")
	val id: Int? = null,

	@field:SerializedName("email")
	val email: String? = null,

	@field:SerializedName("username")
	val username: String? = null
)
