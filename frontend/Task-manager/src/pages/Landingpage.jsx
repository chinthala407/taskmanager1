import Navbar from "../components/Intro/Navbar";
import Hero from "../components/Intro/Hero";
import Features from "../components/Intro/Features";
import HowItWorks from "../components/Intro/HowItWorks";
import CTA from "../components/Intro/CTA";
import Footer from "../components/Intro/Footer";

import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-container">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;