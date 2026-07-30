package com.simats.smartcareerpath

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simats.smartcareerpath.ui.theme.SmartCareerPathTheme

class CareerListActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val domainName = intent.getStringExtra("DOMAIN_NAME") ?: "Healthcare"
        val domainData = getDomainData(domainName)
        
        enableEdgeToEdge()
        setContent {
            SmartCareerPathTheme {
                CareerListScreen(
                    domainData = domainData,
                    onBackClick = { finish() }
                )
            }
        }
    }

    private fun getDomainData(name: String): DomainDetail {
        return when (name) {
            "Healthcare" -> DomainDetail(
                title = "Healthcare Careers",
                description = "Make a difference in people's lives",
                emoji = "🏥",
                gradient = listOf(Color(0xFFFF4081), Color(0xFFFF5252)),
                careers = listOf(
                    CareerListItem("Doctor (MBBS)", "₹8-25 LPA"),
                    CareerListItem("Nurse", "₹3-8 LPA"),
                    CareerListItem("Physiotherapist", "₹4-10 LPA"),
                    CareerListItem("Pharmacist", "₹3-7 LPA"),
                    CareerListItem("Medical Lab Technician", "₹2.5-6 LPA"),
                    CareerListItem("Radiologist", "₹10-30 LPA"),
                    CareerListItem("Dentist", "₹5-15 LPA")
                )
            )
            "IT & Technology" -> DomainDetail(
                title = "IT & Technology Careers",
                description = "Build the future with technology",
                emoji = "💻",
                gradient = listOf(Color(0xFF2196F3), Color(0xFF03A9F4)),
                careers = listOf(
                    CareerListItem("Software Engineer", "₹6-25 LPA"),
                    CareerListItem("Data Scientist", "₹8-30 LPA"),
                    CareerListItem("AI/ML Engineer", "₹10-35 LPA"),
                    CareerListItem("Full Stack Developer", "₹5-20 LPA"),
                    CareerListItem("DevOps Engineer", "₹7-22 LPA")
                )
            )
            "Government & Railway" -> DomainDetail(
                title = "Government & Railway",
                description = "Serve the nation with pride",
                emoji = "🏛️",
                gradient = listOf(Color(0xFF673AB7), Color(0xFF9C27B0)),
                careers = listOf(
                    CareerListItem("IAS Officer", "₹56,100+ PM"),
                    CareerListItem("IPS Officer", "₹56,100+ PM"),
                    CareerListItem("Railway Officer", "₹30,000-80,000 PM"),
                    CareerListItem("Bank PO", "₹30,000-50,000 PM"),
                    CareerListItem("SSC CGL", "₹25,000-60,000 PM"),
                    CareerListItem("Forest Officer", "₹40,000-70,000 PM"),
                    CareerListItem("Govt. Teacher", "₹25,000-60,000 PM")
                )
            )
            "Agriculture" -> DomainDetail(
                title = "Agriculture Careers",
                description = "Grow the future sustainably",
                emoji = "🌾",
                gradient = listOf(Color(0xFF4CAF50), Color(0xFF8BC34A)),
                careers = listOf(
                    CareerListItem("Agricultural Scientist", "₹5-12 LPA"),
                    CareerListItem("Agri-Business Manager", "₹6-18 LPA"),
                    CareerListItem("Horticulturist", "₹4-10 LPA"),
                    CareerListItem("Food Technologist", "₹4-12 LPA"),
                    CareerListItem("Agricultural Engineer", "₹5-15 LPA"),
                    CareerListItem("Organic Farmer", "₹3-10 LPA")
                )
            )
            "Law" -> DomainDetail(
                title = "Law Careers",
                description = "Fight for justice and rights",
                emoji = "⚖️",
                gradient = listOf(Color(0xFF37474F), Color(0xFF263238)),
                careers = listOf(
                    CareerListItem("Lawyer / Advocate", "₹3-20+ LPA"),
                    CareerListItem("Corporate Lawyer", "₹8-30 LPA"),
                    CareerListItem("Judge", "₹50,000-2L PM"),
                    CareerListItem("Legal Advisor", "₹5-15 LPA"),
                    CareerListItem("Public Prosecutor", "₹30,000-80,000 PM"),
                    CareerListItem("Legal Analyst", "₹4-12 LPA")
                )
            )
            "Aviation" -> DomainDetail(
                title = "Aviation Careers",
                description = "Reach for the skies",
                emoji = "✈️",
                gradient = listOf(Color(0xFF2196F3), Color(0xFF64B5F6)),
                careers = listOf(
                    CareerListItem("Commercial Pilot", "₹1.5-5 Cr (Career)"),
                    CareerListItem("Aircraft Engineer", "₹6-15 LPA"),
                    CareerListItem("Air Traffic Controller", "₹8-20 LPA"),
                    CareerListItem("Flight Attendant", "₹3-8 LPA"),
                    CareerListItem("Airport Manager", "₹7-18 LPA"),
                    CareerListItem("Aviation Safety Officer", "₹5-12 LPA")
                )
            )
            "Business & Commerce" -> DomainDetail(
                title = "Business & Commerce",
                description = "Lead businesses to success",
                emoji = "💼",
                gradient = listOf(Color(0xFF00C853), Color(0xFF64DD17)),
                careers = listOf(
                    CareerListItem("Chartered Accountant (CA)", "₹7-25 LPA"),
                    CareerListItem("MBA Graduate", "₹8-30 LPA"),
                    CareerListItem("Investment Banker", "₹10-40 LPA"),
                    CareerListItem("Financial Analyst", "₹5-15 LPA"),
                    CareerListItem("Marketing Manager", "₹6-20 LPA"),
                    CareerListItem("Business Consultant", "₹8-25 LPA"),
                    CareerListItem("Company Secretary", "₹5-12 LPA")
                )
            )
            "Acting & Entertainment" -> DomainDetail(
                title = "Acting & Entertainment",
                description = "Entertain and inspire millions",
                emoji = "🎭",
                gradient = listOf(Color(0xFF9C27B0), Color(0xFFE91E63)),
                careers = listOf(
                    CareerListItem("Film Actor", "₹5L-10Cr (varies)"),
                    CareerListItem("Theater Artist", "₹2-8 LPA"),
                    CareerListItem("Voice Actor", "₹3-12 LPA"),
                    CareerListItem("TV Serial Actor", "₹5-50L (per show)"),
                    CareerListItem("Stand-up Comedian", "₹3-20 LPA")
                )
            )
            "Fashion & Modeling" -> DomainDetail(
                title = "Fashion & Modeling",
                description = "Define style and trends",
                emoji = "👗",
                gradient = listOf(Color(0xFFE91E63), Color(0xFFFF5252)),
                careers = listOf(
                    CareerListItem("Fashion Designer", "₹3-15 LPA"),
                    CareerListItem("Runway Model", "₹2-20 LPA"),
                    CareerListItem("Fashion Stylist", "₹3-12 LPA"),
                    CareerListItem("Costume Designer", "₹4-15 LPA"),
                    CareerListItem("Fashion Photographer", "₹4-18 LPA"),
                    CareerListItem("Textile Designer", "₹3-10 LPA")
                )
            )
            "Music" -> DomainDetail(
                title = "Music Careers",
                description = "Create melodies that move souls",
                emoji = "🎵",
                gradient = listOf(Color(0xFF673AB7), Color(0xFF9C27B0)),
                careers = listOf(
                    CareerListItem("Playback Singer", "₹5L-50L per song"),
                    CareerListItem("Music Producer", "₹4-20 LPA"),
                    CareerListItem("Music Composer", "₹5-30 LPA"),
                    CareerListItem("DJ / Music Artist", "₹3-15 LPA"),
                    CareerListItem("Music Teacher", "₹2-8 LPA"),
                    CareerListItem("Sound Engineer", "₹3-12 LPA")
                )
            )
            "Dance" -> DomainDetail(
                title = "Dance Careers",
                description = "Express through movement",
                emoji = "💃",
                gradient = listOf(Color(0xFF9C27B0), Color(0xFFE91E63)),
                careers = listOf(
                    CareerListItem("Professional Dancer", "₹2-10 LPA"),
                    CareerListItem("Choreographer", "₹3-15 LPA"),
                    CareerListItem("Dance Teacher", "₹2-8 LPA"),
                    CareerListItem("Dance Content Creator", "₹3-12 LPA"),
                    CareerListItem("Backup Dancer (Films)", "₹10K-5L per project")
                )
            )
            "Arts & Creativity" -> DomainDetail(
                title = "Arts & Creativity",
                description = "Paint your imagination",
                emoji = "🎨",
                gradient = listOf(Color(0xFFFF9800), Color(0xFFFF5722)),
                careers = listOf(
                    CareerListItem("Graphic Designer", "₹3-12 LPA"),
                    CareerListItem("Illustrator", "₹3-15 LPA"),
                    CareerListItem("Digital Artist", "₹4-18 LPA"),
                    CareerListItem("Fine Artist", "₹2-20+ LPA"),
                    CareerListItem("Art Director", "₹6-25 LPA"),
                    CareerListItem("Tattoo Artist", "₹3-15 LPA")
                )
            )
            "Gaming & Esports" -> DomainDetail(
                title = "Gaming & Esports",
                description = "Play, compete, dominate",
                emoji = "🎮",
                gradient = listOf(Color(0xFF3F51B5), Color(0xFF2196F3)),
                careers = listOf(
                    CareerListItem("Esports Player", "₹2-50L+ (prizes)"),
                    CareerListItem("Game Streamer", "₹3-30 LPA"),
                    CareerListItem("Gaming Coach", "₹2-10 LPA"),
                    CareerListItem("Game Developer", "₹5-20 LPA"),
                    CareerListItem("Gaming Content Creator", "₹3-25 LPA"),
                    CareerListItem("Esports Commentator", "₹3-12 LPA")
                )
            )
            "Influencer & Content" -> DomainDetail(
                title = "Influencer & Content Creation",
                description = "Build your digital empire",
                emoji = "📱",
                gradient = listOf(Color(0xFF9C27B0), Color(0xFFE91E63)),
                careers = listOf(
                    CareerListItem("YouTuber", "₹1L-1Cr+ (varies)"),
                    CareerListItem("Instagram Influencer", "₹2-50L per year"),
                    CareerListItem("Content Creator", "₹3-30 LPA"),
                    CareerListItem("Social Media Manager", "₹3-12 LPA"),
                    CareerListItem("Podcast Host", "₹2-15 LPA"),
                    CareerListItem("Vlogger", "₹3-25 LPA")
                )
            )
            "Entrepreneurship" -> DomainDetail(
                title = "Entrepreneurship",
                description = "Build your own empire",
                emoji = "🚀",
                gradient = listOf(Color(0xFF2196F3), Color(0xFF00BCD4)),
                careers = listOf(
                    CareerListItem("Startup Founder", "Varies (Equity)"),
                    CareerListItem("Tech Entrepreneur", "₹0-100Cr+ (varies)"),
                    CareerListItem("Small Business Owner", "₹3-50 LPA"),
                    CareerListItem("E-commerce Owner", "₹5-100+ LPA"),
                    CareerListItem("Franchise Owner", "₹10-80 LPA"),
                    CareerListItem("Consultant", "₹5-30 LPA")
                )
            )
            "Anime & Animation" -> DomainDetail(
                title = "Anime & Animation",
                description = "Bring stories to life",
                emoji = "🎬",
                gradient = listOf(Color(0xFF3F51B5), Color(0xFF2196F3)),
                careers = listOf(
                    CareerListItem("Animator", "₹3-15 LPA"),
                    CareerListItem("3D Artist", "₹4-18 LPA"),
                    CareerListItem("Character Designer", "₹4-20 LPA"),
                    CareerListItem("Storyboard Artist", "₹3-12 LPA"),
                    CareerListItem("VFX Artist", "₹5-25 LPA"),
                    CareerListItem("Animation Director", "₹8-30 LPA")
                )
            )
            else -> getDomainData("Healthcare")
        }
    }
}

