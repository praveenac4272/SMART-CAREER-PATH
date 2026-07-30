package com.simats.smartcareerpath

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simats.smartcareerpath.ui.theme.SmartCareerPathTheme

class RecommendationsActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            SmartCareerPathTheme {
                RecommendationsScreen(
                    onBackClick = {
                        val intent = Intent(this, HomeActivity::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                    }
                )
            }
        }
    }
}

@Composable
fun RecommendationsScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val session = SessionManager(context)
    val answers = session.getAssessmentAnswers()
    val attemptCount = session.getAssessmentAttempts()
    val userId = session.getUserId()

    var assessmentData by remember { mutableStateOf<AssessmentResult?>(null) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        if (userId != -1) {
            try {
                val response = RetrofitClient.instance.getAssessment(userId)
                if (response.isSuccessful && response.body()?.success == true) {
                    val data = response.body()!!.assessment
                    val recommendedList = data.recommendedCareers ?: data.careers ?: emptyList()
                    assessmentData = AssessmentResult(
                        topDomains = data.topDomains,
                        recommendedCareers = recommendedList.map { CareerRecommendation(it.career, it.description) }
                    )
                } else {
                    // Fallback to local calculation if not found on server
                    assessmentData = computeAssessmentResult(answers)
                }
            } catch (e: Exception) {
                assessmentData = computeAssessmentResult(answers)
            } finally {
                isLoading = false
            }
        } else {
            assessmentData = computeAssessmentResult(answers)
            isLoading = false
        }
    }

    Scaffold(
        containerColor = Color.White,
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
                        text = "Assessment Result",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }
    ) { innerPadding ->
        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize().padding(innerPadding), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = Color(0xFF8A3FE8))
            }
        } else if (assessmentData != null) {
            val result = assessmentData!!
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(Color.White),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Top Domains Identified Section
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFFE5E7EB))
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Text(
                                text = "TOP DOMAINS IDENTIFIED",
                                color = Color(0xFF6B7280),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.4.sp
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            result.topDomains.forEachIndexed { index, domain ->
                                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 3.dp)) {
                                    Text(
                                        text = "${index + 1}. ",
                                        color = Color(0xFF111827),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp
                                    )
                                    Text(
                                        text = domain,
                                        color = Color(0xFF111827),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp
                                    )
                                }
                            }
                        }
                    }
                }

                // Recommended Careers Section
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFFE5E7EB))
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Text(
                                text = "RECOMMENDED CAREERS",
                                color = Color(0xFF6B7280),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 0.4.sp
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            result.recommendedCareers.forEachIndexed { index, career ->
                                Column(modifier = Modifier.padding(vertical = 7.dp)) {
                                    Row {
                                        Text(
                                            text = "${index + 1}. ",
                                            color = Color(0xFF111827),
                                            fontWeight = FontWeight.ExtraBold,
                                            fontSize = 16.sp
                                        )
                                        Text(
                                            text = career.title,
                                            color = Color(0xFF111827),
                                            fontWeight = FontWeight.ExtraBold,
                                            fontSize = 16.sp
                                        )
                                    }
                                    Text(
                                        text = career.description,
                                        color = Color(0xFF475569),
                                        fontSize = 14.sp,
                                        modifier = Modifier.padding(top = 4.dp, start = 20.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Buttons
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 10.dp)) {
                        OutlinedButton(
                            onClick = {
                                val intent = Intent(context, AssessmentActivity::class.java)
                                context.startActivity(intent)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp),
                            shape = RoundedCornerShape(12.dp),
                            border = BorderStroke(1.dp, Color(0xFF8A3FE8)),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF8A3FE8))
                        ) {
                            Text("Retake Assessment", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }

                        Button(
                            onClick = {
                                val intent = Intent(context, HomeActivity::class.java)
                                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                                context.startActivity(intent)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(56.dp)
                                .background(
                                    brush = Brush.horizontalGradient(
                                        colors = listOf(Color(0xFF8A3FE8), Color(0xFFD946EF))
                                    ),
                                    shape = RoundedCornerShape(12.dp)
                                ),
                            colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                            contentPadding = PaddingValues(0.dp)
                        ) {
                            Text("Return to Home", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color.White)
                        }

                        if (attemptCount > 0) {
                           Text(
                                text = "Assessment attempts: $attemptCount",
                                color = Color(0xFF6B7280),
                                fontSize = 14.sp,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(20.dp))
                    }
                }
            }
        }
    }
}

// Data models and logic
data class AssessmentResult(
    val topDomains: List<String>,
    val recommendedCareers: List<CareerRecommendation>
)

data class CareerRecommendation(
    val title: String,
    val description: String
)

