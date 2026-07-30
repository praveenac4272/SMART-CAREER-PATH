package com.simats.smartcareerpath

import com.google.gson.annotations.SerializedName

data class ApiResponse<T>(
    val success: Boolean,
    val message: String? = null,
    val user: T? = null,
    val errors: Map<String, String>? = null,
    @SerializedName("saved_careers") val savedCareers: List<SavedCareer>? = null,
    @SerializedName("personal_details") val personalDetails: PersonalDetailsData? = null
)

data class UserResponse(
    val id: Int,
    @SerializedName("full_name") val fullName: String,
    val email: String,
    val age: String? = "",
    val gender: String? = "",
    @SerializedName("created_at") val createdAt: String? = "",
    @SerializedName("updated_at") val updatedAt: String? = ""
)

data class PersonalDetailsData(
    @SerializedName("user_id") val userId: Int,
    @SerializedName("date_of_birth") val dob: String,
    val gender: String,
    @SerializedName("phone_number") val phone: String,
    val city: String
)

data class AssessmentRequest(
    @SerializedName("user_id") val userId: Int,
    val q1: String, val q2: String, val q3: String, val q4: String, val q5: String,
    val q6: String, val q7: String, val q8: String, val q9: String, val q10: String
)

data class AssessmentResponse(
    val success: Boolean,
    val assessment: AssessmentData
)

data class AssessmentData(
    @SerializedName("assessment_id") val id: Int? = null,
    @SerializedName("topDomains") val topDomains: List<String>,
    @SerializedName("primaryCareerPath") val primaryPath: String,
    @SerializedName("topScore") val topScore: Float,
    @SerializedName("recommendedCareers") val careers: List<CareerRec>? = null,
    @SerializedName("recommended_careers") val recommendedCareers: List<CareerRec>? = null,
    val answers: Map<String, String>? = null
)

data class CareerRec(
    val career: String,
    val description: String,
    val category: String,
    val score: Int,
    val salaryRange: String? = "",
    val roadmap: List<String>? = emptyList(),
    val skillsRequired: List<String>? = emptyList(),
    val demandLevel: String? = ""
)

data class College(
    @SerializedName("college_name") val name: String? = "",
    @SerializedName("college_type") val type: String? = "",
    @SerializedName("annual_fee") val fee: String? = "",
    val location: String? = "",
    val state: String? = "",
    @SerializedName("speciality") val specialty: String? = ""
)

data class CollegeResponse(
    val success: Boolean,
    val colleges: List<College>
)

data class StateResponse(
    val success: Boolean,
    val states: List<String>
)

data class SavedCareer(
    val title: String,
    val salary: String? = "",
    val match: String? = "",
    val description: String? = "",
    val source: String? = "",
    @SerializedName("created_at") val createdAt: String? = ""
)

data class ChatRequest(
    @SerializedName("user_id") val userId: Int?,
    val message: String
)

data class ChatResponse(
    val success: Boolean,
    val reply: String
)