@Composable
fun CareerListScreen(domainData: DomainDetail, onBackClick: () -> Unit) {
    val context = LocalContext.current
    Scaffold(
        topBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(100.dp)
                    .background(
                        brush = Brush.horizontalGradient(
                            colors = listOf(Color(0xFF2196F3), Color(0xFF9C27B0))
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
                        text = "Career Planner",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(Color(0xFFF8F9FA)),
            contentPadding = PaddingValues(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.Transparent)
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(brush = Brush.verticalGradient(domainData.gradient))
                            .padding(24.dp)
                    ) {
                        Column {
                            Text(text = domainData.emoji, fontSize = 32.sp)
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = domainData.title,
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = domainData.description,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.White.copy(alpha = 0.9f)
                            )
                        }
                    }
                }
            }

            items(domainData.careers) { career ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val intent = Intent(context, CareerDetailActivity::class.java)
                            intent.putExtra("CAREER_NAME", career.title)
                            context.startActivity(intent)
                        },
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
                            Text(
                                text = career.title,
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1A1A1A)
                            )
                            Text(
                                text = career.salary,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.Gray
                            )
                        }
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                            contentDescription = null,
                            tint = domainData.gradient.first(),
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }
        }
    }
}

data class DomainDetail(
    val title: String,
    val description: String,
    val emoji: String,
    val gradient: List<Color>,
    val careers: List<CareerListItem>
)

data class CareerListItem(val title: String, val salary: String)
