package com.simats.smartcareerpath

import retrofit2.Response
import retrofit2.http.*

interface CareerApiService {
    @POST("api/auth/register")
    suspend fun register(@Body data: Map<String, String>): Response<ApiResponse<UserResponse>>

    @POST("api/auth/login")
    suspend fun login(@Body data: Map<String, String>): Response<ApiResponse<UserResponse>>

    @GET("api/profile/{email}")
    suspend fun getProfile(@Path("email") email: String): Response<ApiResponse<UserResponse>>

    @POST("api/profile/update")
    suspend fun updateProfile(@Body data: Map<String, Any>): Response<ApiResponse<UserResponse>>

    @POST("api/personal-details")
    suspend fun savePersonalDetails(@Body data: Map<String, Any>): Response<ApiResponse<PersonalDetailsData>>

    @POST("api/career-assessment")
    suspend fun submitAssessment(@Body data: AssessmentRequest): Response<AssessmentResponse>

    @GET("api/career-assessment/{user_id}")
    suspend fun getAssessment(@Path("user_id") userId: Int): Response<AssessmentResponse>

    @GET("api/career-colleges/{career}")
    suspend fun getColleges(@Path("career") career: String, @Query("state") state: String?): Response<CollegeResponse>

    @GET("api/career-colleges/{career}/states")
    suspend fun getStates(@Path("career") career: String): Response<StateResponse>

    @POST("api/saved-careers")
    suspend fun saveCareer(@Body data: Map<String, Any>): Response<ApiResponse<Any>>

    @GET("api/saved-careers/{user_id}")
    suspend fun getSavedCareers(@Path("user_id") userId: Int): Response<ApiResponse<Any>>

    @HTTP(method = "DELETE", path = "api/saved-careers/delete", hasBody = true)
    suspend fun deleteSavedCareer(@Body data: Map<String, Any>): Response<ApiResponse<Any>>

    @POST("api/chat")
    suspend fun chat(@Body data: ChatRequest): Response<ChatResponse>
}
