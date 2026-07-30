package com.simats.smartcareerpath

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.TrendingUp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simats.smartcareerpath.ui.theme.SmartCareerPathTheme

class HomeActivity : ComponentActivity() {
    private lateinit var session: SessionManager
    private var userNameState = mutableStateOf("")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        session = SessionManager(this)
        enableEdgeToEdge()
        setContent {
            SmartCareerPathTheme {
                HomeScreen(
                    userName = userNameState.value,
                    onBackClick = {
                        val intent = Intent(this, MainActivity::class.java)
                        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        startActivity(intent)
                    },
                    onProfileClick = {
                        val intent = Intent(this, ProfileActivity::class.java)
                        startActivity(intent)
                    }
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()
        userNameState.value = session.getUserName()
    }
}

@Composable
fun HomeScreen(userName: String, onBackClick: () -> Unit, onProfileClick: () -> Unit) {
    val localContext = androidx.compose.ui.platform.LocalContext.current
    val scope = rememberCoroutineScope()
    val session = SessionManager(localContext)
    var hasAssessment by remember { mutableStateOf(session.hasAssessment()) }
    var currentUserName by remember { mutableStateOf(userName) }

    LaunchedEffect(Unit) {
        try {
            val response = RetrofitClient.instance.getProfile(session.getUserEmail())
            if (response.isSuccessful && response.body()?.success == true) {
                val user = response.body()?.user
                if (user != null) {
                    currentUserName = user.fullName
                    session.saveUser(user.fullName, user.email, age = user.age ?: "", gender = user.gender ?: "", id = user.id)
                }
            }
            
            // Check assessment status from backend
            val userId = session.getUserId()
            if (userId != -1) {
                val assessResp = RetrofitClient.instance.getAssessment(userId)
                if (assessResp.isSuccessful && assessResp.body()?.success == true) {
                    hasAssessment = true
                    session.setHasAssessment(true)
                }
            }
        } catch (e: Exception) {
            // Ignore
        }
    }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    val intent = Intent(localContext, ChatActivity::class.java)
                    localContext.startActivity(intent)
                },
                containerColor = Color.Transparent,
                contentColor = Color.White,
                shape = RoundedCornerShape(999.dp),
                modifier = Modifier
                    .height(56.dp)
                    .width(180.dp)
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = listOf(Color(0xFF2563EB), Color(0xFF7C3AED))
                        ),
                        shape = RoundedCornerShape(999.dp)
                    )
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(horizontal = 16.dp)
                ) {
                    Icon(Icons.Default.Psychology, contentDescription = null)
                    Spacer(modifier = Modifier.width(10.dp))
                    Text("AI Career Assistant", fontWeight = FontWeight.Bold)
                }
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = innerPadding.calculateBottomPadding())
                .background(Color(0xFFF8F9FA)),
            verticalArrangement = Arrangement.spacedBy(0.dp)
        ) {
            item {
                Box(modifier = Modifier.fillMaxWidth()) {
                    HomeHeader(
                        userName = currentUserName,
                        onBackClick = onBackClick,
                        onMenuClick = {
                            val intent = Intent(localContext, SettingsActivity::class.java)
                            localContext.startActivity(intent)
                        },
                        onProfileClick = onProfileClick
                    )
                    Column(
                        modifier = Modifier
                            .padding(top = 170.dp) // Starts before the header ends (header is 200dp)
                            .padding(horizontal = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        AIMatchCard(hasAssessment)
                        CategoriesGrid(
                            onExploreDomainsClick = {
                                val intent = Intent(localContext, ExploreDomainsActivity::class.java)
                                localContext.startActivity(intent)
                            }
                        )
                        
                        // Trending Careers Section
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "📈",
                                fontSize = 24.sp
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Trending Careers",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1F2937)
                            )
                        }
                    }
                }
            }

            items(trendingCareers) { career ->
                Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                    CareerItem(career)
                }
            }
            
            item {
                Spacer(modifier = Modifier.height(100.dp)) // Padding for FAB
            }
        }
    }
}

