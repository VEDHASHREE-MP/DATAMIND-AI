# 🧠 DataMind AI

An AI-powered web application built with **React + Vite**, connected to **Groq's free Llama 3.3 70B model**. It offers three intelligent features — Chat, Summarize, and Translate — all in a bold, vibrant UI.

---

## 🚀 Live Demo

> Run locally at `http://localhost:5173` after setup.

---

## ✨ Features

| Tab | Description |
|---|---|
| 💬 **Chat** | Conversational AI for data prediction & forecasting queries |
| ✦ **Summarize** | Paste any long text and get a clean bullet-point summary |
| 🌐 **Translate** | Translate text into 8 languages instantly |

**Supported languages:** French, Spanish, German, Japanese, Arabic, Hindi, Portuguese, Chinese

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **AI Model:** Llama 3.3 70B (via Groq API)
- **Styling:** Custom CSS with gradient animations
- **API:** Groq (Free tier)

---

## ⚙️ How It Works

```
User Input (React Frontend)
        ↓
Groq API (bridge)
        ↓
Llama 3.3 70B (AI brain by Meta)
        ↓
Response displayed on screen
```

The same Groq API powers all 3 features — just with different system prompts:
- **Chat** → conversational assistant for data insights
- **Summarize** → expert summarizer returning bullet points
- **Translate** → professional translator returning only translated text

---

## 🔧 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/datamind-ai.git
cd datamind-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Groq API key

Open `src/App.jsx` and replace line 4:
```js
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
```
Get your **free** API key at 👉 https://console.groq.com/keys

### 4. Run the app
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📦 Project Structure

```
datamind-ai/
├── src/
│   ├── App.jsx        # Main app with all 3 tabs
│   ├── index.css      # (empty — styles are in App.jsx)
│   └── main.jsx       # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — for the free ultra-fast inference API
- [Meta AI](https://ai.meta.com) — for the open-source Llama 3.3 model
- [Vite](https://vitejs.dev) — for the blazing fast React setup

---

## 📄 License

MIT License — free to use and modify.

---

⭐ If you found this useful, consider giving it a star!
