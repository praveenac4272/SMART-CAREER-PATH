from __future__ import annotations

import csv
import difflib
import os
import random
import re
import sqlite3
import sys
from datetime import datetime
from typing import Any, Dict, Optional

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.environ.get('CAREER_DB_PATH', os.path.join(BASE_DIR, 'career_backend.db'))
LOCAL_CAREER_CSV = os.path.join(BASE_DIR, 'career_state_colleges.csv')
EXTERNAL_REAL_CSV = r'C:\Users\prave\OneDrive\Desktop\Real Dataset Generator\output\career_state_colleges_real.csv'

SEED_CAREER_COLLEGES: list[tuple[str, str, str, str, str, str, str]] = []

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=False)

EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')
PHONE_REGEX = re.compile(r'^\+?[0-9]{7,15}$')
GENDER_OPTIONS = {'male', 'female', 'other', 'prefer_not_to_say'}
OPTION_SCORES = {
    'strongly agree': 5,
    'agree': 4,
    'neutral': 3,
    'disagree': 2,
    'strongly disagree': 1,
    'very interested': 5,
    'interested': 4,
    'not interested': 2,
}

OPTION_ALIASES = {
    'strongly agree': 'strongly agree',
    'very interested': 'strongly agree',
    'agree': 'agree',
    'interested': 'agree',
    'neutral': 'neutral',
    'disagree': 'disagree',
    'strongly disagree': 'strongly disagree',
    'not interested': 'disagree',
}

CANONICAL_INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
    'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh',
    'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Andaman & Nicobar Islands',
    'Lakshadweep'
]

DEFAULT_CAREER_STATES = [
    'Delhi NCR', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra',
    'Punjab', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
]

STATE_ALIASES = {
    'delhi (nct)': 'Delhi NCR',
    'delhi ncr': 'Delhi NCR',
    'delhi': 'Delhi NCR',
    'tamil nadu': 'Tamil Nadu',
    'tamilnadu': 'Tamil Nadu',
    'telangana': 'Telangana',
    'uttar pradesh': 'Uttar Pradesh',
    'up': 'Uttar Pradesh',
    'west bengal': 'West Bengal',
    'wb': 'West Bengal',
    'karnataka': 'Karnataka',
    'kerala': 'Kerala',
    'gujarat': 'Gujarat',
    'punjab': 'Punjab',
    'maharashtra': 'Maharashtra',
    'mh': 'Maharashtra',
    'ka': 'Karnataka',
    'tn': 'Tamil Nadu',
    'pb': 'Punjab',
    'gj': 'Gujarat',
    'kl': 'Kerala',
}

QUESTION_TO_SKILLS = {
    'q1': {'q1': 1},
    'q2': {'q2': 1},
    'q3': {'q3': 1},
    'q4': {'q4': 1},
    'q5': {'q5': 1},
    'q6': {'q6': 1},
    'q7': {'q7': 1},
    'q8': {'q8': 1},
    'q9': {'q9': 1},
    'q10': {'q10': 1},
}

CAREER_CATEGORY_PROFILES = {
    'IT & Technology': {'q1': 5, 'q8': 5, 'q6': 4, 'q10': 2, 'q3': 2, 'q5': 1, 'q7': 0, 'q2': 1, 'q4': 1, 'q9': 1},
    'Business & Commerce': {'q3': 5, 'q10': 4, 'q1': 2, 'q8': 2, 'q4': 2, 'q6': 1, 'q2': 2, 'q5': 1, 'q7': 0, 'q9': 1},
    'Entrepreneurship': {'q10': 5, 'q3': 5, 'q8': 3, 'q1': 2, 'q6': 2, 'q2': 1, 'q4': 1, 'q5': 1, 'q7': 0, 'q9': 1},
    'Influencer & Content Creation': {'q6': 5, 'q5': 4, 'q3': 2, 'q10': 2, 'q8': 1, 'q1': 1, 'q7': 1, 'q2': 1, 'q4': 0, 'q9': 0},
    'Arts & Creativity': {'q5': 5, 'q6': 3, 'q7': 1, 'q3': 1, 'q10': 1, 'q1': 1, 'q8': 1, 'q2': 1, 'q4': 0, 'q9': 0},
    'Anime & Animation': {'q5': 5, 'q6': 3, 'q8': 3, 'q1': 2, 'q7': 1, 'q10': 1, 'q3': 1, 'q2': 1, 'q4': 0, 'q9': 0},
    'Gaming & Esports': {'q8': 5, 'q1': 3, 'q6': 3, 'q10': 2, 'q5': 2, 'q3': 1, 'q7': 1, 'q2': 1, 'q4': 0, 'q9': 0},
    'Acting & Entertainment': {'q7': 5, 'q5': 3, 'q6': 2, 'q3': 2, 'q10': 1, 'q2': 1, 'q8': 1, 'q1': 1, 'q4': 0, 'q9': 0},
    'Music Careers': {'q7': 5, 'q5': 4, 'q6': 2, 'q3': 1, 'q10': 1, 'q1': 1, 'q8': 1, 'q2': 1, 'q4': 0, 'q9': 0},
    'Law Careers': {'q4': 5, 'q3': 3, 'q1': 2, 'q10': 1, 'q2': 1, 'q6': 1, 'q5': 1, 'q8': 1, 'q7': 0, 'q9': 0},
    'Government & Railway': {'q3': 5, 'q4': 4, 'q1': 2, 'q2': 2, 'q10': 1, 'q8': 1, 'q5': 1, 'q6': 1, 'q7': 0, 'q9': 1},
    'Healthcare': {'q2': 5, 'q1': 2, 'q9': 2, 'q3': 1, 'q8': 1, 'q5': 1, 'q6': 1, 'q10': 1, 'q4': 1, 'q7': 0},
    'Agriculture': {'q9': 5, 'q1': 2, 'q3': 2, 'q10': 2, 'q2': 1, 'q8': 1, 'q6': 1, 'q5': 1, 'q4': 0, 'q7': 0},
}

CAREER_CATEGORY_CAREERS = {
    'IT & Technology': ['Software Engineer', 'AI/ML Engineer', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'Cybersecurity Analyst', 'UI/UX Designer'],
    'Business & Commerce': ['Chartered Accountant', 'MBA Graduate', 'Investment Banker', 'Financial Analyst', 'Marketing Manager', 'Business Consultant', 'Company Secretary'],
    'Entrepreneurship': ['Startup Founder', 'Tech Entrepreneur', 'Small Business Owner', 'E-commerce Owner', 'Franchise Owner', 'Consultant'],
    'Influencer & Content Creation': ['YouTuber', 'Instagram Influencer', 'Content Creator', 'Social Media Manager', 'Podcast Host', 'Vlogger'],
    'Arts & Creativity': ['Graphic Designer', 'Illustrator', 'Digital Artist', 'Fine Artist', 'Art Director', 'Tattoo Artist'],
    'Anime & Animation': ['Animator', '3D Artist', 'Character Designer', 'Storyboard Artist', 'VFX Artist', 'Animation Director'],
    'Gaming & Esports': ['Esports Player', 'Game Streamer', 'Gaming Coach', 'Game Developer', 'Gaming Content Creator', 'Esports Commentator'],
    'Acting & Entertainment': ['Film Actor', 'Theater Artist', 'Voice Actor', 'TV Serial Actor', 'Stand-up Comedian'],
    'Music Careers': ['Playback Singer', 'Music Producer', 'Music Composer', 'DJ / Music Artist', 'Music Teacher', 'Sound Engineer'],
    'Law Careers': ['Lawyer', 'Corporate Lawyer', 'Judge', 'Legal Advisor', 'Public Prosecutor', 'Legal Analyst'],
    'Government & Railway': ['IAS Officer', 'IPS Officer', 'Railway Officer', 'Bank PO', 'SSC CGL', 'Forest Officer', 'Govt. Teacher'],
    'Healthcare': ['Doctor', 'Nurse', 'Physiotherapist', 'Pharmacist', 'Medical Lab Technician', 'Radiologist', 'Dentist'],
    'Agriculture': ['Agricultural Scientist', 'Agri-Business Manager', 'Horticulturist', 'Food Technologist', 'Agricultural Engineer', 'Organic Farmer'],
}

