import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRepurpose = async () => {
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("http://localhost:8000/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          actions: ["summary","flashcards","quiz","linkedin","translate:hi"]
        }) 
      });
      const data = await resp.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ error: "Failed to connect" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>AI Content Repurposer</h1>
      <textarea
        rows="10"
        placeholder="Paste lecture/article here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleRepurpose} disabled={loading || !text}>
        {loading ? "Processing..." : "Repurpose"}
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h2>Results</h2>
          {result.summary && <p><b>Summary:</b> {result.summary}</p>}
          {result.flashcards && (
            <div>
              <h3>Flashcards</h3>
              <ul>
                {result.flashcards.map((f, i) => (
                  <li key={i}>Q: {f.q} <br /> A: {f.a}</li>
                ))}
              </ul>
            </div>
          )}
          {result.quiz && (
            <div>
              <h3>Quiz</h3>
              {result.quiz.map((q, i) => (
                <div key={i}>
                  <p><b>{q.question}</b></p>
                  <ul>
                    {q.options.map((o, idx) => <li key={idx}>{o}</li>)}
                  </ul>
                  <p>Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          )}
          {result.linkedin && (
            <div>
              <h3>LinkedIn Post</h3>
              <p>{result.linkedin}</p>
            </div>
          )}
          {result.translations && (
            <div>
              <h3>Translations</h3>
              {Object.entries(result.translations).map(([lang, text]) => (
                <p key={lang}><b>{lang}:</b> {text}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