@Composable
fun HomeHeader(userName: String, onBackClick: () -> Unit, onMenuClick: () -> Unit, onProfileClick: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(Color(0xFF2563EB), Color(0xFF7C3AED), Color(0xFFEC4899))
                )
            )
            .padding(top = 40.dp, start = 16.dp, end = 16.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                IconButton(onClick = onBackClick) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, "Back", tint = Color.White)
                }
                Text(
                    "Career Planner",
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
                Box(modifier = Modifier.size(48.dp)) // Spacer to balance header title
            }

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(modifier = Modifier.padding(start = 8.dp)) {
                        Text("Welcome back,", color = Color.White.copy(alpha = 0.9f), fontSize = 14.sp)
                        Text(userName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                    }
                }
                IconButton(onClick = onProfileClick) {
                    Text("👤", fontSize = 24.sp)
                }
            }
        }
    }
}

@Composable
fun AIMatchCard(hasAssessment: Boolean) {
    val context = androidx.compose.ui.platform.LocalContext.current
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(Color(0xFFD946EF), Color(0xFFEC4899))
                    )
                )
                .padding(24.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (hasAssessment) "Your Career Match is Ready!" else "AI Career Match Ready!",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 22.sp
                    )
                    Text("✨", fontSize = 32.sp)
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = if (hasAssessment) 
                        "View your personalized career recommendations and matches." 
                    else 
                        "Take our assessment to discover your perfect career path",
                    color = Color.White.copy(alpha = 0.95f),
                    fontSize = 16.sp,
                    lineHeight = 24.sp
                )
                
                Spacer(modifier = Modifier.height(20.dp))
                
                Button(
                    onClick = {
                        val intent = Intent(context, if (hasAssessment) RecommendationsActivity::class.java else AssessmentActivity::class.java)
                        context.startActivity(intent)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        if (hasAssessment) "View Results" else "Start Assessment", 
                        color = Color(0xFFD946EF), 
                        fontWeight = FontWeight.Bold
                    )
                }
                
                if (hasAssessment) {
                    Spacer(modifier = Modifier.height(10.dp))
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(context, AssessmentActivity::class.java)
                            context.startActivity(intent)
                        },
                        border = BorderStroke(1.dp, Color.White.copy(alpha = 0.7f)),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Retake Assessment", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun CategoriesGrid(onExploreDomainsClick: () -> Unit = {}) {
    val localContext = androidx.compose.ui.platform.LocalContext.current
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            CategoryItem(
                "Explore Domains",
                "⊙",
                Color(0xFFE0F2FE),
                Modifier.weight(1f),
                onClick = onExploreDomainsClick
            )
            CategoryItem(
                "Saved Careers",
                "🔖",
                Color(0xFFFCE7F3),
                Modifier.weight(1f),
                onClick = {
                    val intent = Intent(localContext, SavedCareersActivity::class.java)
                    localContext.startActivity(intent)
                }
            )
        }
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            CategoryItem(
                "AI Career Assistant",
                "🤖",
                Color(0xFFEDE9FE),
                Modifier.weight(0.5f),
                onClick = {
                    // Chatbot link
                }
            )
            Spacer(modifier = Modifier.weight(0.5f))
        }
    }
}

@Composable
fun CategoryItem(title: String, icon: String, color: Color, modifier: Modifier = Modifier, onClick: () -> Unit = {}) {
    Card(
        modifier = modifier
            .height(130.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .background(color, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(icon, fontSize = 28.sp)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                title, 
                fontSize = 16.sp, 
                fontWeight = FontWeight.SemiBold, 
                color = Color(0xFF1F2937),
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun CareerItem(career: CareerData) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(career.title, fontWeight = FontWeight.SemiBold, fontSize = 16.sp, color = Color(0xFF1F2937))
                Text(career.salary, color = Color(0xFF6B7280), fontSize = 14.sp)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${career.match}%", 
                    style = TextStyle(
                        brush = Brush.linearGradient(listOf(Color(0xFFD946EF), Color(0xFFEC4899))),
                        fontWeight = FontWeight.Bold, 
                        fontSize = 18.sp
                    )
                )
                Text("Match", color = Color(0xFF9CA3AF), fontSize = 12.sp)
            }
        }
    }
}

data class CareerData(val title: String, val salary: String, val match: Int)

val trendingCareers = listOf(
    CareerData("AI/ML Engineer", "₹15-25 LPA", 95),
    CareerData("Content Creator", "₹5-15 LPA", 88)
)
