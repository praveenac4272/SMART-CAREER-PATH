package com.simats.smartcareerpath

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.simats.smartcareerpath.ui.theme.SmartCareerPathTheme
import kotlinx.coroutines.launch
import android.widget.Toast
import androidx.compose.ui.platform.LocalContext

class CareerDetailActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val careerName = intent.getStringExtra("CAREER_NAME") ?: "Software Engineer"
        val careerDetail = getCareerDetailStatic(careerName)

        enableEdgeToEdge()
        setContent {
            SmartCareerPathTheme {
                CareerDetailScreen(
                    careerDetail = careerDetail,
                    onBackClick = { finish() }
                )
            }
        }
    }

    private fun getCareerDetailStatic(name: String): CareerDetail {
        return when (name) {
            "Doctor (MBBS)" -> CareerDetail(
                title = "Doctor (MBBS)",
                description = "Medical doctors diagnose and treat illnesses, injuries, and various health conditions to improve patient well-being.",
                salary = "₹8-25 LPA",
                emoji = "🏥",
                gradient = listOf(Color(0xFF673AB7), Color(0xFF9C27B0)),
                whatTheyDo = listOf(
                    "Diagnose diseases and medical conditions",
                    "Prescribe medications and treatment plans",
                    "Perform medical procedures and surgeries",
                    "Monitor patient progress and recovery",
                    "Maintain detailed medical records"
                ),
                whyChoose = listOf(
                    "Make a direct impact on saving lives",
                    "High respect and social status",
                    "Excellent career stability and growth",
                    "Diverse specialization opportunities",
                    "Continuous learning and challenges"
                ),
                degree = "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
                opportunities = listOf("Hospitals", "Private Clinics", "Public Health", "Research", "Medical Colleges"),
                skills = listOf("Medical Knowledge", "Empathy", "Critical Thinking", "Communication", "Patience"),
                tools = listOf("Stethoscope", "Sphygmomanometer", "Diagnostic Software", "Surgical Tools"),
                certifications = listOf("USMLE (for USA)", "PLAB (for UK)", "NEET PG", "Medical Registration Certificate")
            )
            "Software Engineer" -> CareerDetail(
                title = "Software Engineer",
                description = "Software engineers design, develop, and maintain software applications and systems using programming languages.",
                salary = "₹6-25 LPA",
                emoji = "💻",
                gradient = listOf(Color(0xFF2196F3), Color(0xFF03A9F4)),
                whatTheyDo = listOf(
                    "Write and test code",
                    "Design software architecture",
                    "Debug and fix issues",
                    "Collaborate with teams",
                    "Deploy applications"
                ),
                whyChoose = listOf(
                    "High demand and salaries",
                    "Remote work opportunities",
                    "Continuous learning",
                    "Create impactful products",
                    "Global career options"
                ),
                degree = "B.E. / B.Tech in Computer Science or IT",
                opportunities = listOf("Tech Giants (Google, Meta)", "Startups", "Finance Sector", "E-commerce", "Freelancing"),
                skills = listOf("Programming (Java, Python, C++)", "Data Structures", "Algorithms", "System Design"),
                tools = listOf("VS Code", "Git/GitHub", "Docker", "Jira", "Postman"),
                certifications = listOf("AWS Certified Developer", "Google Professional Cloud Dev", "Oracle Certified Java Pro")
            )
            else -> CareerDetail(
                title = name,
                description = "Information about $name, including roles, responsibilities, and growth opportunities.",
                salary = "Competitive",
                emoji = "🚀",
                gradient = listOf(Color(0xFF3F51B5), Color(0xFF2196F3)),
                whatTheyDo = listOf("Developing specialized skills", "Working on complex projects", "Collaborating with cross-functional teams"),
                whyChoose = listOf("High growth potential", "Interesting challenges", "Impactful work"),
                degree = "Relevant Bachelor's degree",
                opportunities = listOf("MNCs", "Startups", "Government Sectors"),
                skills = listOf("Problem Solving", "Adaptability", "Continuous Learning"),
                tools = listOf("Domain-specific software", "Collaboration tools"),
                certifications = emptyList()
            )
        }
    }

    @Composable
    fun CareerDetailScreen(careerDetail: CareerDetail, onBackClick: () -> Unit) {
        var selectedState by remember { mutableStateOf("Select State") }
        var states by remember { mutableStateOf<List<String>>(emptyList()) }
        var colleges by remember { mutableStateOf<List<College>>(emptyList()) }
        var isLoadingColleges by remember { mutableStateOf(false) }
        val scope = rememberCoroutineScope()

        val context = LocalContext.current

        // Fetch available states for this career
        LaunchedEffect(careerDetail.title) {
            try {
                val response = RetrofitClient.instance.getStates(careerDetail.title)
                if (response.isSuccessful && response.body()?.success == true) {
                    states = response.body()?.states?.sorted() ?: emptyList()
                } else {
                    Toast.makeText(context, "Failed to load states", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }

        // Fetch colleges when state is selected
        LaunchedEffect(selectedState) {
            if (selectedState != "Select State") {
                isLoadingColleges = true
                try {
                    val response = RetrofitClient.instance.getColleges(careerDetail.title, selectedState)
                    if (response.isSuccessful && response.body()?.success == true) {
                        colleges = response.body()?.colleges ?: emptyList()
                    } else {
                        Toast.makeText(context, "Failed to load colleges", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(context, "Network error: ${e.message}", Toast.LENGTH_SHORT).show()
                } finally {
                    isLoadingColleges = false
                }
            }
        }

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
                            text = "Career Roadmap",
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
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                item {
                    HeaderCard(careerDetail)
                }

                item {
                    DetailSection(
                        title = "What They Do",
                        icon = Icons.Default.Business,
                        items = careerDetail.whatTheyDo,
                        iconColor = Color(0xFF2196F3)
                    )
                }

                item {
                    DetailSection(
                        title = "Why Choose This Career",
                        icon = Icons.Default.CheckCircle,
                        items = careerDetail.whyChoose,
                        iconColor = Color(0xFF4CAF50)
                    )
                }

                item {
                    InfoSection(
                        title = "Education & Opportunities",
                        content = {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                InfoRow(label = "Primary Degree Required", value = careerDetail.degree)
                                InfoList(label = "Typical Work Environments", items = careerDetail.opportunities)
                                InfoList(label = "Core Skills", items = careerDetail.skills)
                                InfoList(label = "Tools to Master", items = careerDetail.tools)
                                if (careerDetail.certifications.isNotEmpty()) {
                                    InfoList(label = "Valuable Certifications", items = careerDetail.certifications)
                                }
                            }
                        }
                    )
                }

                item {
                    LocationFilter(
                        selectedState = selectedState,
                        states = states,
                        onStateSelected = { selectedState = it }
                    )
                }

                if (selectedState == "Select State") {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp), contentAlignment = Alignment.Center) {
                            Text(text = "Please select a state to see available colleges", color = Color.Gray)
                        }
                    }
                } else if (isLoadingColleges) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator(color = Color(0xFF9C27B0))
                        }
                    }
                } else if (colleges.isEmpty()) {
                    item {
                        Box(modifier = Modifier.fillMaxWidth().padding(vertical = 32.dp), contentAlignment = Alignment.Center) {
                            Text(text = "No colleges found in this state", color = Color.Gray)
                        }
                    }
                } else {
                    items(colleges) { college ->
                        CollegeCard(college)
                    }
                }
            }
        }
    }

    @Composable
    fun HeaderCard(career: CareerDetail) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(brush = Brush.verticalGradient(career.gradient))
                    .padding(24.dp)
            ) {
                Column {
                    Text(text = career.emoji, fontSize = 48.sp)
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = career.title,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = career.description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White.copy(alpha = 0.9f)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Surface(
                        color = Color.White.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = career.salary,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            color = Color.White,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }

    @Composable
    fun DetailSection(title: String, icon: ImageVector, items: List<String>, iconColor: Color) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = icon, contentDescription = null, tint = iconColor)
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
                items.forEach { item ->
                    Row(modifier = Modifier.padding(vertical = 4.dp)) {
                        Text(text = "•", color = iconColor, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = item, style = MaterialTheme.typography.bodyLarge, color = Color.Black)
                    }
                }
            }
        }
    }

    @Composable
    fun InfoSection(title: String, content: @Composable () -> Unit) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(16.dp))
                content()
            }
        }
    }

    @Composable
    fun InfoRow(label: String, value: String) {
        Column {
            Text(text = label, fontWeight = FontWeight.Bold, color = Color.Gray, fontSize = 14.sp)
            Text(text = value, style = MaterialTheme.typography.bodyLarge, color = Color.Black)
        }
    }

    @Composable
    fun InfoList(label: String, items: List<String>) {
        Column {
            Text(text = label, fontWeight = FontWeight.Bold, color = Color.Gray, fontSize = 14.sp)
            Text(text = items.joinToString(", "), style = MaterialTheme.typography.bodyLarge, color = Color.Black)
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun LocationFilter(selectedState: String, states: List<String>, onStateSelected: (String) -> Unit) {
        var expanded by remember { mutableStateOf(false) }

        Column {
            Text(
                text = "Find Colleges",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = Color.Black
            )
            Spacer(modifier = Modifier.height(12.dp))
            
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded },
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = selectedState,
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Select State") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    colors = ExposedDropdownMenuDefaults.outlinedTextFieldColors(
                        focusedBorderColor = Color(0xFF9C27B0),
                        unfocusedBorderColor = Color.LightGray
                    ),
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                )

                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    states.forEach { state ->
                        DropdownMenuItem(
                            text = { Text(text = state) },
                            onClick = {
                                onStateSelected(state)
                                expanded = false
                            },
                            contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                        )
                    }
                }
            }
        }
    }

    @Composable
    fun CollegeCard(college: College) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = college.name ?: "Unknown College",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = Color.Gray,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = "${college.location ?: ""}, ${college.state ?: ""}", color = Color.Gray, fontSize = 14.sp)
                        }
                    }
                    Surface(
                        color = if (college.type == "Government") Color(0xFFE8F5E9) else Color(0xFFE3F2FD),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = college.type ?: "Private",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            color = if (college.type == "Government") Color(0xFF2E7D32) else Color(0xFF1565C0),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFFF9800), modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "Specialty: ${college.specialty ?: "General"}", color = Color.Black, fontSize = 14.sp)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.School, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = "Fee: ${college.fee ?: "N/A"}", fontWeight = FontWeight.SemiBold, color = Color.Black)
                    }
                }
            }
        }
    }
}

data class CareerDetail(
    val title: String,
    val description: String,
    val salary: String,
    val emoji: String,
    val gradient: List<Color>,
    val whatTheyDo: List<String>,
    val whyChoose: List<String>,
    val degree: String,
    val opportunities: List<String>,
    val skills: List<String>,
    val tools: List<String>,
    val certifications: List<String> = emptyList()
)
