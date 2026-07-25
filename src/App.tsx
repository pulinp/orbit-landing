import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import MarkdownPage from "./pages/MarkdownPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import LabPage from "./pages/LabPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
        <Route path="/case-study" element={<Navigate to="/case-studies" replace />} />
        <Route path="/lab" element={<LabPage />} />
        <Route path="/privacy" element={<MarkdownPage title="Privacy Policy" filePath="/privacy.md" />} />
        <Route path="/terms" element={<MarkdownPage title="Terms of Service" filePath="/terms.md" />} />
      </Routes>
    </Router>
  );
}

export default App;
