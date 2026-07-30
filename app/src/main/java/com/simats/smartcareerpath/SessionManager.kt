package com.simats.smartcareerpath

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("user_session", Context.MODE_PRIVATE)

    fun saveUser(name: String, email: String, age: String = "", gender: String = "", id: Int = -1) {
        prefs.edit().apply {
            putString("user_name", name)
            putString("user_email", email)
            putString("user_age", age)
            putString("user_gender", gender)
            if (id != -1) putInt("user_id", id)
            apply()
        }
    }

    fun getUserId(): Int = prefs.getInt("user_id", -1)

    fun setHasAssessment(value: Boolean) {
        prefs.edit().putBoolean("has_assessment", value).apply()
    }

    fun saveAssessmentAnswers(answers: List<Int>) {
        val answersStr = answers.joinToString(",")
        val currentAttempts = getAssessmentAttempts()
        prefs.edit().apply {
            putString("assessment_answers", answersStr)
            putInt("assessment_attempts", currentAttempts + 1)
            apply()
        }
    }

    fun getAssessmentAttempts(): Int = prefs.getInt("assessment_attempts", 0)

    fun saveCareersBulk(careersJson: String) {
        prefs.edit().putString("saved_careers_bulk", careersJson).apply()
    }

    fun getSavedCareersBulk(): String {
        return prefs.getString("saved_careers_bulk", "") ?: ""
    }

    fun getAssessmentAnswers(): List<Int> {
        val answersStr = prefs.getString("assessment_answers", "") ?: ""
        if (answersStr.isEmpty()) return emptyList()
        return answersStr.split(",").map { it.toInt() }
    }

    fun hasAssessment(): Boolean = prefs.getBoolean("has_assessment", false)

    fun getUserName(): String = prefs.getString("user_name", "Rahul Kumar") ?: "Rahul Kumar"
    fun getUserEmail(): String = prefs.getString("user_email", "rahul@example.com") ?: "rahul@example.com"
    fun getUserAge(): String = prefs.getString("user_age", "") ?: ""
    fun getUserGender(): String = prefs.getString("user_gender", "Male") ?: "Male"

    fun logout() {
        prefs.edit().clear().apply()
    }
}
