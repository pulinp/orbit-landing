import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import MarkdownPage from "./pages/MarkdownPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/case-study" element={<MarkdownPage title="Case Study" filePath="/case-study.md" />} />
        <Route path="/privacy" element={<MarkdownPage title="Privacy Policy" filePath="/privacy.md" />} />
        <Route path="/terms" element={<MarkdownPage title="Terms of Service" filePath="/terms.md" />} />
      </Routes>
    </Router>
  );
}

export default App;
