import chatGptLogo from "../assets/logos/ChatGPT-Logo.png";
import claudeLogo from "../assets/logos/Claude_AI_symbol.svg";
import geminiLogo from "../assets/logos/Google_Gemini_icon_2025.svg.png";
import grokLogo from "../assets/logos/grok--v2.jpg";

export default function LlmLogos() {
    return (
        <div className="lp-llm-logos">
            <div className="lp-llm-logo">
                <img src={chatGptLogo} alt="ChatGPT" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="lp-llm-logo">
                <img src={claudeLogo} alt="Claude" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff' }} />
            </div>
            <div className="lp-llm-logo">
                <img src={geminiLogo} alt="Gemini" style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#fff' }} />
            </div>
            <div className="lp-llm-logo">
                <img src={grokLogo} alt="Grok" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        </div>
    );
}