fun computeAssessmentResult(answers: List<Int>): AssessmentResult {
    val skillScores = mutableMapOf<String, Float>(
        "logic" to 0f, "data" to 0f, "ui" to 0f, "management" to 0f, "documentation" to 0f,
        "programming" to 0f, "business" to 0f, "communication" to 0f, "cybersecurity" to 0f,
        "collaboration" to 0f, "creativity" to 0f, "leadership" to 0f, "technical" to 0f, "security" to 0f
    )

    val optionScores = mapOf(0 to 5f, 1 to 4f, 2 to 3f, 3 to 1f, 4 to 1f)

    val questionToSkills = listOf(
        mapOf("logic" to 1), // q1
        mapOf("data" to 1), // q2
        mapOf("ui" to 1, "creativity" to 1), // q3
        mapOf("management" to 1, "leadership" to 1), // q4
        mapOf("documentation" to 1, "communication" to 1), // q5
        mapOf("programming" to 1, "technical" to 1), // q6
        mapOf("business" to 1), // q7
        mapOf("communication" to 1), // q8
        mapOf("cybersecurity" to 1, "security" to 1), // q9
        mapOf("collaboration" to 1, "creativity" to 1) // q10
    )

    answers.forEachIndexed { index, answerIndex ->
        if (index < questionToSkills.size) {
            val score = optionScores[answerIndex] ?: 0f
            val weights = questionToSkills[index]
            weights.forEach { (skill, weight) ->
                skillScores[skill] = (skillScores[skill] ?: 0f) + (score * weight)
            }
        }
    }

    val categoryProfiles = mapOf(
        "IT & Technology" to mapOf("logic" to 1, "data" to 1, "programming" to 1, "cybersecurity" to 1, "ui" to 1),
        "Business & Commerce" to mapOf("business" to 1, "management" to 1, "communication" to 1),
        "Entrepreneurship" to mapOf("management" to 1, "business" to 1, "communication" to 1, "creativity" to 1),
        "Influencer & Content Creation" to mapOf("creativity" to 1, "communication" to 1, "collaboration" to 1),
        "Arts & Creativity" to mapOf("creativity" to 1, "ui" to 1),
        "Anime & Animation" to mapOf("ui" to 1, "creativity" to 1, "logic" to 1),
        "Gaming & Esports" to mapOf("logic" to 1, "creativity" to 1, "programming" to 1),
        "Acting & Entertainment" to mapOf("communication" to 1, "creativity" to 1),
        "Music Careers" to mapOf("creativity" to 1, "communication" to 1),
        "Law Careers" to mapOf("communication" to 1, "logic" to 1, "business" to 1),
        "Government & Railway" to mapOf("leadership" to 1, "communication" to 1, "logic" to 1),
        "Healthcare" to mapOf("logic" to 1, "data" to 1, "communication" to 1),
        "Agriculture" to mapOf("data" to 1, "business" to 1, "logic" to 1)
    )

    val categoryScores = mutableMapOf<String, Float>()
    categoryProfiles.forEach { (category, profile) ->
        var totalWeight = 0f
        profile.values.forEach { totalWeight += it }
        
        var rawScore = 0f
        profile.forEach { (skill, weight) ->
            rawScore += (skillScores[skill] ?: 0f) * weight
        }
        categoryScores[category] = if (totalWeight > 0) (rawScore / totalWeight) * 20f else 0f
    }

    val rankedCategories = categoryScores.toList().sortedByDescending { it.second }
    
    val domainDisplayNames = mapOf(
        "IT & Technology" to "IT & Technology Careers",
        "Gaming & Esports" to "Gaming & Esports",
        "Entrepreneurship" to "Entrepreneurship",
        "Arts & Creativity" to "Arts & Creativity",
        "Anime & Animation" to "Anime & Animation",
        "Acting & Entertainment" to "Acting & Entertainment",
        "Influencer & Content Creation" to "Content Creation",
        "Business & Commerce" to "Business & Commerce",
        "Law Careers" to "Law Careers",
        "Government & Railway" to "Government & Railway",
        "Healthcare" to "Healthcare",
        "Agriculture" to "Agriculture",
        "Music Careers" to "Music Careers"
    )

    val topDomains = rankedCategories.take(3).map { domainDisplayNames[it.first] ?: it.first }

    val careerCategoryCareers = mapOf(
        "IT & Technology" to listOf("Software Engineer", "AI/ML Engineer", "Data Scientist", "Full Stack Developer", "DevOps Engineer", "Cybersecurity Analyst", "UI/UX Designer"),
        "Business & Commerce" to listOf("Chartered Accountant", "MBA Graduate", "Investment Banker", "Financial Analyst", "Marketing Manager", "Business Consultant", "Company Secretary"),
        "Entrepreneurship" to listOf("Startup Founder", "Tech Entrepreneur", "Small Business Owner", "E-commerce Owner", "Franchise Owner", "Consultant"),
        "Influencer & Content Creation" to listOf("YouTuber", "Instagram Influencer", "Content Creator", "Social Media Manager", "Podcast Host", "Vlogger"),
        "Arts & Creativity" to listOf("Graphic Designer", "Illustrator", "Digital Artist", "Fine Artist", "Art Director", "Tattoo Artist"),
        "Anime & Animation" to listOf("Animator", "3D Artist", "Character Designer", "Storyboard Artist", "VFX Artist", "Animation Director"),
        "Gaming & Esports" to listOf("Esports Player", "Game Streamer", "Gaming Coach", "Game Developer", "Gaming Content Creator", "Esports Commentator"),
        "Acting & Entertainment" to listOf("Film Actor", "Theater Artist", "Voice Actor", "TV Serial Actor", "Stand-up Comedian"),
        "Music Careers" to listOf("Playback Singer", "Music Producer", "Music Composer", "DJ / Music Artist", "Music Teacher", "Sound Engineer"),
        "Law Careers" to listOf("Lawyer", "Corporate Lawyer", "Judge", "Legal Advisor", "Public Prosecutor", "Legal Analyst"),
        "Government & Railway" to listOf("IAS Officer", "IPS Officer", "Railway Officer", "Bank PO", "SSC CGL", "Forest Officer", "Govt. Teacher"),
        "Healthcare" to listOf("Doctor", "Nurse", "Physiotherapist", "Pharmacist", "Medical Lab Technician", "Radiologist", "Dentist"),
        "Agriculture" to listOf("Agricultural Scientist", "Agri-Business Manager", "Horticulturist", "Food Technologist", "Agricultural Engineer", "Organic Farmer")
    )

    val careerDescriptions = mapOf(
        "Software Engineer" to "Designs and develops software applications.",
        "AI/ML Engineer" to "Builds artificial intelligence and machine learning solutions.",
        "Data Scientist" to "Analyzes data and builds predictive models.",
        "Full Stack Developer" to "Builds frontend and backend web applications.",
        "Cybersecurity Analyst" to "Protects systems from cyber threats.",
        "UI/UX Designer" to "Designs intuitive digital experiences and interfaces.",
        "DevOps Engineer" to "Automates deployment and keeps software delivery reliable.",
        "UX Researcher" to "Studies users to improve product design and usability.",
        "Esports Player" to "Competes in gaming tournaments.",
        "Game Streamer" to "Streams gameplay online.",
        "Game Developer" to "Designs and develops video games.",
        "Gaming Coach" to "Trains players and teams to improve competitive performance.",
        "Gaming Content Creator" to "Creates gaming videos and community content.",
        "Esports Commentator" to "Provides live commentary for gaming events.",
        "Startup Founder" to "Builds and manages startup companies.",
        "Tech Entrepreneur" to "Creates technology businesses.",
        "Small Business Owner" to "Runs and grows an independent business.",
        "E-commerce Owner" to "Operates an online retail business.",
        "Franchise Owner" to "Manages a business under an established brand.",
        "Consultant" to "Advises clients on business and growth strategy.",
        "Film Actor" to "Performs leading and supporting roles in movies.",
        "Theater Artist" to "Performs in stage plays and live productions.",
        "Voice Actor" to "Provides voices for animation and games.",
        "TV Serial Actor" to "Acts in television serials.",
        "Stand-up Comedian" to "Performs comedy before live audiences.",
        "Graphic Designer" to "Creates visual designs.",
        "Illustrator" to "Creates drawings and illustrations.",
        "Digital Artist" to "Produces digital artwork.",
        "Animator" to "Creates animated content.",
        "Character Designer" to "Creates animated characters.",
        "Storyboard Artist" to "Plans scenes and visual sequences for animation.",
        "3D Artist" to "Creates three-dimensional digital assets.",
        "VFX Artist" to "Builds visual effects for media and film.",
        "Animation Director" to "Leads animation projects and creative teams.",
        "Content Creator" to "Creates and publishes digital content.",
        "Social Media Manager" to "Manages brand presence on social platforms.",
        "YouTuber" to "Produces video content for online audiences.",
        "Instagram Influencer" to "Builds audience engagement through social content.",
        "Vlogger" to "Creates video blogs and personal content.",
        "Podcast Host" to "Hosts audio shows and interviews."
    )

    val recommendedCareers = mutableListOf<CareerRecommendation>()
    val seenCareers = mutableSetOf<String>()

    rankedCategories.take(3).forEach { (category, _) ->
        val careers = careerCategoryCareers[category] ?: emptyList()
        careers.forEach { careerName ->
            if (careerName !in seenCareers) {
                seenCareers.add(careerName)
                recommendedCareers.add(
                    CareerRecommendation(
                        careerName,
                        careerDescriptions[careerName] ?: "Recommended based on your assessment."
                    )
                )
            }
        }
    }

    return AssessmentResult(
        topDomains = topDomains,
        recommendedCareers = recommendedCareers.take(10)
    )
}