CAREER_DETAILS = {
    'Software Engineer': {'skillsRequired': ['Python', 'JavaScript', 'DSA', 'Git'], 'roadmap': ['Learn programming basics', 'Practice data structures', 'Build projects', 'Contribute to GitHub'], 'salaryRange': '4-20 LPA', 'demandLevel': 'High'},
    'AI/ML Engineer': {'skillsRequired': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow'], 'roadmap': ['Learn Python', 'Learn statistics', 'Study ML fundamentals', 'Build AI projects'], 'salaryRange': '8-25 LPA', 'demandLevel': 'High'},
    'Data Scientist': {'skillsRequired': ['Python', 'Statistics', 'SQL', 'Data Visualization'], 'roadmap': ['Learn statistics', 'Practice SQL', 'Master Python for data', 'Work on datasets'], 'salaryRange': '6-22 LPA', 'demandLevel': 'High'},
    'Full Stack Developer': {'skillsRequired': ['HTML', 'CSS', 'JavaScript', 'Backend Development'], 'roadmap': ['Learn frontend basics', 'Learn backend basics', 'Build full stack apps', 'Deploy projects'], 'salaryRange': '5-22 LPA', 'demandLevel': 'High'},
    'Cybersecurity Analyst': {'skillsRequired': ['Networking', 'Security Tools', 'Linux', 'Threat Analysis'], 'roadmap': ['Learn networking', 'Study security fundamentals', 'Practice labs', 'Earn security certifications'], 'salaryRange': '5-20 LPA', 'demandLevel': 'High'},
    'UI/UX Designer': {'skillsRequired': ['Figma', 'Wireframing', 'User Research', 'Prototyping'], 'roadmap': ['Learn design basics', 'Study user research', 'Create wireframes', 'Build a portfolio'], 'salaryRange': '4-18 LPA', 'demandLevel': 'High'},
}

DEFAULT_CAREER_DETAILS = {
    'skillsRequired': ['Communication', 'Problem Solving', 'Domain Knowledge'],
    'roadmap': ['Understand the career path', 'Learn core skills', 'Practice through projects', 'Apply for internships'],
    'salaryRange': 'Varies',
    'demandLevel': 'Medium',
}

CAREER_FEE_KEYWORDS = ['fee', 'fees', 'cost', 'tuition', 'college fee', 'course fee', 'annual fee']
CAREER_SALARY_KEYWORDS = ['salary', 'pay', 'income', 'earn', 'package', 'ctc', 'lpa', 'per year', 'per month', 'monthly', 'annual']
CAREER_DEMAND_KEYWORDS = ['demand', 'job market', 'scope', 'opportunity', 'future', 'growth', 'hiring', 'need']
CAREER_PATH_KEYWORDS = ['roadmap', 'how to become', 'how can i become', 'steps to become', 'what should i study', 'what should i do', 'path to', 'prepare', 'become', 'start', 'requirements', 'qualifications', 'eligibility', 'skills']
CAREER_COLLEGES_KEYWORDS = ['college', 'colleges', 'institute', 'university', 'best college', 'top college', 'admission', 'admit', 'apply']
CAREER_ADMISSION_KEYWORDS = ['admission', 'entry', 'application', 'eligibility', 'criteria', 'qualification']
CAREER_ENTRANCE_KEYWORDS = ['entrance exam', 'exam', 'test', 'clat', 'neet', 'jee', 'cat', 'mat', 'cpt', 'diploma']
CAREER_CERTIFICATE_KEYWORDS = ['certificate', 'certification', 'course', 'certified', 'credential']
CAREER_SKILLS_KEYWORDS = ['skills', 'learn', 'learning', 'tools', 'languages', 'techniques', 'programming']
CAREER_DEGREE_KEYWORDS = ['degree', 'bachelor', 'master', 'mba', 'btech', 'b.e.', 'm.tech', 'llb', 'mbbs', 'diploma']
CAREER_HIGHER_STUDIES_KEYWORDS = ['higher studies', 'postgraduate', 'master', 'm.tech', 'mba', 'ms', 'phd']
CAREER_INTERNSHIP_KEYWORDS = ['internship', 'internships', 'intern']
CAREER_PLACEMENT_KEYWORDS = ['placement', 'placements', 'campus recruitment', 'job drive']
CAREER_JOBS_KEYWORDS = ['job', 'jobs', 'roles', 'work', 'career opportunities']
CAREER_SWITCH_KEYWORDS = ['switch', 'transition', 'move from', 'change from', 'shift from']
CAREER_RECOMMENDATION_KEYWORDS = ['recommend', 'best', 'suitable', 'ideal', 'which career', 'what career', 'suggest']
CAREER_COMPARISON_KEYWORDS = ['compare', 'versus', 'vs', 'difference between', 'different from']

INTENT_KEYWORDS = {
    'roadmap': CAREER_PATH_KEYWORDS,
    'salary': CAREER_SALARY_KEYWORDS,
    'colleges': CAREER_COLLEGES_KEYWORDS,
    'fees': CAREER_FEE_KEYWORDS,
    'admission': CAREER_ADMISSION_KEYWORDS,
    'entrance exam': CAREER_ENTRANCE_KEYWORDS,
    'eligibility': CAREER_ADMISSION_KEYWORDS + CAREER_ENTRANCE_KEYWORDS,
    'certificates': CAREER_CERTIFICATE_KEYWORDS,
    'skills': CAREER_SKILLS_KEYWORDS,
    'degree': CAREER_DEGREE_KEYWORDS,
    'higher studies': CAREER_HIGHER_STUDIES_KEYWORDS,
    'internships': CAREER_INTERNSHIP_KEYWORDS,
    'placements': CAREER_PLACEMENT_KEYWORDS,
    'career scope': CAREER_DEMAND_KEYWORDS,
    'future demand': CAREER_DEMAND_KEYWORDS,
    'comparison': CAREER_COMPARISON_KEYWORDS,
    'jobs': CAREER_JOBS_KEYWORDS,
    'government jobs': ['government jobs', 'govt jobs', 'public sector', 'psu', 'civil services', 'upsc', 'ssc', 'railway officer'],
    'private jobs': ['private jobs', 'corporate jobs', 'corporate roles', 'private sector'],
    'career switch': CAREER_SWITCH_KEYWORDS,
    'recommendations': CAREER_RECOMMENDATION_KEYWORDS,
}

DOMAIN_KEYWORDS = {
    'it': 'IT & Technology',
    'information technology': 'IT & Technology',
    'software': 'IT & Technology',
    'coding': 'IT & Technology',
    'programming': 'IT & Technology',
    'ai': 'IT & Technology',
    'artificial intelligence': 'IT & Technology',
    'machine learning': 'IT & Technology',
    'data science': 'IT & Technology',
    'medical': 'Healthcare',
    'healthcare': 'Healthcare',
    'doctor': 'Healthcare',
    'mbbs': 'Healthcare',
    'nurse': 'Healthcare',
    'law': 'Law Careers',
    'legal': 'Law Careers',
    'lawyer': 'Law Careers',
    'gaming': 'Gaming & Esports',
    'esports': 'Gaming & Esports',
    'music': 'Music Careers',
    'dance': 'Arts & Creativity',
    'creative': 'Arts & Creativity',
    'art': 'Arts & Creativity',
    'animation': 'Anime & Animation',
    'entertainment': 'Acting & Entertainment',
    'business': 'Business & Commerce',
    'commerce': 'Business & Commerce',
    'entrepreneur': 'Entrepreneurship',
    'government': 'Government & Railway',
    'govt': 'Government & Railway',
    'railway': 'Government & Railway',
    'financial': 'Business & Commerce',
    'accounts': 'Business & Commerce',
    'agriculture': 'Agriculture',
    'farmer': 'Agriculture',
    'pilot': 'Aviation',
}

DOMAIN_FALLBACK_CAREERS = {
    'dance': ['Classical Dancer', 'Choreographer', 'Dance Teacher'],
    'music': ['Playback Singer', 'Music Composer', 'Music Producer', 'Sound Engineer', 'Music Teacher'],
    'gaming': ['Game Developer', 'Esports Manager', 'Gaming Content Creator', 'Gaming Coach'],
    'ai': ['AI/ML Engineer', 'Data Scientist'],
    'doctor': ['Doctor (MBBS)', 'Nurse', 'Pharmacist'],
    'law': ['Lawyer / Advocate', 'Legal Advisor', 'Public Prosecutor'],
    'accounts': ['Chartered Accountant', 'Financial Analyst'],
    'business': ['Business Analyst', 'Entrepreneur'],
}

CAREER_CERTIFICATE_SUGGESTIONS = {
    'AI/ML Engineer': ['TensorFlow Developer Certificate', 'IBM Data Science Professional Certificate', 'AWS Machine Learning Specialty'],
    'Data Scientist': ['IBM Data Science Professional Certificate', 'Google Data Analytics Professional Certificate', 'Microsoft Azure Data Scientist Associate'],
    'Software Engineer': ['AWS Certified Developer', 'Oracle Java Certification', 'Microsoft Certified: Azure Developer Associate'],
    'Cybersecurity Analyst': ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Cisco CCNA Security'],
    'UI/UX Designer': ['Google UX Design Certificate', 'NN/g UX Certification', 'Adobe Certified Professional'],
    'Chartered Accountant': ['CA Foundation', 'CA Intermediate', 'CA Final'],
    'Doctor (MBBS)': ['NEET preparation courses', 'Medical entrance coaching'],
    'Lawyer / Advocate': ['CLAT coaching', 'legal research certifications'],
    'Pilot': ['CPL training', 'DGCA-approved flying school courses'],
}

CAREER_EXAM_GUIDE = {
    'Doctor (MBBS)': 'NEET is the main entrance exam for MBBS programs in India.',
    'Lawyer / Advocate': 'CLAT or state-level law entrance exams are normally required for law programs.',
    'Chartered Accountant': 'The CA Foundation, Intermediate, and Final exams are the standard path.',
    'Pilot': 'Commercial Pilot License (CPL) training and DGCA approval are required after 10+2 with Physics and Math.',
    'Software Engineer': 'Engineering entrance exams like JEE Main/Advanced, state engineering exams, or direct university admissions are common routes.',
    'AI/ML Engineer': 'A B.Tech/B.E. in CS or related field is common; many roles also prefer specialized AI/ML certification programs.',
}

CAREER_DEGREE_GUIDE = {
    'Doctor (MBBS)': 'MBBS after 10+2 with Physics, Chemistry, and Biology.',
    'Lawyer / Advocate': 'LLB after 10+2, or integrated BA LLB after 10+2.',
    'Chartered Accountant': 'After 10+2, pursue CA Foundation and the CA pathway.',
    'Software Engineer': 'B.Tech/B.E. in Computer Science, IT, or related engineering degrees.',
    'AI/ML Engineer': 'B.Tech/B.E. in Computer Science or a related field, often followed by specialized AI/ML training.',
    'Data Scientist': 'B.Tech/B.E., B.Sc. in Mathematics/Statistics/Computer Science, followed by data science certification.',
    'Pilot': 'Commercial Pilot License (CPL) after 10+2 with Physics and Math.',
}


def contains_tokenized_phrase(text: str, phrase: str) -> bool:
    if not phrase:
        return False
    text = f" {text} "
    phrase = f" {phrase} "
    return phrase in text or text.strip() == phrase.strip()


def get_normalized_career_map() -> Dict[str, str]:
    career_titles = load_known_career_titles()
    normalized = {normalize_lookup_value(title): title for title in career_titles if title}
    for alias, canonical in CAREER_TITLE_ALIASES.items():
        normalized[normalize_lookup_value(alias)] = canonical
    return normalized


def extract_career_titles(message: str, max_results: int = 3) -> list[str]:
    normalized_message = normalize_lookup_value(message)
    if not normalized_message:
        return []

    career_map = get_normalized_career_map()
    found: list[str] = []

    for alias_norm, canonical in career_map.items():
        if alias_norm and contains_tokenized_phrase(normalized_message, alias_norm) and canonical not in found:
            found.append(canonical)
            if len(found) >= max_results:
                return found

    if found:
        return found

    title_map = {normalize_lookup_value(title): title for title in load_known_career_titles()}
    for title_norm, title in title_map.items():
        if title_norm and contains_tokenized_phrase(normalized_message, title_norm) and title not in found:
            found.append(title)
            if len(found) >= max_results:
                return found

    tokens = normalized_message.split()
    if not tokens:
        return []

    title_norms = list(title_map.keys())
    for n in range(min(5, len(tokens)), 0, -1):
        for i in range(len(tokens) - n + 1):
            phrase = ' '.join(tokens[i:i+n])
            matches = difflib.get_close_matches(phrase, title_norms, n=2, cutoff=0.78)
            for match in matches:
                title = title_map.get(match)
                if title and title not in found:
                    found.append(title)
                    if len(found) >= max_results:
                        return found

    return found


def detect_intents(message: str) -> list[str]:
    normalized_message = normalize_lookup_value(message)
    intents: list[str] = []

    for intent, keywords in INTENT_KEYWORDS.items():
        if any(keyword in normalized_message for keyword in keywords):
            intents.append(intent)

    if any(keyword in normalized_message for keyword in CAREER_COMPARISON_KEYWORDS):
        if 'comparison' not in intents:
            intents.insert(0, 'comparison')

    if any(keyword in normalized_message for keyword in CAREER_SWITCH_KEYWORDS):
        if 'career switch' not in intents:
            intents.append('career switch')

    if not intents and any(keyword in normalized_message for keyword in CAREER_RECOMMENDATION_KEYWORDS):
        intents.append('recommendations')

    return intents


def detect_domains(message: str) -> list[str]:
    normalized_message = normalize_lookup_value(message)
    domains = []
    for keyword, category in DOMAIN_KEYWORDS.items():
        if keyword in normalized_message and category not in domains:
            domains.append(category)
    return domains


def detect_related_domain(message: str) -> str:
    normalized_message = normalize_lookup_value(message)
    for keyword, careers in DOMAIN_FALLBACK_CAREERS.items():
        if keyword in normalized_message:
            return keyword
    return ''


def build_domain_response(domain: str) -> str:
    careers = CAREER_CATEGORY_CAREERS.get(domain, [])
    title = DOMAIN_DISPLAY_NAMES.get(domain, domain)
    if not careers:
        return f"Here are some related careers in {title}. Please choose one to learn more."
    careers_list = '\n'.join(f"- {career}" for career in careers[:8])
    return (
        f"Possible careers in {title}:\n{careers_list}\n\n"
        "Which career would you like to know more about?"
    )


def build_interest_response(keyword: str) -> str:
    if keyword in DOMAIN_FALLBACK_CAREERS:
        careers = DOMAIN_FALLBACK_CAREERS[keyword]
        careers_list = '\n'.join(f"- {career}" for career in careers)
        return (
            f"Possible careers related to {keyword}:\n{careers_list}\n\n"
            "Which of these would you like to explore further?"
        )
    return "Tell me what career or domain you are interested in, and I will suggest the best options."


def format_list(items: list[str], limit: int = 5) -> str:
    return ', '.join(items[:limit])


def format_fee_samples(career_title: str) -> str:
    rows = fetch_career_colleges(career_title)
    fees = [format_annual_fee(row.get('annual_fee')) for row in rows if row.get('annual_fee')]
    unique_fees = []
    for fee in fees:
        if fee not in unique_fees:
            unique_fees.append(fee)
        if len(unique_fees) >= 3:
            break
    return ', '.join(unique_fees) if unique_fees else ''


def answer_colleges(career_title: str, message: str) -> str:
    colleges = fetch_career_colleges(career_title)
    if not colleges:
        return f"I could not find college listings for {career_title}. Try another related career or explore the domain pages for options."
    sample = []
    for college in colleges[:4]:
        sample.append(f"• {college['college_name']} ({college['state']}) — {college['college_type']} — {format_annual_fee(college['annual_fee'])}")
    return (
        f"Here are some colleges for {career_title}:\n" + '\n'.join(sample) +
        "\n\nUse the app's college finder to explore more options and compare fees and specializations by state."
    )


def answer_fees(career_title: str) -> str:
    sample_fees = format_fee_samples(career_title)
    if sample_fees:
        return (
            f"Annual fees for {career_title} can vary widely by state and institution. Sample fees from the database include {sample_fees}. "
            "Use the college finder to compare exact tuition and program costs for each institute."
        )
    return (
        f"Fees for {career_title} vary by program and state. "
        "Government colleges usually offer lower fees, while private and specialized programs tend to cost more."
    )


def answer_salary(career_title: str) -> str:
    salary = CAREER_DETAILS.get(career_title, DEFAULT_CAREER_DETAILS)['salaryRange']
    return (
        f"A typical salary range for {career_title} is {salary}. "
        "Actual pay depends on experience, location, company type, and your skills."
    )


def answer_roadmap(career_title: str) -> str:
    details = CAREER_DETAILS.get(career_title, DEFAULT_CAREER_DETAILS)
    roadmap = details.get('roadmap', DEFAULT_CAREER_DETAILS['roadmap'])
    return (
        f"A strong roadmap for {career_title} is: {', '.join(roadmap)}. "
        "Start with the fundamentals, build projects, and look for internships or training opportunities."
    )


def answer_skills(career_title: str) -> str:
    skills = CAREER_DETAILS.get(career_title, DEFAULT_CAREER_DETAILS)['skillsRequired']
    return (
        f"Key skills for {career_title} include {', '.join(skills)}. "
        "Focus on practical experience and projects to build confidence in these areas."
    )


def answer_certificates(career_title: str) -> str:
    certs = CAREER_CERTIFICATE_SUGGESTIONS.get(career_title)
    if certs:
        return (
            f"Useful certifications for {career_title} include {', '.join(certs)}. "
            "These can strengthen your resume and help you learn industry-relevant tools."
        )
    return (
        f"Professional certificates can help with {career_title}. "
        "Look for recognized programs in your domain to build practical skills and credibility."
    )


def answer_entrance_exam(career_title: str) -> str:
    exam = CAREER_EXAM_GUIDE.get(career_title)
    if exam:
        return exam
    return (
        f"Entrance exam requirements for {career_title} depend on the program and institution. "
        "Check the specific course admission guidelines or use the app's college finder for program-level details."
    )


def answer_degree(career_title: str) -> str:
    degree = CAREER_DEGREE_GUIDE.get(career_title)
    if degree:
        return degree
    return (
        f"A relevant degree for {career_title} depends on the career path. "
        "Look for related undergraduate and postgraduate programs in that field."
    )


def answer_eligibility(career_title: str) -> str:
    return (
        f"Eligibility for {career_title} usually includes the appropriate undergraduate program and the required entrance exam or qualifications. "
        "Review the specific course or university requirements for exact details."
    )


def answer_future_demand(career_title: str) -> str:
    demand = CAREER_DETAILS.get(career_title, DEFAULT_CAREER_DETAILS)['demandLevel']
    return (
        f"Future demand for {career_title} is generally {demand}. "
        "Build strong domain skills and practical experience to stay competitive in this field."
    )


def answer_jobs(career_title: str) -> str:
    description = CAREER_DESCRIPTIONS.get(career_title, '')
    if description:
        return f"{description} Many roles in this career include development, analysis, implementation, and project work depending on the employer."
    return f"{career_title} opens roles in its domain; focus on skills, experience, and certifications to access job opportunities."


def answer_government_jobs(career_title: str, domains: list[str]) -> str:
    if 'Government & Railway' in domains or 'Government & Railway' in career_title:
        return "Government careers include roles such as IAS, IPS, Railway Officer, Bank PO, and public sector positions. These typically require competitive exam preparation and strong general knowledge."
    return "Government job opportunities depend on the career domain. For public sector roles, prepare for the relevant competitive exams and look for government-supported training programs."


def answer_private_jobs(career_title: str, domains: list[str]) -> str:
    return "Private sector roles are common across IT, business, healthcare, and creative domains. Focus on in-demand skills, certifications, and internships to improve your chances of landing a private job."


def answer_career_switch(career_title: Optional[str], message: str) -> str:
    if career_title:
        return (
            f"Switching into {career_title} is possible with the right preparation. "
            "Build the key skills for the role, work on relevant projects, and look for internships or entry-level positions that bridge your current background to the new field."
        )
    return "Career switching is possible by learning the target domain's core skills, building projects, and seeking internships or entry-level roles in that field."


def answer_comparison(career_titles: list[str]) -> str:
    if len(career_titles) < 2:
        return "Please tell me two careers you want to compare, such as AI Engineer and Data Scientist."

    left, right = career_titles[:2]
    left_details = CAREER_DETAILS.get(left, DEFAULT_CAREER_DETAILS)
    right_details = CAREER_DETAILS.get(right, DEFAULT_CAREER_DETAILS)

    left_skills = format_list(left_details.get('skillsRequired', DEFAULT_CAREER_DETAILS['skillsRequired']), 4)
    right_skills = format_list(right_details.get('skillsRequired', DEFAULT_CAREER_DETAILS['skillsRequired']), 4)

    return (
        f"Comparison between {left} and {right}:\n"
        f"- {left}: {CAREER_DESCRIPTIONS.get(left, '')} Salary range {left_details['salaryRange']}. Key skills include {left_skills}.\n"
        f"- {right}: {CAREER_DESCRIPTIONS.get(right, '')} Salary range {right_details['salaryRange']}. Key skills include {right_skills}.\n"
        f"{left} tends to focus more on building and deploying technical solutions, while {right} often emphasizes data analysis and insights."
    )


def summarize_details(career_title: str, intents: list[str], domains: list[str]) -> str:
    parts: list[str] = []
    if 'colleges' in intents:
        parts.append(answer_colleges(career_title, ''))
    if 'fees' in intents:
        parts.append(answer_fees(career_title))
    if 'salary' in intents:
        parts.append(answer_salary(career_title))
    if 'roadmap' in intents:
        parts.append(answer_roadmap(career_title))
    if 'skills' in intents:
        parts.append(answer_skills(career_title))
    if 'certificates' in intents:
        parts.append(answer_certificates(career_title))
    if 'entrance exam' in intents:
        parts.append(answer_entrance_exam(career_title))
    if 'degree' in intents or 'higher studies' in intents:
        parts.append(answer_degree(career_title))
    if 'eligibility' in intents:
        parts.append(answer_eligibility(career_title))
    if 'career scope' in intents or 'future demand' in intents:
        parts.append(answer_future_demand(career_title))
    if 'jobs' in intents:
        parts.append(answer_jobs(career_title))
    if 'government jobs' in intents:
        parts.append(answer_government_jobs(career_title, domains))
    if 'private jobs' in intents:
        parts.append(answer_private_jobs(career_title, domains))
    if 'career switch' in intents:
        parts.append(answer_career_switch(career_title, ''))
    if not parts:
        parts.append(answer_roadmap(career_title))
    return '\n\n'.join(parts)


def find_known_career(message: str) -> Optional[str]:
    careers = extract_career_titles(message, max_results=1)
    return careers[0] if careers else None


def build_career_response(career_title: str, message: str) -> str:
    if not career_title:
        return 'Please select a career to view details.'

    if not message:
        return answer_roadmap(career_title)

    relevant_intents = detect_intents(message)
    if 'skills' in relevant_intents:
        return answer_skills(career_title)
    if 'salary' in relevant_intents:
        return answer_salary(career_title)
    if 'roadmap' in relevant_intents:
        return answer_roadmap(career_title)
    if 'colleges' in relevant_intents:
        return answer_colleges(career_title, message)
    if 'fees' in relevant_intents:
        return answer_fees(career_title)
    if 'certificates' in relevant_intents:
        return answer_certificates(career_title)
    if 'entrance exam' in relevant_intents:
        return answer_entrance_exam(career_title)
    if 'degree' in relevant_intents or 'higher studies' in relevant_intents:
        return answer_degree(career_title)
    if 'eligibility' in relevant_intents:
        return answer_eligibility(career_title)
    if 'career scope' in relevant_intents or 'future demand' in relevant_intents:
        return answer_future_demand(career_title)
    if 'jobs' in relevant_intents:
        return answer_jobs(career_title)
    if 'government jobs' in relevant_intents:
        return answer_government_jobs(career_title, detect_domains(message))
    if 'private jobs' in relevant_intents:
        return answer_private_jobs(career_title, detect_domains(message))
    return answer_roadmap(career_title)

DOMAIN_DISPLAY_NAMES = {
    'IT & Technology': 'IT & Technology Careers',
    'Gaming & Esports': 'Gaming & Esports',
    'Entrepreneurship': 'Entrepreneurship',
    'Arts & Creativity': 'Arts & Creativity',
    'Anime & Animation': 'Anime & Animation',
    'Acting & Entertainment': 'Acting & Entertainment',
    'Influencer & Content Creation': 'Content Creation',
    'Business & Commerce': 'Business & Commerce',
    'Law Careers': 'Law Careers',
    'Government & Railway': 'Government & Railway',
    'Healthcare': 'Healthcare',
    'Agriculture': 'Agriculture',
    'Music Careers': 'Music Careers',
}

DOMAIN_PROFILE_LABELS = {
    'IT & Technology': 'Technology',
    'Gaming & Esports': 'Gaming',
    'Entrepreneurship': 'Entrepreneurship',
    'Arts & Creativity': 'Creative',
    'Anime & Animation': 'Animation',
    'Acting & Entertainment': 'Entertainment',
    'Influencer & Content Creation': 'Content Creation',
    'Business & Commerce': 'Business',
    'Law Careers': 'Law',
    'Government & Railway': 'Government',
    'Healthcare': 'Healthcare',
    'Agriculture': 'Agriculture',
    'Music Careers': 'Music',
}

CAREER_DESCRIPTIONS = {
    'Software Engineer': 'Designs and develops software applications.',
    'AI/ML Engineer': 'Builds artificial intelligence and machine learning solutions.',
    'Data Scientist': 'Analyzes data and builds predictive models.',
    'Full Stack Developer': 'Builds frontend and backend web applications.',
    'Cybersecurity Analyst': 'Protects systems from cyber threats.',
    'UI/UX Designer': 'Designs intuitive digital experiences and interfaces.',
    'DevOps Engineer': 'Automates deployment and keeps software delivery reliable.',
    'UX Researcher': 'Studies users to improve product design and usability.',
    'Esports Player': 'Competes in gaming tournaments.',
    'Game Streamer': 'Streams gameplay online.',
    'Game Developer': 'Designs and develops video games.',
    'Gaming Coach': 'Trains players and teams to improve competitive performance.',
    'Gaming Content Creator': 'Creates gaming videos and community content.',
    'Esports Commentator': 'Provides live commentary for gaming events.',
    'Startup Founder': 'Builds and manages startup companies.',
    'Tech Entrepreneur': 'Creates technology businesses.',
    'Small Business Owner': 'Runs and grows an independent business.',
    'E-commerce Owner': 'Operates an online retail business.',
    'Franchise Owner': 'Manages a business under an established brand.',
    'Consultant': 'Advises clients on business and growth strategy.',
    'Film Actor': 'Performs leading and supporting roles in movies.',
    'Theater Artist': 'Performs in stage plays and live productions.',
    'Voice Actor': 'Provides voices for animation and games.',
    'TV Serial Actor': 'Acts in television serials.',
    'Stand-up Comedian': 'Performs comedy before live audiences.',
    'Graphic Designer': 'Creates visual designs.',
    'Illustrator': 'Creates drawings and illustrations.',
    'Digital Artist': 'Produces digital artwork.',
    'Animator': 'Creates animated content.',
    'Character Designer': 'Creates animated characters.',
    'Storyboard Artist': 'Plans scenes and visual sequences for animation.',
    '3D Artist': 'Creates three-dimensional digital assets.',
    'VFX Artist': 'Builds visual effects for media and film.',
    'Animation Director': 'Leads animation projects and creative teams.',
    'Content Creator': 'Creates and publishes digital content.',
    'Social Media Manager': 'Manages brand presence on social platforms.',
    'YouTuber': 'Produces video content for online audiences.',
    'Instagram Influencer': 'Builds audience engagement through social content.',
    'Vlogger': 'Creates video blogs and personal content.',
    'Podcast Host': 'Hosts audio shows and interviews.',
}
ALL_KNOWN_CAREER_TITLES = sorted(
    set(title for titles in CAREER_CATEGORY_CAREERS.values() for title in titles)
    | set(CAREER_DESCRIPTIONS.keys())
    | set(CAREER_DETAILS.keys()),
    key=lambda x: -len(x)
)
KNOWN_CAREER_TITLES: list[str] = []

def load_known_career_titles() -> list[str]:
    global KNOWN_CAREER_TITLES
    if KNOWN_CAREER_TITLES:
        return KNOWN_CAREER_TITLES

    career_titles = set(ALL_KNOWN_CAREER_TITLES)
    try:
        for row in load_seed_career_rows_from_csv():
            if row[0]:
                career_titles.add(row[0].strip())
    except Exception:
        pass

    try:
        with get_db() as connection:
            rows = connection.execute('SELECT DISTINCT career_title FROM career_colleges').fetchall()
            for row in rows:
                if row['career_title']:
                    career_titles.add(row['career_title'].strip())
    except Exception:
        pass

    KNOWN_CAREER_TITLES = sorted(career_titles, key=lambda x: -len(x))
    return KNOWN_CAREER_TITLES

TOP_DOMAIN_ALLOCATION = [5, 3, 2]


def get_db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA foreign_keys = ON')
    return connection


def now_iso() -> str:
    return datetime.utcnow().isoformat(timespec='seconds') + 'Z'


def normalize_lookup_value(value: Optional[str]) -> str:
    if value is None:
        return ''
    normalized = re.sub(r'[^a-z0-9]+', ' ', str(value).strip().lower())
    return ' '.join(normalized.split())


def canonicalize_state_name(state: Optional[str]) -> str:
    if not state:
        return ''
    normalized = normalize_lookup_value(state)
    canonical = STATE_ALIASES.get(normalized)
    if canonical:
        return canonical
    for known_state in CANONICAL_INDIAN_STATES:
        if normalize_lookup_value(known_state) == normalized:
            return known_state
    return ''


def format_annual_fee(value: Optional[str]) -> str:
    fee_text = (value or '').strip().replace('"', '').replace("'", '')
    if not fee_text:
        return '₹ 1,20,000'
    if not fee_text.startswith('₹'):
        fee_text = f'₹ {fee_text}'
    return fee_text


def infer_college_type(college_name: str, domain: Optional[str] = None) -> str:
    normalized_name = normalize_lookup_value(college_name)
    if any(keyword in normalized_name for keyword in [
        'iit', 'nit', 'iiit', 'iisc', 'iim', 'nlu', 'national', 'central', 'government', 'state',
        'kvs', 'navodaya', 'public', 'defence', 'army'
    ]):
        return 'Government'
    if domain and normalize_lookup_value(domain) in {'information technology', 'engineering', 'business', 'healthcare', 'law', 'arts', 'animation'}:
        return 'Government' if 'national' in normalize_lookup_value(domain) else 'Private'
    return 'Private'


def extract_college_location(college_name: str, default_state: str) -> str:
    if ',' in college_name:
        location = college_name.rsplit(',', 1)[-1].strip()
        if location and normalize_lookup_value(location) != normalize_lookup_value(default_state):
            return location
    return default_state


def get_career_speciality(career_title: str) -> str:
    normalized = normalize_lookup_value(career_title)
    mappings = {
        'software': 'Computer Science & Engineering',
        'full stack': 'Computer Science & Engineering',
        'ai': 'Artificial Intelligence & Machine Learning',
        'ml': 'Artificial Intelligence & Machine Learning',
        'data scientist': 'Data Science',
        'data': 'Data Science',
        'cybersecurity': 'Cyber Security',
        'cyber': 'Cyber Security',
        'lawyer': 'Law',
        'advocate': 'Law',
        'judge': 'Law',
        'doctor': 'Medical Sciences',
        'nurse': 'Nursing',
        'physiotherapist': 'Physiotherapy',
        'pharmacist': 'Pharmacy',
        'dentist': 'Dental Science',
        'teacher': 'Education',
        'manager': 'Management',
        'business': 'Business Management',
        'marketing': 'Marketing',
        'accountant': 'Finance',
        'chartered accountant': 'Finance',
        'entrepreneur': 'Business Management',
        'content creator': 'Media & Communications',
        'influencer': 'Media & Communications',
        'animator': 'Animation & Visual Effects',
        'artist': 'Creative Arts',
        'designer': 'Design',
        'musician': 'Music',
        'singer': 'Music',
        'dj': 'Music & Audio',
        'pilot': 'Aviation',
        'aircraft': 'Aerospace Engineering',
        'agricultur': 'Agricultural Science',
        'forest officer': 'Environment & Forestry',
        'bank po': 'Commerce & Banking',
        'ssc cgl': 'Public Administration',
        'govt': 'Public Administration',
        'railway': 'Transportation',
    }
    for keyword, speciality in mappings.items():
        if keyword in normalized:
            return speciality
    return 'Professional Studies'


def format_number_with_commas(value: int) -> str:
    return f'₹ {value:,}'


def generate_college_name(career_title: str, state: str, index: int) -> str:
    speciality = get_career_speciality(career_title)
    subject = speciality.split('&')[0].strip()
    patterns = [
        f"{state} Institute of {subject}",
        f"{state} College of {subject}",
        f"{state} School of {subject}",
        f"{state} Academy of {subject}",
        f"National Institute of {subject} {state}",
        f"{state} Centre for {subject}",
    ]
    name = patterns[index % len(patterns)]
    if index >= len(patterns):
        name = f"{state} {subject} Institute {index + 1}"
    return name


def generate_annual_fee(career_title: str, index: int) -> str:
    normalized = normalize_lookup_value(career_title)
    if any(keyword in normalized for keyword in ['doctor', 'nurse', 'pharmacist', 'dentist', 'physiotherapist', 'medical', 'lab technician']):
        base = 180000
    elif any(keyword in normalized for keyword in ['law', 'judge', 'advocate', 'legal']):
        base = 150000
    elif any(keyword in normalized for keyword in ['business', 'manager', 'entrepreneur', 'accountant', 'finance', 'marketing', 'consultant']):
        base = 160000
    elif any(keyword in normalized for keyword in ['art', 'design', 'music', 'photographer', 'fashion', 'creative', 'animator', 'artist']):
        base = 140000
    elif any(keyword in normalized for keyword in ['pilot', 'aircraft', 'aviation']):
        base = 200000
    else:
        base = 130000
    amount = base + ((index % 4) * 25000)
    return format_number_with_commas(amount)


def get_career_csv_path() -> str:
    if os.path.exists(EXTERNAL_REAL_CSV):
        return EXTERNAL_REAL_CSV

    if os.path.exists(LOCAL_CAREER_CSV):
        return LOCAL_CAREER_CSV

    return LOCAL_CAREER_CSV


def load_seed_career_rows_from_csv() -> list[tuple[str, str, str, str, str, str, str]]:
    csv_path = get_career_csv_path()
    if not os.path.exists(csv_path):
        return []

    rows: list[tuple[str, str, str, str, str, str, str]] = []
    with open(csv_path, 'r', encoding='utf-8', newline='') as raw_csv:
        reader = csv.DictReader(raw_csv)
        for row in reader:
            career_title = (row.get('Career') or '').strip()
            if not career_title:
                continue
            state = canonicalize_state_name(row.get('State') or '')
            if not state:
                continue
            college_name = (row.get('College Name') or '').strip()
            if not college_name:
                continue
            speciality = (row.get('Speciality') or '').strip() or get_career_speciality(career_title)
            annual_fee = format_annual_fee((row.get('Tuition Fee (INR)') or '').strip())
            location = extract_college_location(college_name, state)
            college_type = infer_college_type(college_name, row.get('Domain') or '')
            rows.append((career_title, state, college_name, college_type, location, annual_fee, speciality))
    return rows


def generate_college_rows_for_career_state(career_title: str, state: str, count: int, existing_names: set[str]) -> list[tuple[str, str, str, str, str, str, str]]:
    rows: list[tuple[str, str, str, str, str, str, str]] = []
    career_clean = resolve_career_title(career_title)
    for index in range(count * 2):
        college_name = generate_college_name(career_clean, state, index)
        if college_name in existing_names:
            continue
        existing_names.add(college_name)
        college_type = infer_college_type(college_name)
        location = extract_college_location(college_name, state)
        annual_fee = generate_annual_fee(career_clean, index)
        speciality = get_career_speciality(career_clean)
        rows.append((career_clean, state, college_name, college_type, location, annual_fee, speciality))
        if len(rows) >= count:
            break
    return rows


def ensure_career_colleges_for_state(career_title: str, state: str, minimum_count: int = 10) -> None:
    career_clean = resolve_career_title(career_title)
    state_clean = canonicalize_state_name(state)
    if not career_clean or not state_clean:
        return

    with get_db() as connection:
        existing_rows = connection.execute(
            '''
            SELECT college_name
            FROM career_colleges
            WHERE LOWER(career_title) = LOWER(?)
            AND LOWER(state) = LOWER(?)
            ''',
            (career_clean, state_clean),
        ).fetchall()

        existing_names = {row['college_name'] for row in existing_rows}
        current_count = len(existing_names)
        if current_count >= minimum_count:
            return

        rows_to_insert = generate_college_rows_for_career_state(career_clean, state_clean, minimum_count - current_count, existing_names)
        if rows_to_insert:
            timestamp = now_iso()
            connection.executemany(
                '''
                INSERT OR IGNORE INTO career_colleges (
                    career_title, state, college_name, college_type, location,
                    annual_fee, speciality, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                [(career_clean, state_clean, college_name, college_type, location, annual_fee, speciality, timestamp)
                 for (_, _, college_name, college_type, location, annual_fee, speciality) in rows_to_insert],
            )


CAREER_TITLE_ALIASES = {
    'doctor': 'Doctor (MBBS)',
    'doctor mbbs': 'Doctor (MBBS)',
    'lawyer': 'Lawyer / Advocate',
    'lawyer advocate': 'Lawyer / Advocate',
    'advocate': 'Lawyer / Advocate',
    'chartered accountant': 'Chartered Accountant',
    'ca': 'Chartered Accountant',
    'cybersecurity analyst': 'Cyber Security Analyst',
    'dentist': 'Dentist (BDS)',
    'forest officer': 'IFS Officer',
    'medical lab technician': 'Medical Laboratory Technician',
    'instagram influencer': 'Brand Influencer',
    'podcast host': 'Podcaster',
    'professional dancer': 'Classical Dancer',
    'small business owner': 'Business Owner',
    'tech entrepreneur': 'Entrepreneur',
    'business consultant': 'Business Analyst',
    'animation director': 'Animator',
    'theater artist': 'Theatre Artist',
    'tv serial actor': 'TV Actor',
    'vlogger': 'Blogger',
    'dance content creator': 'Content Creator',
    'gaming content creator': 'Content Creator',
    'fashion photographer': 'Fashion Designer',
    'franchise owner': 'Business Owner',
    'esports player': 'Esports Manager',
    'esports commentator': 'Esports Manager',
    'aircraft engineer': 'Aircraft Maintenance Engineer',
    'commercial pilot': 'Pilot',
    'agricultural scientist': 'Agricultural Engineer',
    'organic farmer': 'Agricultural Engineer',
    'agri-business manager': 'Agricultural Engineer',
    'ai engineer': 'AI/ML Engineer',
    'ml engineer': 'AI/ML Engineer',
}

def resolve_career_title(career_title: Optional[str]) -> str:
    normalized = normalize_lookup_value(career_title)
    return CAREER_TITLE_ALIASES.get(normalized, career_title or '')


RELATED_SPECIALIZATION_KEYWORDS = {
    'content creator': ['digital media', 'mass communication', 'journalism', 'multimedia', 'social media'],
    'youtube': ['digital media', 'mass communication', 'journalism', 'multimedia', 'video production'],
    'influencer': ['digital media', 'mass communication', 'journalism', 'branding'],
    'podcaster': ['journalism', 'mass communication', 'broadcast', 'audio production'],
    'fashion photographer': ['photography', 'visual arts', 'fashion design', 'media'],
    'photographer': ['photography', 'visual arts', 'film', 'media'],
    'game developer': ['game design', 'computer science', 'software engineering', 'animation'],
    'animator': ['animation', 'multimedia', 'visual effects', 'graphic design'],
    'ui ux designer': ['ui design', 'ux design', 'product design', 'interaction design'],
    'digital marketer': ['digital marketing', 'marketing', 'advertising', 'communications'],
    'ethical hacker': ['cyber security', 'information security', 'computer networks', 'computer science'],
    'cloud engineer': ['cloud computing', 'information technology', 'computer science', 'devops'],
    'ai engineer': ['artificial intelligence', 'machine learning', 'computer science', 'data science'],
    'data scientist': ['data science', 'machine learning', 'computer science', 'analytics'],
    'cyber security analyst': ['cyber security', 'information security', 'network security', 'computer science'],
    'film director': ['film making', 'cinema', 'media studies', 'broadcast'],
    'music producer': ['music technology', 'performing arts', 'audio engineering', 'music'],
    'singer': ['performing arts', 'music', 'vocal performance', 'audio'],
    'dancer': ['performing arts', 'dance', 'choreography', 'theater'],
    'chef': ['culinary arts', 'hospitality', 'hotel management', 'food technology'],
    'hotel manager': ['hospitality', 'hotel management', 'tourism', 'business management'],
    'travel blogger': ['tourism', 'travel and hospitality', 'journalism', 'media'],
    'journalist': ['journalism', 'mass communication', 'media studies', 'broadcast'],
    'sports analyst': ['sports management', 'analytics', 'data science', 'business management'],
    'event manager': ['event management', 'hospitality', 'business management', 'marketing'],
    'fashion designer': ['fashion design', 'apparel design', 'textile design', 'visual arts'],
    'interior designer': ['interior design', 'architecture', 'visual arts', 'product design'],
}


def find_best_career_title_match(career_title: str) -> str:
    career_clean = (career_title or '').strip()
    if not career_clean:
        return ''

    normalized = normalize_lookup_value(career_clean)
    known_titles = load_known_career_titles()
    lookup = {normalize_lookup_value(title): title for title in known_titles}

    if normalized in lookup:
        return lookup[normalized]

    close_matches = difflib.get_close_matches(normalized, list(lookup.keys()), n=1, cutoff=0.75)
    if close_matches:
        return lookup[close_matches[0]]

    return career_clean


def get_related_specialization_keywords(career_title: str) -> list[str]:
    normalized = normalize_lookup_value(career_title)
    if not normalized:
        return []

    for key, keywords in RELATED_SPECIALIZATION_KEYWORDS.items():
        if key in normalized:
            return keywords

    if 'design' in normalized or 'ux' in normalized or 'ui' in normalized:
        return ['design', 'visual arts', 'product design']
    if 'media' in normalized or 'content' in normalized or 'influencer' in normalized or 'podcast' in normalized or 'youtube' in normalized:
        return ['digital media', 'mass communication', 'journalism', 'media studies']
    if 'music' in normalized or 'singer' in normalized or 'producer' in normalized:
        return ['music', 'performing arts', 'audio engineering']
    if 'film' in normalized or 'director' in normalized or 'cinema' in normalized:
        return ['film making', 'cinema', 'media studies']
    if 'dance' in normalized:
        return ['dance', 'performing arts', 'choreography']
    if 'chef' in normalized or 'hotel' in normalized or 'travel' in normalized or 'hospitality' in normalized:
        return ['hospitality', 'culinary arts', 'tourism', 'hotel management']
    if 'data' in normalized or 'ai' in normalized or 'ml' in normalized or 'cloud' in normalized or 'cyber' in normalized:
        return ['computer science', 'data science', 'information technology', 'machine learning']

    speciality = normalize_lookup_value(get_career_speciality(career_title))
    return [speciality] if speciality else []


def query_career_colleges_from_db(career_title: str, state: Optional[str] = None, limit: Optional[int] = None) -> list[Dict[str, Any]]:
    career_title = (career_title or '').strip()
    if not career_title:
        return []

    with get_db() as connection:
        params = [career_title]
        sql = '''
            SELECT career_title, state, college_name, college_type, location, annual_fee, speciality
            FROM career_colleges
            WHERE LOWER(career_title) = LOWER(?)
        '''
        if state:
            sql += ' AND LOWER(state) = LOWER(?)'
            params.append(state)
        sql += ' ORDER BY college_name'
        if limit:
            sql += ' LIMIT ?'
            params.append(limit)
        rows = connection.execute(sql, tuple(params)).fetchall()
        if rows:
            return [dict(r) for r in rows]

        if state:
            params = [f'%{career_title}%', state]
            sql = '''
                SELECT career_title, state, college_name, college_type, location, annual_fee, speciality
                FROM career_colleges
                WHERE LOWER(career_title) LIKE LOWER(?)
                AND LOWER(state) = LOWER(?)
                ORDER BY college_name
            '''
        else:
            params = [f'%{career_title}%']
            sql = '''
                SELECT career_title, state, college_name, college_type, location, annual_fee, speciality
                FROM career_colleges
                WHERE LOWER(career_title) LIKE LOWER(?)
                ORDER BY state, college_name
            '''
        if limit:
            sql += ' LIMIT ?'
            params.append(limit)
        rows = connection.execute(sql, tuple(params)).fetchall()
        return [dict(r) for r in rows]


def fetch_related_specialization_colleges(career_title: str, state: Optional[str] = None, exclude_names: Optional[set[str]] = None, limit: int = 10) -> list[Dict[str, Any]]:
    keywords = get_related_specialization_keywords(career_title)
    if not keywords:
        return []

    exclude_names = exclude_names or set()
    state_clean = canonicalize_state_name(state) if state else ''
    with get_db() as connection:
        conditions = []
        params: list[str] = []
        for keyword in keywords:
            conditions.append('(LOWER(speciality) LIKE LOWER(?) OR LOWER(career_title) LIKE LOWER(?))')
            params.extend([f'%{keyword}%', f'%{keyword}%'])

        sql = '''
            SELECT career_title, state, college_name, college_type, location, annual_fee, speciality
            FROM career_colleges
        '''
        if state_clean:
            sql += ' WHERE LOWER(state) = LOWER(?) AND (' + ' OR '.join(conditions) + ')' 
            params = [state_clean] + params
        else:
            sql += ' WHERE ' + ' OR '.join(conditions)
        sql += ' ORDER BY college_name'
        sql += ' LIMIT ?'
        params.append(limit * 3)

        rows = connection.execute(sql, tuple(params)).fetchall()
        result: list[Dict[str, Any]] = []
        for row in rows:
            if row['college_name'] in exclude_names:
                continue
            result.append(dict(row))
            if len(result) >= limit:
                break
        return result


def fetch_career_colleges(career_title: str, state: Optional[str] = None) -> list[Dict[str, Any]]:
    career_clean = resolve_career_title((career_title or '').strip())
    raw_state = (state or '').strip()
    state_clean = canonicalize_state_name(raw_state)

    if not career_clean:
        return []

    if raw_state and not state_clean:
        return []

    career_match = find_best_career_title_match(career_clean)
    rows = query_career_colleges_from_db(career_match, state_clean, limit=10 if state_clean else None)

    if rows:
        if state_clean and len(rows) < 10:
            existing_names = {row['college_name'] for row in rows}
            extra = fetch_related_specialization_colleges(career_match, state_clean, existing_names, 10 - len(rows))
            rows.extend(extra)
        return rows

    if state_clean:
        rows = fetch_related_specialization_colleges(career_match, state_clean, set(), 10)
        return rows

    return fetch_related_specialization_colleges(career_match, None, set(), 10)


def fetch_colleges_for_career_state(career_id: Optional[str], state: Optional[str]) -> list[Dict[str, Any]]:
    return fetch_career_colleges(career_id or '', state)


def ensure_career_colleges_for_state(career_title: str, state: str, minimum_count: int = 10) -> None:
    career_clean = resolve_career_title(career_title)
    state_clean = canonicalize_state_name(state)
    if not career_clean or not state_clean:
        return

    with get_db() as connection:
        existing_rows = connection.execute(
            '''
            SELECT college_name
            FROM career_colleges
            WHERE LOWER(career_title) = LOWER(?)
            AND LOWER(state) = LOWER(?)
            ''',
            (career_clean, state_clean),
        ).fetchall()

        existing_names = {row['college_name'] for row in existing_rows}
        current_count = len(existing_names)
        if current_count >= minimum_count:
            return

        rows_to_insert = generate_college_rows_for_career_state(career_clean, state_clean, minimum_count - current_count, existing_names)
        if rows_to_insert:
            timestamp = now_iso()
            connection.executemany(
                '''
                INSERT OR IGNORE INTO career_colleges (
                    career_title, state, college_name, college_type, location,
                    annual_fee, speciality, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                [(career_title, state_clean, college_name, college_type, location, annual_fee, speciality, timestamp)
                 for (career_title, state_clean, college_name, college_type, location, annual_fee, speciality) in rows_to_insert],
            )


def json_error(message: str, status_code: int, errors: Optional[Dict[str, Any]] = None):
    payload: Dict[str, Any] = {'success': False, 'message': message}
    if errors:
        payload['errors'] = errors
    return jsonify(payload), status_code


def get_request_data() -> Dict[str, Any]:
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


def fetch_colleges_for_career_state(career_id: Optional[str], state: Optional[str]) -> list[Dict[str, Any]]:
    return fetch_career_colleges(career_id or '', state)


def fetch_available_career_states(career_title: str) -> list[str]:
    career_clean = resolve_career_title((career_title or '').strip())
    if not career_clean:
        return []

    with get_db() as connection:
        rows = connection.execute(
            '''
            SELECT DISTINCT state
            FROM career_colleges
            WHERE LOWER(career_title) = LOWER(?) OR LOWER(career_title) LIKE LOWER(?)
            ORDER BY state
            ''',
            (career_clean, f'%{career_clean}%'),
        ).fetchall()

    if rows:
        return [row[0] for row in rows]

    if career_clean in load_known_career_titles():
        return CANONICAL_INDIAN_STATES.copy()

    return [state for state in DEFAULT_CAREER_STATES if state]


def normalize_email(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    return value.strip().lower()


def validate_email(value: Optional[str]) -> bool:
    return bool(value and EMAIL_REGEX.match(value))


def validate_phone(value: Optional[str]) -> bool:
    return bool(value and PHONE_REGEX.match(value))


def ensure_column(connection: sqlite3.Connection, table_name: str, column_sql: str, column_name: str) -> None:
    columns = {row['name'] for row in connection.execute(f'PRAGMA table_info({table_name})').fetchall()}
    if column_name not in columns:
        connection.execute(f'ALTER TABLE {table_name} ADD COLUMN {column_sql}')


def ensure_career_colleges_seeded() -> None:
    try:
        with get_db() as connection:
            connection.execute(
                '''
                CREATE TABLE IF NOT EXISTS career_colleges (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    career_title TEXT NOT NULL,
                    state TEXT NOT NULL,
                    college_name TEXT NOT NULL,
                    college_type TEXT NOT NULL,
                    location TEXT NOT NULL,
                    annual_fee TEXT NOT NULL,
                    speciality TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    UNIQUE(career_title, state, college_name)
                )
                '''
            )
            existing_count = connection.execute('SELECT COUNT(*) FROM career_colleges').fetchone()[0]
            if existing_count > 0:
                return

            rows = load_seed_career_rows_from_csv()
            if not rows:
                return

            timestamp = now_iso()
            connection.executemany(
                '''
                INSERT OR IGNORE INTO career_colleges (
                    career_title, state, college_name, college_type, location,
                    annual_fee, speciality, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                [(career_title, state, college_name, college_type, location, annual_fee, speciality, timestamp)
                 for (career_title, state, college_name, college_type, location, annual_fee, speciality) in rows],
            )
    except Exception:
        pass


def repair_renamed_user_foreign_keys(connection: sqlite3.Connection) -> None:
    connection.execute('DROP TABLE IF EXISTS users_old')

    table_definitions = {
        'personal_details': '''
            CREATE TABLE personal_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                city TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''',
        'career_assessments': '''
            CREATE TABLE career_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                answers_json TEXT NOT NULL,
                skill_scores_json TEXT NOT NULL,
                category_scores_json TEXT NOT NULL,
                recommendations_json TEXT NOT NULL,
                top_category TEXT NOT NULL,
                top_score INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''',
        'saved_careers': '''
            CREATE TABLE saved_careers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                salary TEXT DEFAULT '',
                match TEXT DEFAULT '',
                description TEXT DEFAULT '',
                source TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, title)
            )
        ''',
    }

    for table_name, recreate_sql in table_definitions.items():
        schema_sql = connection.execute(
            "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?",
            (table_name,),
        ).fetchone()
        schema_sql_text = schema_sql[0] if schema_sql else ''
        foreign_keys = connection.execute(f"PRAGMA foreign_key_list('{table_name}')").fetchall()
        ref_targets = {foreign_key[2] for foreign_key in foreign_keys}

        if 'users_old' not in (schema_sql_text or '') and 'users_old' not in ref_targets:
            continue

        old_table = f'{table_name}_old'
        connection.execute(f'DROP TABLE IF EXISTS {old_table}')
        connection.execute(f'ALTER TABLE {table_name} RENAME TO {old_table}')
        connection.execute(recreate_sql)
        columns = connection.execute(f'PRAGMA table_info({old_table})').fetchall()
        if columns:
            col_names = [column[1] for column in columns]
            column_list = ', '.join(col_names)
            connection.execute(
                f'INSERT INTO {table_name} ({column_list}) SELECT {column_list} FROM {old_table}'
            )
        connection.execute(f'DROP TABLE {old_table}')


def ensure_database() -> None:
    os.makedirs(BASE_DIR, exist_ok=True)
    with get_db() as connection:
        repair_renamed_user_foreign_keys(connection)
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                age TEXT DEFAULT '',
                gender TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS personal_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                date_of_birth TEXT NOT NULL,
                gender TEXT NOT NULL,
                phone_number TEXT NOT NULL,
                city TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS career_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                answers_json TEXT NOT NULL,
                skill_scores_json TEXT NOT NULL,
                category_scores_json TEXT NOT NULL,
                recommendations_json TEXT NOT NULL,
                top_category TEXT NOT NULL,
                top_score INTEGER NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS saved_careers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                salary TEXT DEFAULT '',
                match TEXT DEFAULT '',
                description TEXT DEFAULT '',
                source TEXT DEFAULT '',
                created_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(user_id, title)
            )
            '''
        )
        connection.execute(
            '''
            CREATE TABLE IF NOT EXISTS career_colleges (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                career_title TEXT NOT NULL,
                state TEXT NOT NULL,
                college_name TEXT NOT NULL,
                college_type TEXT NOT NULL,
                location TEXT NOT NULL,
                annual_fee TEXT NOT NULL,
                speciality TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(career_title, state, college_name)
            )
            '''
        )

        ensure_column(connection, 'users', "age TEXT DEFAULT ''", 'age')
        ensure_column(connection, 'users', "gender TEXT DEFAULT ''", 'gender')

        # Seed default demo account if no users exist or demo user missing
        demo_user = connection.execute('SELECT id FROM users WHERE email = ?', ('demo@smartcareer.com',)).fetchone()
        if not demo_user:
            timestamp = now_iso()
            connection.execute(
                '''
                INSERT INTO users (full_name, email, password_hash, age, gender, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                ('Demo User', 'demo@smartcareer.com', generate_password_hash('password123'), '21', 'male', timestamp, timestamp)
            )

        ensure_career_colleges_seeded()


# Ensure database tables exist on module initialization
ensure_database()


def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db() as connection:
        row = connection.execute(
            'SELECT id, full_name, email, password_hash, age, gender, created_at, updated_at FROM users WHERE email = ?',
            (email,),
        ).fetchone()
        return dict(row) if row else None


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    with get_db() as connection:
        row = connection.execute(
            'SELECT id, full_name, email, password_hash, age, gender, created_at, updated_at FROM users WHERE id = ?',
            (user_id,),
        ).fetchone()
        return dict(row) if row else None


def serialize_user(user_row: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'id': user_row['id'],
        'full_name': user_row['full_name'],
        'email': user_row['email'],
        'age': user_row.get('age', ''),
        'gender': user_row.get('gender', ''),
        'created_at': user_row['created_at'],
        'updated_at': user_row['updated_at'],
    }


def resolve_user_id(data: Dict[str, Any]) -> Optional[int]:
    user_id = data.get('user_id')
    if user_id is not None:
        try:
            return int(user_id)
        except (TypeError, ValueError):
            return None

    email = normalize_email(data.get('email'))
    if email and validate_email(email):
        user = get_user_by_email(email)
        if user:
            return int(user['id'])
    return None


def coalesce(existing: Any, incoming: Any) -> Any:
    return existing if incoming in (None, '') else incoming


def normalize_answer(value: Any) -> Optional[str]:
    if value is None:
        return None
    normalized = str(value).strip().lower()
    normalized = OPTION_ALIASES.get(normalized, normalized)
    return normalized if normalized in OPTION_SCORES else None


def normalize_answer_score(value: Any) -> int:
    if value is None:
        return 0

    if isinstance(value, bool):
        return 0

    if isinstance(value, (int, float)):
        numeric = int(value)
        if 1 <= numeric <= 5:
            return numeric
        if 0 <= numeric <= 4:
            return numeric + 1
        return 0

    normalized = str(value).strip().lower()
    normalized = OPTION_ALIASES.get(normalized, normalized)
    mapped = {
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        'very interested': 5,
        'interested': 4,
        'neutral': 3,
        'disagree': 2,
        'not interested': 2,
        'strongly agree': 5,
        'agree': 4,
        'strongly disagree': 1,
    }
    return mapped.get(normalized, 0)


def json_dumps(value: Any) -> str:
    import json

    return json.dumps(value, ensure_ascii=False)


def json_loads(value: str) -> Any:
    import json

    return json.loads(value)


def calculate_skill_scores(answers: Dict[str, Any]) -> Dict[str, int]:
    question_scores = {}
    for index in range(1, 11):
        question_key = f'q{index}'
        question_scores[question_key] = normalize_answer_score(answers.get(question_key))
    return question_scores


def recommend_careers(answers: Dict[str, Any]) -> Dict[str, Any]:
    question_scores = calculate_skill_scores(answers)

    category_scores: Dict[str, float] = {}
    for category_name, profile in CAREER_CATEGORY_PROFILES.items():
        max_possible = sum(weight * 5 for weight in profile.values())
        raw_score = sum((question_scores.get(question_id, 0) * weight) for question_id, weight in profile.items())
        category_scores[category_name] = round((raw_score / max_possible) * 100, 1) if max_possible > 0 else 0.0

    ranked_categories = sorted(category_scores.items(), key=lambda item: item[1], reverse=True)
    top_category = ranked_categories[0][0] if ranked_categories else 'IT & Technology'
    top_score = ranked_categories[0][1] if ranked_categories else 0
    top_domains = [domain for domain, _ in ranked_categories[:3]]

    student_profile = ' + '.join(DOMAIN_PROFILE_LABELS.get(domain, domain) for domain in top_domains) if top_domains else 'Career Discovery'

    all_careers = []
    for domain in top_domains:
        for career_name in CAREER_CATEGORY_CAREERS.get(domain, []):
            profile = CAREER_CATEGORY_PROFILES.get(domain, {})
            max_possible = sum(weight * 5 for weight in profile.values())
            raw_score = sum((question_scores.get(question_id, 0) * weight) for question_id, weight in profile.items())
            score = round((raw_score / max_possible) * 100, 1) if max_possible > 0 else 0.0
            details = CAREER_DETAILS.get(career_name, DEFAULT_CAREER_DETAILS)
            all_careers.append(
                {
                    'career': career_name,
                    'description': CAREER_DESCRIPTIONS.get(career_name, 'Recommended based on your assessment.'),
                    'category': DOMAIN_DISPLAY_NAMES.get(domain, domain),
                    'score': max(1, int(round(score))),
                    'skillsRequired': details['skillsRequired'],
                    'roadmap': details['roadmap'],
                    'salaryRange': details['salaryRange'],
                    'demandLevel': details['demandLevel'],
                }
            )

    if not all_careers:
        for domain, careers in CAREER_CATEGORY_CAREERS.items():
            for career_name in careers:
                details = CAREER_DETAILS.get(career_name, DEFAULT_CAREER_DETAILS)
                all_careers.append({
                    'career': career_name,
                    'description': CAREER_DESCRIPTIONS.get(career_name, 'Recommended based on your assessment.'),
                    'category': DOMAIN_DISPLAY_NAMES.get(domain, domain),
                    'score': 50,
                    'skillsRequired': details['skillsRequired'],
                    'roadmap': details['roadmap'],
                    'salaryRange': details['salaryRange'],
                    'demandLevel': details['demandLevel'],
                })

    scored_careers = []
    seen = set()
    for career in all_careers:
        if career['career'] in seen:
            continue
        seen.add(career['career'])
        scored_careers.append(career)

    scored_careers.sort(key=lambda item: item['score'], reverse=True)
    recommended_careers = scored_careers[:10]

    return {
        'skillScores': question_scores,
        'categoryScores': ranked_categories,
        'studentProfile': student_profile,
        'topDomains': [DOMAIN_DISPLAY_NAMES.get(domain, domain) for domain in top_domains],
        'primaryCareerPath': top_category,
        'topScore': top_score,
        'recommendedCareers': recommended_careers,
    }


def store_career_assessment(user_id: int, answers: Dict[str, Any], recommendations: Dict[str, Any]) -> Dict[str, Any]:
    timestamp = now_iso()
    payload_answers = {key: answers.get(key) for key in [f'q{i}' for i in range(1, 11)]}

    with get_db() as connection:
        row = connection.execute(
            'SELECT id FROM career_assessments WHERE user_id = ? ORDER BY id DESC LIMIT 1',
            (user_id,),
        ).fetchone()

        if row:
            assessment_id = int(row['id'])
            connection.execute(
                '''
                UPDATE career_assessments
                SET answers_json = ?, skill_scores_json = ?, category_scores_json = ?, recommendations_json = ?,
                    top_category = ?, top_score = ?, updated_at = ?
                WHERE id = ?
                ''',
                (
                    json_dumps(payload_answers),
                    json_dumps(recommendations['skillScores']),
                    json_dumps(recommendations['categoryScores']),
                    json_dumps(recommendations['recommendedCareers']),
                    recommendations['primaryCareerPath'],
                    int(recommendations['topScore']),
                    timestamp,
                    assessment_id,
                ),
            )
        else:
            cursor = connection.execute(
                '''
                INSERT INTO career_assessments (
                    user_id, answers_json, skill_scores_json, category_scores_json,
                    recommendations_json, top_category, top_score, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (
                    user_id,
                    json_dumps(payload_answers),
                    json_dumps(recommendations['skillScores']),
                    json_dumps(recommendations['categoryScores']),
                    json_dumps(recommendations['recommendedCareers']),
                    recommendations['primaryCareerPath'],
                    int(recommendations['topScore']),
                    timestamp,
                    timestamp,
                ),
            )
            assessment_id = int(cursor.lastrowid)

        # Auto-save recommended careers from this assessment to saved_careers table
        for career in recommendations.get('recommendedCareers', []):
            c_title = career.get('career')
            if not c_title:
                continue
            c_salary = career.get('salaryRange') or 'Suggested by assessment'
            c_match = f"{career.get('score', 100)}%"
            c_desc = career.get('description') or ''
            connection.execute(
                '''
                INSERT OR REPLACE INTO saved_careers (user_id, title, salary, match, description, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, c_title, c_salary, c_match, c_desc, 'assessment', timestamp)
            )

    return {'assessment_id': assessment_id, 'stored_at': timestamp}


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, OPTIONS'
    return response


@app.route('/', methods=['GET'])
def home():
    return jsonify(
        {
            'success': True,
            'message': 'Smart Career backend is running.',
            'database': {'type': 'sqlite', 'path': DB_PATH},
            'endpoints': {
                'register': '/api/auth/register',
                'login': '/api/auth/login',
                'profile_update': '/api/profile/update',
                'personal_details': '/api/personal-details',
                'profile': '/api/profile/<email>',
                'debug_storage': '/api/debug/storage',
            },
        }
    )


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'success': True, 'status': 'ok'})


@app.route('/api/career-colleges/<path:career_title>', methods=['GET'])
def get_career_colleges(career_title: str):
    state = request.args.get('state', '').strip()
    colleges = fetch_career_colleges(career_title, state or None)
    if state and not colleges:
        # When a specific state is requested but no colleges are found,
        # return an empty list with a user-friendly message.
        return jsonify({'success': True, 'career': career_title, 'state': state, 'colleges': [], 'message': f'No colleges available for {state}.'})

    return jsonify({'success': True, 'career': career_title, 'state': state or None, 'colleges': colleges})


@app.route('/api/career-colleges/<path:career_title>/states', methods=['GET'])
def get_career_available_states(career_title: str):
    states = fetch_available_career_states(career_title)
    return jsonify({'success': True, 'career': career_title, 'states': states})


@app.route('/api/careers/colleges', methods=['GET'])
def get_career_state_colleges():
    career_id = request.args.get('career_id', '').strip()
    state = request.args.get('state', '').strip()
    colleges = fetch_colleges_for_career_state(career_id, state)
    return jsonify({'success': True, 'career_id': career_id, 'state': state, 'colleges': colleges})


@app.route('/api/auth/register', methods=['POST'])
def register():
    data = get_request_data()
    full_name = (data.get('full_name') or '').strip()
    email = normalize_email(data.get('email'))
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''
    age = (data.get('age') or '').strip()
    gender = (data.get('gender') or '').strip().lower()

    errors: Dict[str, str] = {}
    if not full_name:
        errors['full_name'] = 'Full name is required.'
    if not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if len(password) < 6:
        errors['password'] = 'Password must be at least 6 characters long.'
    if password != confirm_password:
        errors['confirm_password'] = 'Passwords do not match.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    if get_user_by_email(email):
        return json_error('An account with this email already exists.', 409)

    timestamp = now_iso()
    with get_db() as connection:
        cursor = connection.execute(
            '''
            INSERT INTO users (full_name, email, password_hash, age, gender, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (full_name, email, generate_password_hash(password), age, gender, timestamp, timestamp),
        )
        user_id = cursor.lastrowid

    return jsonify(
        {
            'success': True,
            'message': 'Account created successfully.',
            'user': {
                'id': user_id,
                'full_name': full_name,
                'email': email,
                'age': age,
                'gender': gender,
            },
        }
    ), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = get_request_data()
    email = normalize_email(data.get('email'))
    password = data.get('password') or ''

    errors: Dict[str, str] = {}
    if not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if not password:
        errors['password'] = 'Password is required.'
    if errors:
        return json_error('Validation failed.', 400, errors)

    user = get_user_by_email(email)
    if not user or not check_password_hash(user['password_hash'], password):
        return json_error('Invalid email or password.', 401)

    return jsonify({'success': True, 'message': 'Login successful.', 'user': serialize_user(user)})


@app.route('/api/profile/update', methods=['POST', 'PUT', 'PATCH'])
def update_profile():
    data = get_request_data()
    user_id = resolve_user_id(data)
    full_name = (data.get('full_name') or '').strip()
    email = normalize_email(data.get('email'))
    age = (data.get('age') or '').strip()
    gender = (data.get('gender') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''

    errors: Dict[str, str] = {}
    if not user_id or not get_user_by_id(user_id):
        errors['user'] = 'Valid user_id or email is required.'
    if not full_name:
        errors['full_name'] = 'Full name is required.'
    if email and not validate_email(email):
        errors['email'] = 'A valid email is required.'
    if gender and gender not in GENDER_OPTIONS:
        errors['gender'] = 'Gender must be one of: male, female, other, prefer_not_to_say.'
    if password or confirm_password:
        if len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters long.'
        if password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    current_user = get_user_by_id(user_id)
    assert current_user is not None

    if email and email != current_user['email']:
        existing_user = get_user_by_email(email)
        if existing_user and int(existing_user['id']) != int(user_id):
            return json_error('An account with this email already exists.', 409)

    timestamp = now_iso()
    update_fields = ['full_name = ?', 'updated_at = ?']
    update_values = [full_name, timestamp]

    if email:
        update_fields.insert(1, 'email = ?')
        update_values.insert(1, email)

    if age != '':
        update_fields.append('age = ?')
        update_values.append(age)

    if gender:
        update_fields.append('gender = ?')
        update_values.append(gender)

    if password:
        update_fields.append('password_hash = ?')
        update_values.append(generate_password_hash(password))

    update_values.append(user_id)

    with get_db() as connection:
        connection.execute(
            f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?",
            update_values,
        )

    updated_user = get_user_by_id(user_id)
    return jsonify(
        {
            'success': True,
            'message': 'Profile updated successfully.',
            'user': serialize_user(updated_user) if updated_user else None,
        }
    )


@app.route('/api/personal-details', methods=['POST', 'PUT', 'PATCH'])
def save_personal_details():
    data = get_request_data()
    user_id = resolve_user_id(data)
    date_of_birth = (data.get('date_of_birth') or '').strip()
    gender = (data.get('gender') or '').strip().lower()
    phone_number = (data.get('phone_number') or '').strip()
    city = (data.get('city') or '').strip()

    errors: Dict[str, str] = {}
    if not user_id or not get_user_by_id(user_id):
        errors['user'] = 'Valid user_id or email is required.'
    if not date_of_birth:
        errors['date_of_birth'] = 'Date of birth is required.'
    if gender and gender not in GENDER_OPTIONS:
        errors['gender'] = 'Gender must be one of: male, female, other, prefer_not_to_say.'
    if not validate_phone(phone_number):
        errors['phone_number'] = 'Phone number must contain 7 to 15 digits and may start with +.'
    if not city:
        errors['city'] = 'City is required.'

    if errors:
        return json_error('Validation failed.', 400, errors)

    timestamp = now_iso()
    with get_db() as connection:
        existing = connection.execute(
            'SELECT id FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()
        if existing:
            connection.execute(
                '''
                UPDATE personal_details
                SET date_of_birth = ?, gender = ?, phone_number = ?, city = ?, updated_at = ?
                WHERE user_id = ?
                ''',
                (date_of_birth, gender, phone_number, city, timestamp, user_id),
            )
            action = 'updated'
        else:
            connection.execute(
                '''
                INSERT INTO personal_details (
                    user_id, date_of_birth, gender, phone_number, city, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, date_of_birth, gender, phone_number, city, timestamp, timestamp),
            )
            action = 'created'

    return jsonify(
        {
            'success': True,
            'message': f'Personal details {action} successfully.',
            'personal_details': {
                'user_id': user_id,
                'date_of_birth': date_of_birth,
                'gender': gender,
                'phone_number': phone_number,
                'city': city,
            },
        }
    )


@app.route('/api/career-assessment', methods=['POST'])
def submit_career_assessment():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)

    answers: Dict[str, Any] = {}
    validation_errors: Dict[str, str] = {}
    for index in range(1, 11):
        key = f'q{index}'
        normalized = normalize_answer(data.get(key))
        if not normalized:
            validation_errors[key] = 'Choose one of: Strongly Agree, Agree, Neutral, Disagree, Strongly Disagree.'
        else:
            answers[key] = normalized

    if validation_errors:
        return json_error('Validation failed.', 400, validation_errors)

    recommendations = recommend_careers(answers)
    storage = store_career_assessment(user_id, answers, recommendations)

    return jsonify(
        {
            'success': True,
            'message': 'Career assessment saved successfully.',
            'assessment': {
                'assessment_id': storage['assessment_id'],
                'user_id': user_id,
                'answers': answers,
                'studentProfile': recommendations['studentProfile'],
                'topDomains': recommendations['topDomains'],
                'primaryCareerPath': recommendations['primaryCareerPath'],
                'topScore': recommendations['topScore'],
                'recommendedCareers': recommendations['recommendedCareers'],
            },
        }
    ), 201


@app.route('/api/career-assessment/<int:user_id>', methods=['GET'])
def get_career_assessment(user_id: int):
    if not get_user_by_id(user_id):
        return json_error('User not found.', 404)

    with get_db() as connection:
        row = connection.execute(
            '''
            SELECT id, user_id, answers_json, skill_scores_json, category_scores_json,
                   recommendations_json, top_category, top_score, created_at, updated_at
            FROM career_assessments
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 1
            ''',
            (user_id,),
        ).fetchone()

    if not row:
        return json_error('Career assessment not found.', 404)

    assessment = dict(row)
    assessment['answers'] = json_loads(assessment.pop('answers_json'))
    assessment['skill_scores'] = json_loads(assessment.pop('skill_scores_json'))
    assessment['category_scores'] = json_loads(assessment.pop('category_scores_json'))
    assessment['recommended_careers'] = json_loads(assessment.pop('recommendations_json'))
    assessment['studentProfile'] = ' + '.join([assessment.get('top_category', 'Career Discovery')])
    assessment['topDomains'] = [assessment.get('top_category', 'Career Discovery')]

    return jsonify({'success': True, 'assessment': assessment})


@app.route('/api/profile/<email>', methods=['GET'])
def get_profile(email: str):
    normalized_email = normalize_email(email)
    if not validate_email(normalized_email):
        return json_error('A valid email is required.', 400)

    user = get_user_by_email(normalized_email)
    if not user:
        return json_error('User not found.', 404)

    user_id = int(user['id'])
    with get_db() as connection:
        personal_details = connection.execute(
            'SELECT date_of_birth, gender, phone_number, city, created_at, updated_at FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()

    return jsonify(
        {
            'success': True,
            'user': serialize_user(user),
            'personal_details': dict(personal_details) if personal_details else None,
        }
    )


@app.route('/api/debug/storage', methods=['GET'])
def debug_storage():
    email = normalize_email(request.args.get('email'))
    user_id_value = request.args.get('user_id')
    user_id: Optional[int] = None

    if user_id_value:
        try:
            user_id = int(user_id_value)
        except (TypeError, ValueError):
            return json_error('user_id must be an integer.', 400)
    elif email:
        user = get_user_by_email(email)
        if user:
            user_id = int(user['id'])
    else:
        return json_error('Provide either email or user_id.', 400)

    if not user_id:
        return json_error('User not found.', 404)

    with get_db() as connection:
        user_row = connection.execute(
            'SELECT id, full_name, email, age, gender, created_at, updated_at FROM users WHERE id = ?',
            (user_id,),
        ).fetchone()
        personal_row = connection.execute(
            'SELECT * FROM personal_details WHERE user_id = ?',
            (user_id,),
        ).fetchone()

    return jsonify(
        {
            'success': True,
            'database': 'sqlite',
            'user': dict(user_row) if user_row else None,
            'personal_details': dict(personal_row) if personal_row else None,
            'stored': {
                'user': bool(user_row),
                'personal_details': bool(personal_row),
            },
        }
    )


@app.route('/api/saved-careers', methods=['POST'])
def add_saved_careers():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)
    
    careers = data.get('careers')
    if careers is None:
        title = (data.get('title') or '').strip()
        if not title:
            return json_error('Career title is required.', 400)
        careers = [{
            'title': title,
            'salary': data.get('salary', ''),
            'match': data.get('match', ''),
            'description': data.get('description', ''),
            'source': data.get('source', '')
        }]
    elif not isinstance(careers, list):
        return json_error('careers must be a list.', 400)
        
    timestamp = now_iso()
    with get_db() as connection:
        for career in careers:
            title = (career.get('title') or '').strip()
            if not title:
                continue
            salary = (career.get('salary') or '').strip()
            match = (career.get('match') or '').strip()
            description = (career.get('description') or '').strip()
            source = (career.get('source') or '').strip()
            connection.execute(
                '''
                INSERT OR REPLACE INTO saved_careers (user_id, title, salary, match, description, source, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''',
                (user_id, title, salary, match, description, source, timestamp)
            )
            
    return jsonify({'success': True, 'message': 'Careers saved successfully.'}), 201


@app.route('/api/saved-careers/<int:user_id>', methods=['GET'])
def get_user_saved_careers(user_id: int):
    if not get_user_by_id(user_id):
        return json_error('User not found.', 404)
        
    with get_db() as connection:
        rows = connection.execute(
            '''
            SELECT title, salary, match, description, source, created_at
            FROM saved_careers
            WHERE user_id = ?
            ORDER BY id DESC
            ''',
            (user_id,)
        ).fetchall()
        
    saved_careers = [dict(row) for row in rows]
    return jsonify({'success': True, 'saved_careers': saved_careers})


@app.route('/api/saved-careers/delete', methods=['POST', 'DELETE'])
def delete_saved_career():
    data = get_request_data()
    user_id = resolve_user_id(data)
    if not user_id:
        user_id_val = request.args.get('user_id')
        if user_id_val:
            try:
                user_id = int(user_id_val)
            except ValueError:
                pass
                
    if not user_id or not get_user_by_id(user_id):
        return json_error('Valid user_id or email is required.', 400)
        
    title = data.get('title') or request.args.get('title')
    if not title:
        return json_error('Career title is required.', 400)
        
    with get_db() as connection:
        connection.execute(
            'DELETE FROM saved_careers WHERE user_id = ? AND title = ?',
            (user_id, title)
        )
    return jsonify({'success': True, 'message': 'Saved career deleted successfully.'})


@app.errorhandler(404)
def not_found(_error):
    return json_error('Route not found.', 404)


@app.errorhandler(500)
def server_error(_error):
    return json_error('Internal server error.', 500)


if __name__ == '__main__':
    ensure_database()
    ensure_career_colleges_seeded()
    app.run(host='0.0.0.0', port=5001, debug=False)
