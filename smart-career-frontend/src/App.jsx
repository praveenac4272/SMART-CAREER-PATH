import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import IntroScreenOne from "./pages/IntroScreenOne";
import IntroScreenTwo from "./pages/IntroScreenTwo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PersonalDetails from "./pages/PersonalDetails";
import ExploreDomains from "./pages/ExploreDomains";
import NonTraditionalDomains from "./pages/NonTraditionalDomains";
import TraditionalDomains from "./pages/TraditionalDomains";
import Dashboard from "./pages/Dashboard";
import SavedCareers from "./pages/SavedCareers";
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";
import Notifications from "./pages/Notifications";
import HelpSupport from "./pages/HelpSupport";
import ForgotPassword from "./pages/ForgotPassword";
import CareerRecommendation from "./pages/CareerRecommendation";
import Assessment from "./pages/Assessment";
import CareerDetail from "./pages/CareerDetail";
import Healthcare from "./pages/Healthcare";
import IT from "./pages/IT";
import Business from "./pages/Business";
import Govt from "./pages/Govt";
import Aviation from "./pages/Aviation";
import Agriculture from "./pages/Agriculture";
import Law from "./pages/Law";
import ActingEntertainment from "./pages/ActingEntertainment";
import FashionModeling from "./pages/FashionModeling";
import MusicCareers from "./pages/MusicCareers";
import DanceCareers from "./pages/DanceCareers";
import ArtsCreativity from "./pages/ArtsCreativity";
import GamingEsports from "./pages/GamingEsports";
import InfluencerContent from "./pages/InfluencerContent";
import Entrepreneurship from "./pages/Entrepreneurship";
import AnimeAnimation from "./pages/AnimeAnimation";
import CareerProgressChecklist from "./pages/CareerProgressChecklist";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/intro-1" element={<IntroScreenOne />} />
        <Route path="/intro-2" element={<IntroScreenTwo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/explore" element={<ExploreDomains />} />
        <Route path="/traditional-domains" element={<TraditionalDomains />} />
        <Route path="/non-traditional-domains" element={<NonTraditionalDomains />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/saved-careers" element={<SavedCareers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-info" element={<ProfileInfo />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/recommendation" element={<CareerRecommendation />} />
        <Route path="/career-detail" element={<CareerDetail />} />
        <Route path="/career-progress-checklist" element={<CareerProgressChecklist />} />
        <Route path="/domain/healthcare" element={<Healthcare />} />
        <Route path="/domain/it" element={<IT />} />
        <Route path="/domain/business" element={<Business />} />
        <Route path="/domain/govt" element={<Govt />} />
        <Route path="/domain/aviation" element={<Aviation />} />
        <Route path="/domain/agriculture" element={<Agriculture />} />
        <Route path="/domain/law" element={<Law />} />
        <Route path="/domain/acting-entertainment" element={<ActingEntertainment />} />
        <Route path="/domain/fashion-modeling" element={<FashionModeling />} />
        <Route path="/domain/music" element={<MusicCareers />} />
        <Route path="/domain/dance" element={<DanceCareers />} />
        <Route path="/domain/arts-creativity" element={<ArtsCreativity />} />
        <Route path="/domain/gaming-esports" element={<GamingEsports />} />
        <Route path="/domain/influencer-content" element={<InfluencerContent />} />
        <Route path="/domain/entrepreneurship" element={<Entrepreneurship />} />
        <Route path="/domain/anime-animation" element={<AnimeAnimation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;