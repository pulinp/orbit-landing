import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MarkdownPageProps {
  title: string;
  filePath: string;
}

export default function MarkdownPage({ title, filePath }: MarkdownPageProps) {
  const navigate = useNavigate();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch(filePath);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to load markdown:", error);
        setContent("# Content Coming Soon\n\nThis page content will be added soon.");
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filePath]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff", paddingTop: "4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "none",
            color: "#1ab394",
            cursor: "pointer",
            fontSize: "1rem",
            marginBottom: "2rem",
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#121317" }}>
          {title}
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div
            style={{
              color: "#45474d",
              lineHeight: 1.8,
              fontSize: "1.05rem",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </div>
  );
}
