import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import app, ensure_database, recommend_careers, normalize_answer_score


class CollegeDataAPITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        ensure_database()

    def test_career_colleges_endpoint_returns_seeded_data(self):
        response = self.client.get('/api/career-colleges/Software%20Engineer')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['colleges'])
        self.assertIn('state', payload)

    def test_state_filter_returns_matching_colleges(self):
        response = self.client.get('/api/career-colleges/Software%20Engineer?state=Karnataka')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['colleges'])
        self.assertTrue(all(college['state'] == 'Karnataka' for college in payload['colleges']))

    def test_career_colleges_without_state_returns_all_colleges_for_career(self):
        response = self.client.get('/api/career-colleges/Software%20Engineer')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['colleges'])
        self.assertIsNone(payload['state'])

    def test_unknown_state_returns_empty_result_message(self):
        response = self.client.get('/api/career-colleges/Software%20Engineer?state=Atlantis')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertEqual(payload['colleges'], [])
        self.assertIn('No colleges available', payload['message'])

    def test_other_career_has_seeded_colleges(self):
        response = self.client.get('/api/career-colleges/Doctor%20(MBBS)')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['colleges'])
        self.assertIn('state', payload)

    def test_missing_career_from_frontend_pages_has_seeded_colleges(self):
        response = self.client.get('/api/career-colleges/AI/ML%20Engineer')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['colleges'])
        self.assertIn('state', payload)

    def test_state_aliases_and_fallback_colleges_are_returned(self):
        response = self.client.get('/api/career-colleges/Doctor?state=Delhi')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertGreaterEqual(len(payload['colleges']), 5)
        self.assertTrue(all('annual_fee' in college for college in payload['colleges']))
        self.assertTrue(all('speciality' in college for college in payload['colleges']))

    def test_missing_career_gets_multiple_colleges_and_states(self):
        response = self.client.get('/api/career-colleges/Full%20Stack%20Developer')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertGreaterEqual(len(payload['colleges']), 5)
        self.assertIn('state', payload)

    def test_available_states_endpoint_returns_only_states_with_colleges(self):
        response = self.client.get('/api/career-colleges/Software%20Engineer/states')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(payload['states'])
        self.assertIn('Karnataka', payload['states'])
        self.assertNotIn('Arunachal Pradesh', payload['states'])

    def test_career_state_college_endpoint_filters_by_career_and_state(self):
        response = self.client.get('/api/careers/colleges?career_id=Software Engineer&state=Karnataka')

        self.assertEqual(response.status_code, 200)
        payload = response.get_json()
        self.assertTrue(payload['success'])
        self.assertTrue(isinstance(payload['colleges'], list))
        self.assertGreaterEqual(len(payload['colleges']), 1)
        self.assertTrue(all(item.get('college_name') for item in payload['colleges']))
        self.assertTrue(all(item.get('speciality') for item in payload['colleges']))

    def test_answer_scores_distinguish_disagree_from_strongly_disagree(self):
        self.assertEqual(normalize_answer_score('strongly agree'), 5)
        self.assertEqual(normalize_answer_score('agree'), 4)
        self.assertEqual(normalize_answer_score('neutral'), 3)
        self.assertEqual(normalize_answer_score('disagree'), 2)
        self.assertEqual(normalize_answer_score('strongly disagree'), 1)

    def test_performing_arts_response_prioritizes_music_and_acting_careers(self):
        answers = {
            'q1': 'strongly disagree',
            'q2': 'strongly disagree',
            'q3': 'strongly disagree',
            'q4': 'strongly disagree',
            'q5': 'strongly disagree',
            'q6': 'strongly disagree',
            'q7': 'strongly agree',
            'q8': 'strongly disagree',
            'q9': 'strongly disagree',
            'q10': 'strongly disagree',
        }

        result = recommend_careers(answers)
        recommended_names = [career['career'] for career in result['recommendedCareers']]
        performing_careers = {
            'Playback Singer', 'Music Producer', 'Music Composer', 'DJ / Music Artist', 'Music Teacher', 'Sound Engineer',
            'Film Actor', 'Theater Artist', 'Voice Actor', 'TV Serial Actor', 'Stand-up Comedian'
        }
        self.assertTrue(any(name in performing_careers for name in recommended_names[:5]))
        self.assertNotIn('Software Engineer', recommended_names[:3])


if __name__ == '__main__':
    unittest.main()
