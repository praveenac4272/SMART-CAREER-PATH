package com.simats.smartcareerpath

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simats.smartcareerpath.ui.theme.SmartCareerPathTheme

class AssessmentActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SmartCareerPathTheme {
                AssessmentScreen(onBackClick = { finish() })
            }
        }
    }
}

@Composable
fun AssessmentScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var currentQuestionIndex by remember { mutableIntStateOf(0) }
    val totalQuestions = assessmentQuestions.size
    val answers = remember { mutableStateListOf<Int?>(*Array(totalQuestions) { null }) }
    var isSubmitting by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = listOf(Color(0xFF4B6BF6), Color(0xFF8A3FE8))
                        )
                    )
                    .padding(top = 32.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 16.dp)
                ) {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                    Text(
                        text = "Career Assessment",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color.White)
                .padding(16.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                text = "Question ${currentQuestionIndex + 1} of $totalQuestions",
                style = MaterialTheme.typography.bodyLarge,
                color = Color(0xFF6B21A8),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            // Custom Progress Bar
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .background(Color(0xFFE6E6E6), shape = RoundedCornerShape(8.dp))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(((currentQuestionIndex + 1).toFloat() / totalQuestions))
                        .height(8.dp)
                        .background(Color(0xFF7B2CBF), shape = RoundedCornerShape(8.dp))
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Question Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = assessmentQuestions[currentQuestionIndex],
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Options
            val options = listOf("Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree")
            val selectedOptionIndex = answers[currentQuestionIndex]

            Column {
                options.forEachIndexed { index, option ->
                    val isSelected = selectedOptionIndex == index
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp)
                            .background(
                                color = if (isSelected) Color(0xFFF6EEFC) else Color.White,
                                shape = RoundedCornerShape(10.dp)
                            )
                            .border(
                                width = if (isSelected) 2.dp else 1.dp,
                                color = if (isSelected) Color(0xFF7B2CBF) else Color(0xFFDDDDDD),
                                shape = RoundedCornerShape(10.dp)
                            )
                            .clickable { answers[currentQuestionIndex] = index }
                            .padding(18.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        Text(
                            text = option,
                            color = Color.Black,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            // Bottom Navigation Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = {
                        if (currentQuestionIndex > 0) {
                            currentQuestionIndex--
                        } else {
                            onBackClick()
                        }
                    },
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color(0xFFCCCCCC)),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.Black)
                ) {
                    Text(text = if (currentQuestionIndex > 0) "Back" else "Cancel")
                }

                Button(
                    onClick = {
                        if (currentQuestionIndex < totalQuestions - 1) {
                            currentQuestionIndex++
                        } else {
                            // Finish logic
                            val session = SessionManager(context)
                            val userId = session.getUserId()
                            if (userId == -1) {
                                Toast.makeText(context, "Please login to save assessment", Toast.LENGTH_SHORT).show()
                                return@Button
                            }
                            
                            isSubmitting = true
                            scope.launch {
                                try {
                                    val optionsList = listOf("Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree")
                                    val request = AssessmentRequest(
                                        userId = userId,
                                        q1 = optionsList[answers[0]!!],
                                        q2 = optionsList[answers[1]!!],
                                        q3 = optionsList[answers[2]!!],
                                        q4 = optionsList[answers[3]!!],
                                        q5 = optionsList[answers[4]!!],
                                        q6 = optionsList[answers[5]!!],
                                        q7 = optionsList[answers[6]!!],
                                        q8 = optionsList[answers[7]!!],
                                        q9 = optionsList[answers[8]!!],
                                        q10 = optionsList[answers[9]!!]
                                    )
                                    
                                    val response = RetrofitClient.instance.submitAssessment(request)
                                    if (response.isSuccessful && response.body()?.success == true) {
                                        session.setHasAssessment(true)
                                        session.saveAssessmentAnswers(answers.map { it ?: 0 })
                                        val intent = Intent(context, RecommendationsActivity::class.java)
                                        context.startActivity(intent)
                                    } else {
                                        Toast.makeText(context, "Submission failed", Toast.LENGTH_SHORT).show()
                                    }
                                } catch (e: Exception) {
                                    Toast.makeText(context, "Network error", Toast.LENGTH_SHORT).show()
                                } finally {
                                    isSubmitting = false
                                }
                            }
                        }
                    },
                    enabled = selectedOptionIndex != null && !isSubmitting,
                    modifier = Modifier
                        .weight(1f)
                        .height(56.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedOptionIndex == null) Color(0xFFDDDDDD) else Color(0xFF7B2CBF),
                        contentColor = Color.White
                    )
                ) {
                    if (isSubmitting) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    } else {
                        Text(
                            text = if (currentQuestionIndex < totalQuestions - 1) "Next Question" else "Finish",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}

val assessmentQuestions = listOf(
    "I enjoy solving logical problems, analyzing information, and finding solutions to challenging situations.",
    "I like helping people, understanding their needs, and making a positive impact on their lives.",
    "I enjoy leading teams, organizing activities, and making important decisions.",
    "I am interested in understanding laws, rules, policies, and how society is governed.",
    "I enjoy expressing my ideas through creativity, design, art, or visual storytelling.",
    "I enjoy creating content, sharing ideas, and engaging with audiences through digital platforms.",
    "I am passionate about performing arts such as music, dance, acting, or public performances.",
    "I enjoy strategic thinking, competition, gaming, and exploring new technologies or innovations.",
    "I am interested in working with nature, agriculture, transportation systems, or large-scale operations.",
    "I prefer creating my own opportunities, taking initiative, and building something independently."
)
