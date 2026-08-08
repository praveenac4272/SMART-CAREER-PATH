import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCareerAssessment } from '../services/api';
import { getAuthSession } from '../services/authSession';

const questions = [
	{ id: 'q1', text: 'I enjoy solving logical problems, analyzing information, and finding solutions to challenging situations.' },
	{ id: 'q2', text: 'I like helping people, understanding their needs, and making a positive impact on their lives.' },
	{ id: 'q3', text: 'I enjoy leading teams, organizing activities, and making important decisions.' },
	{ id: 'q4', text: 'I am interested in understanding laws, rules, policies, and how society is governed.' },
	{ id: 'q5', text: 'I enjoy expressing my ideas through creativity, design, art, or visual storytelling.' },
	{ id: 'q6', text: 'I enjoy creating content, sharing ideas, and engaging with audiences through digital platforms.' },
	{ id: 'q7', text: 'I am passionate about performing arts such as music, dance, acting, or public performances.' },
	{ id: 'q8', text: 'I enjoy strategic thinking, competition, gaming, and exploring new technologies or innovations.' },
	{ id: 'q9', text: 'I am interested in working with nature, agriculture, transportation systems, or large-scale operations.' },
	{ id: 'q10', text: 'I prefer creating my own opportunities, taking initiative, and building something independently.' },
];

const options = [
	{ label: 'Strongly Agree', value: 'Strongly Agree' },
	{ label: 'Agree', value: 'Agree' },
	{ label: 'Neutral', value: 'Neutral' },
	{ label: 'Disagree', value: 'Disagree' },
	{ label: 'Strongly Disagree', value: 'Strongly Disagree' },
];

export default function Assessment() {
	const navigate = useNavigate();
	const [index, setIndex] = useState(0);
	const [answers, setAnswers] = useState(Array(questions.length).fill(null));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const answerLabels = options.map((option) => option.value);

	function handleSelect(optionIdx) {
		const next = [...answers];
		next[index] = optionIdx;
		setAnswers(next);
	}

	async function handleNext() {
		if (index < questions.length - 1) {
			setIndex(index + 1);
		} else {
			const session = getAuthSession();
			const questionPayload = answers.reduce((accumulator, answerIndex, questionIndex) => {
				accumulator[questions[questionIndex].id] = answerLabels[answerIndex] || '';
				return accumulator;
			}, {});

			if (!session.userId && !session.email) {
				setError('Please log in again before submitting the assessment.');
				return;
			}

			setError('');
			setIsSubmitting(true);

			try {
				const response = await submitCareerAssessment({
					user_id: session.userId,
					email: session.email,
					...questionPayload,
				});
				const assessment = response?.assessment || response;

				if (!assessment) {
					throw new Error('Assessment saved, but no recommendation data was returned.');
				}

				const newAttemptCount = Number(localStorage.getItem('assessmentAttempts') || '0') + 1;
				localStorage.setItem('assessmentAttempts', String(newAttemptCount));
				localStorage.setItem('assessmentAnswers', JSON.stringify({ answers }));
				localStorage.setItem('careerAssessmentResult', JSON.stringify(assessment));
				navigate('/recommendation', { state: { assessment, answers } });
			} catch (e) {
				setError(e.message || 'Failed to save assessment');
			} finally {
				setIsSubmitting(false);
			}
		}
	}

	function handleBack() {
		if (index > 0) setIndex(index - 1);
		else navigate(-1);
	}

	const selected = answers[index];

	return (
		<div style={{ padding: 0, fontFamily: "sans-serif" }}>
			<header style={{ background: "linear-gradient(90deg,#4b6bf6,#8a3fe8)", color: "white", padding: "14px 12px", display: "flex", alignItems: "center" }}>
				<button aria-label="back" onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", fontSize: 20, marginRight: 12 }}>&larr;</button>
				<h2 style={{ margin: 0 }}>Career Assessment</h2>
			</header>

			<main style={{ padding: 16 }}>
				<div style={{ color: "#6b21a8", marginBottom: 8 }}>Question {index + 1} of {questions.length}</div>

				<div style={{ height: 8, background: "#e6e6e6", borderRadius: 8, marginBottom: 18 }}>
					<div style={{ width: `${((index + 1) / questions.length) * 100}%`, height: 8, background: "#7b2cbf", borderRadius: 8 }} />
				</div>

				<div style={{ background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 6px 18px rgba(0,0,0,0.06)", marginBottom: 18 }}>
					<h3 style={{ margin: 0 }}>{questions[index].text}</h3>
				</div>

				{error ? (
					<p style={{ color: '#b91c1c', marginTop: 0, marginBottom: 12 }}>{error}</p>
				) : null}

				<div>
					{options.map((opt, i) => {
						const isSelected = selected === i;
						return (
							<button key={i} onClick={() => handleSelect(i)} style={{
								display: "block",
								width: "100%",
								textAlign: "left",
								padding: "18px",
								marginBottom: 12,
								borderRadius: 10,
								border: isSelected ? "2px solid #7b2cbf" : "1px solid #ddd",
								background: isSelected ? "#f6eefc" : "white",
								cursor: "pointer"
							}}>{opt.label}</button>
						);
					})}
				</div>

				<div style={{ display: "flex", gap: 12, marginTop: 20 }}>
					<button onClick={handleBack} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "1px solid #ccc", background: "white" }}>
						{index > 0 ? "Back" : "Cancel"}
					</button>

					<button onClick={handleNext} disabled={selected === null || isSubmitting} style={{ flex: 1, padding: "14px", borderRadius: 12, background: selected === null || isSubmitting ? "#ddd" : "#7b2cbf", color: "white", border: "none" }}>
						{isSubmitting ? 'Saving...' : index < questions.length - 1 ? "Next Question" : "Finish"}
					</button>
				</div>
			</main>
		</div>
	);
}

