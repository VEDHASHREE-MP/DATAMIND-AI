import { useState, useRef, useEffect } from "react";

// ⚠️ PASTE YOUR GROQ API KEY BELOW (keep the quotes)
const GROQ_API_KEY = " YOUR_GROQ_API_KEY";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --coral: #FF4D6D;
    --orange: #FF8C42;
    --yellow: #FFD166;
    --teal: #06D6A0;
    --purple: #7B2FBE;
    --navy: #0D0D1A;
    --card: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.1);
    --text: #F0EEF6;
    --muted: rgba(240,238,246,0.5);
  }

  body { background: var(--navy); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .app {
    min-height: 100vh;
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }

  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: drift 12s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .blob-1 { width: 500px; height: 500px; background: var(--coral); top: -150px; left: -100px; animation-delay: 0s; }
  .blob-2 { width: 400px; height: 400px; background: var(--teal); bottom: -100px; right: -80px; animation-delay: -4s; }
  .blob-3 { width: 300px; height: 300px; background: var(--purple); top: 40%; left: 50%; animation-delay: -8s; }

  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(40px, 30px) scale(1.08); }
  }

  .content { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 40px 24px 60px; }

  .header { text-align: center; margin-bottom: 44px; }
  .badge {
    display: inline-block;
    background: linear-gradient(135deg, var(--coral), var(--orange));
    color: white;
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 18px;
  }
  .title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(38px, 7vw, 64px);
    font-weight: 800;
    line-height: 1.05;
    background: linear-gradient(135deg, #fff 0%, var(--yellow) 50%, var(--coral) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 14px;
  }
  .subtitle { color: var(--muted); font-size: 17px; font-weight: 300; max-width: 480px; margin: 0 auto; line-height: 1.6; }

  .tabs {
    display: flex;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 6px;
    margin-bottom: 28px;
  }
  .tab {
    flex: 1;
    padding: 12px 16px;
    border: none;
    border-radius: 11px;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    background: transparent;
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .tab.active { color: white; box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
  .tab-chat.active { background: linear-gradient(135deg, var(--coral), var(--orange)); }
  .tab-summarize.active { background: linear-gradient(135deg, var(--teal), #0A9B73); }
  .tab-translate.active { background: linear-gradient(135deg, var(--purple), #5B1F9C); }
  .tab:hover:not(.active) { background: rgba(255,255,255,0.07); color: var(--text); }

  .panel {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 32px;
    backdrop-filter: blur(20px);
  }

  .chat-messages {
    min-height: 320px;
    max-height: 420px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 20px;
    padding-right: 4px;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg { display: flex; gap: 12px; animation: fadeUp 0.3s ease; }
  .msg.user { flex-direction: row-reverse; }
  @keyframes fadeUp { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform:none; } }

  .avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
  }
  .avatar-ai { background: linear-gradient(135deg, var(--coral), var(--orange)); }
  .avatar-user { background: linear-gradient(135deg, var(--purple), #5B1F9C); }

  .bubble {
    max-width: 75%;
    padding: 12px 18px;
    border-radius: 18px;
    font-size: 15px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .bubble-ai { background: rgba(255,255,255,0.07); border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .bubble-user { background: linear-gradient(135deg, var(--coral), var(--orange)); color: white; border-bottom-right-radius: 4px; }

  .empty-chat {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: var(--muted); gap: 10px; font-size: 15px; min-height: 280px;
  }
  .empty-icon { font-size: 44px; opacity: 0.5; }

  .input-row { display: flex; gap: 10px; align-items: flex-end; }
  .input-box {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 18px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    min-height: 52px;
    max-height: 140px;
  }
  .input-box::placeholder { color: var(--muted); }
  .input-box:focus { border-color: var(--coral); }

  .send-btn {
    width: 52px; height: 52px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    color: white;
  }
  .btn-coral { background: linear-gradient(135deg, var(--coral), var(--orange)); }
  .btn-teal { background: linear-gradient(135deg, var(--teal), #0A9B73); }
  .btn-purple { background: linear-gradient(135deg, var(--purple), #5B1F9C); }
  .send-btn:hover { transform: scale(1.07); }
  .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .text-area {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    min-height: 160px;
    line-height: 1.7;
  }
  .text-area::placeholder { color: var(--muted); }
  .text-area:focus { border-color: var(--teal); }
  .text-area.purple:focus { border-color: var(--purple); }

  .action-row { display: flex; gap: 12px; align-items: center; margin: 18px 0; }
  .action-btn {
    padding: 13px 28px;
    border-radius: 12px;
    border: none;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    color: white;
  }
  .action-btn:hover { transform: translateY(-2px); }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .result-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    font-size: 15px;
    line-height: 1.8;
    color: var(--text);
    min-height: 120px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .lang-grid { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
  .lang-btn {
    padding: 8px 16px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .lang-btn.selected { background: linear-gradient(135deg, var(--purple), #5B1F9C); border-color: transparent; color: white; }
  .lang-btn:hover:not(.selected) { border-color: var(--purple); color: var(--text); }

  .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .char-count { font-size: 12px; color: var(--muted); margin-left: auto; }

  .error-banner {
    background: rgba(255,77,109,0.15);
    border: 1px solid rgba(255,77,109,0.4);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 13px;
    color: #FF4D6D;
    margin-bottom: 16px;
  }
`;

const LANGUAGES = ["French", "Spanish", "German", "Japanese", "Arabic", "Hindi", "Portuguese", "Chinese"];

// ─── Groq API Call ────────────────────────────────────────────────────────────
async function callGroq(messages, systemPrompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response received.";
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────
function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    setError("");
    const userMsg = { role: "user", content: input.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const reply = await callGroq(
        history,
        "You are a helpful, friendly AI assistant specializing in data prediction and forecasting. Provide insightful, clear responses. Keep answers concise but thorough."
      );
      setMessages([...history, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(e.message || "Something went wrong. Check your API key.");
      setMessages(history);
    }
    setLoading(false);
  };

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {error && <div className="error-banner">⚠️ {error}</div>}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-icon">💬</div>
            <div>Ask me anything about data, trends, or forecasting!</div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
              <div className={`avatar ${m.role === "user" ? "avatar-user" : "avatar-ai"}`}>
                {m.role === "user" ? "🧑" : "✨"}
              </div>
              <div className={`bubble ${m.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="msg">
            <div className="avatar avatar-ai">✨</div>
            <div className="bubble bubble-ai" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="spinner" /> Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="input-row">
        <textarea
          className="input-box"
          rows={1}
          placeholder="Ask about predictions, trends, data insights…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="send-btn btn-coral" onClick={send} disabled={loading || !input.trim()}>
          {loading ? <div className="spinner" /> : "➤"}
        </button>
      </div>
    </>
  );
}

// ─── Summarize Tab ────────────────────────────────────────────────────────────
function SummarizeTab() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summarize = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const reply = await callGroq(
        [{ role: "user", content: `Please summarize the following text clearly and concisely:\n\n${text}` }],
        "You are an expert at summarizing complex texts, reports, and data into clear, concise bullet-point summaries. Always structure your summaries with key points."
      );
      setResult(reply);
    } catch (e) {
      setError(e.message || "Error summarizing. Check your API key.");
    }
    setLoading(false);
  };

  return (
    <>
      {error && <div className="error-banner">⚠️ {error}</div>}
      <div className="section-label">Paste your text</div>
      <textarea
        className="text-area"
        placeholder="Paste an article, report, dataset description, or any long text here…"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="action-row">
        <button
          className="action-btn"
          style={{ background: "linear-gradient(135deg,#06D6A0,#0A9B73)" }}
          onClick={summarize}
          disabled={loading || !text.trim()}
        >
          {loading ? "Summarizing…" : "✦ Summarize"}
        </button>
        {text && <span className="char-count">{text.length} chars</span>}
      </div>
      {(result || loading) && (
        <>
          <div className="section-label">Summary</div>
          <div className="result-box">
            {loading
              ? <span style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: 10 }}><span className="spinner" /> Generating summary…</span>
              : result}
          </div>
        </>
      )}
    </>
  );
}

// ─── Translate Tab ────────────────────────────────────────────────────────────
function TranslateTab() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("French");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const translate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const reply = await callGroq(
        [{ role: "user", content: `Translate the following text to ${lang}:\n\n${text}` }],
        `You are a professional translator. Translate the given text naturally and accurately to ${lang}. Return only the translated text, nothing else.`
      );
      setResult(reply);
    } catch (e) {
      setError(e.message || "Translation error. Check your API key.");
    }
    setLoading(false);
  };

  return (
    <>
      {error && <div className="error-banner">⚠️ {error}</div>}
      <div className="section-label">Translate to</div>
      <div className="lang-grid">
        {LANGUAGES.map(l => (
          <button key={l} className={`lang-btn ${lang === l ? "selected" : ""}`} onClick={() => setLang(l)}>{l}</button>
        ))}
      </div>
      <div className="section-label">Your text</div>
      <textarea
        className="text-area purple"
        placeholder="Enter text to translate…"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <div className="action-row">
        <button
          className="action-btn"
          style={{ background: "linear-gradient(135deg,#7B2FBE,#5B1F9C)" }}
          onClick={translate}
          disabled={loading || !text.trim()}
        >
          {loading ? "Translating…" : `✦ Translate to ${lang}`}
        </button>
        {text && <span className="char-count">{text.length} chars</span>}
      </div>
      {(result || loading) && (
        <>
          <div className="section-label">Translation</div>
          <div className="result-box">
            {loading
              ? <span style={{ color: "var(--muted)", display: "flex", alignItems: "center", gap: 10 }}><span className="spinner" /> Translating…</span>
              : result}
          </div>
        </>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("chat");

  const apiMissing = GROQ_API_KEY === "YOUR_GROQ_API_KEY_HERE";

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div className="content">
          <div className="header">
            <div className="badge">⚡ Powered by Llama 3.3</div>
            <h1 className="title">DataMind AI</h1>
            <p className="subtitle">Chat, summarize, and translate with intelligent AI — built for data-driven insights.</p>
          </div>

          {apiMissing && (
            <div className="error-banner" style={{ marginBottom: 20, textAlign: "center" }}>
              ⚠️ API key not set! Open <strong>App.jsx</strong> and replace <code>YOUR_GROQ_API_KEY_HERE</code> with your real Groq API key.
            </div>
          )}

          <div className="tabs">
            <button className={`tab tab-chat ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
              💬 Chat
            </button>
            <button className={`tab tab-summarize ${tab === "summarize" ? "active" : ""}`} onClick={() => setTab("summarize")}>
              ✦ Summarize
            </button>
            <button className={`tab tab-translate ${tab === "translate" ? "active" : ""}`} onClick={() => setTab("translate")}>
              🌐 Translate
            </button>
          </div>

          <div className="panel">
            {tab === "chat" && <ChatTab />}
            {tab === "summarize" && <SummarizeTab />}
            {tab === "translate" && <TranslateTab />}
          </div>
        </div>
      </div>
    </>
  );
}