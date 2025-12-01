import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import "./index.css";

export default function Index() {
  return (
    <div className="index-page">
      <main>
        <section>
          <div>
            <span>AgroVision • AI for Smarter Farming</span>
            <h1>AI-Driven Crop Guidance & Plant Disease Diagnosis</h1>
            <p>Get crop recommendations tailored to your soil and climate, detect plant diseases from photos, and chat with an agricultural assistant — all in one dashboard.</p>
            <div>
              <Button asChild className="get-started-button">
                <Link to="/signup">Get started — Sign up</Link>
              </Button>
              <Button asChild variant="outline" className="get-started-button">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
          </div>
          <div>
            <div></div>
            <div>
              <div>
                <img src="/assets/croprecommendation.png" alt="Crop Recommendation" className="feature-img" />
                <p>Crop Recommendation</p>
                <p>Enter N-P-K, pH, rainfall</p>
              </div>
              <div>
                <img src="/assets/diseasedetection.png" alt="Disease Detection" className="feature-img" />
                <p>Disease Detection</p>
                <p>Upload leaf photo</p>
              </div>
              <div>
                <img src="/assets/ai.png" alt="AI Chat Assistant" className="feature-img" />
                <p>AI Chat Assistant</p>
                <p>Ask anything about crops and practices</p>
              </div>
            </div>
          </div>
        </section>
        </main>
        <br /><br />
        <section className="azure">
          <div>
            <h3>Soil-aware</h3>
            <p>Use N-P-K, pH, rainfall and temperature for better crop choices.</p>
          </div>
          <div>
            <h3>Vision-powered</h3>
            <p>Detect diseases from images and get treatment guidance.</p>
          </div>
          <div>
            <h3>Chat support</h3>
            <p>Ask agronomy questions in natural language, 24/7.</p>
          </div>
          <div>
            <h3>Made for scale</h3>
            <p>Built with modern web tech for speed and reliability.</p>
          </div>
        </section>
        <footer>
          &copy; {new Date().getFullYear()} AgroVision. All rights reserved.
        </footer>
    </div>
  );
}
